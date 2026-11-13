"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { and, count, eq, inArray, ne } from "drizzle-orm";
import { kebabCase } from "es-toolkit";

import type {
  ICategoryItem,
  IProductItem,
  ProductFormValues,
} from "@/types/product";
import type { UserRole } from "@/auth/types";

import { db } from "@/lib/db";
import { categories, products } from "@/schema/pos";
import { paths } from "@/routes/paths";
import { getDashboardContext } from "@/app/dashboard/context";

type ActionResult = { success: true; id?: string } | { success: false; error: string };
type ProductImportResult =
  | { success: true; inserted: number }
  | { success: false; error: string; rowErrors?: string[] };

const PRODUCT_WRITE_ROLES: UserRole[] = ["admin", "manager", "cashier"];
const CATEGORY_WRITE_ROLES: UserRole[] = ["admin", "manager"];
const PRODUCT_IMPORT_BATCH_SIZE = 100;
const PRODUCT_IMPORT_MAX_ROWS = 1000;
const PRODUCT_IMPORT_MAX_PAYLOAD_CHARS = 600_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseProductInput(input: unknown): ProductFormValues | string {
  if (!isRecord(input)) return "Enter valid product details.";

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const sku = typeof input.sku === "string" ? input.sku.trim() : "";
  const categoryId = typeof input.categoryId === "string" ? input.categoryId.trim() : "";
  const price =
    typeof input.price === "string" || typeof input.price === "number"
      ? String(input.price).trim()
      : "";
  const costPrice =
    typeof input.costPrice === "string" || typeof input.costPrice === "number"
      ? String(input.costPrice).trim()
      : "";
  const stockQuantity = input.stockQuantity;
  const minStock = input.minStock;
  const coverUrl = typeof input.coverUrl === "string" ? input.coverUrl.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";
  const isActive = input.isActive;

  if (!name || name.length > 160) return "Product name is required and must be 160 characters or fewer.";
  if (!sku || sku.length > 80) return "SKU is required and must be 80 characters or fewer.";

  const validMoney = (value: string) => /^\d{1,10}(\.\d{1,2})?$/.test(value);
  if (!validMoney(price)) return "Enter a valid price with up to 10 digits and 2 decimals.";
  if (costPrice && !validMoney(costPrice)) {
    return "Enter a valid cost price with up to 10 digits and 2 decimals.";
  }

  const validQuantity = (value: unknown): value is number =>
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 2_147_483_647;
  if (!validQuantity(stockQuantity) || !validQuantity(minStock)) {
    return "Stock quantities must be non-negative whole numbers.";
  }
  if (description.length > 2000) return "Description must be 2,000 characters or fewer.";
  if (coverUrl.length > 2048) return "Image URL is too long.";
  if (coverUrl) {
    try {
      const url = new URL(coverUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return "Image URL must use HTTP or HTTPS.";
      }
    } catch {
      return "Enter a valid image URL.";
    }
  }
  if (typeof isActive !== "boolean") return "Select whether this product is active.";

  return {
    name,
    sku,
    categoryId,
    price,
    costPrice,
    stockQuantity,
    minStock,
    coverUrl,
    description,
    isActive,
  };
}

function toProductItem(row: {
  id: string;
  sku: string;
  name: string;
  categoryId: string | null;
  categoryName: string | null;
  price: string;
  costPrice: string | null;
  stockQuantity: number | null;
  minStock: number | null;
  coverUrl: string | null;
  description: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}): IProductItem {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    categoryId: row.categoryId ?? undefined,
    category: row.categoryName ?? undefined,
    price: Number(row.price),
    costPrice: row.costPrice ? Number(row.costPrice) : undefined,
    stockQuantity: row.stockQuantity ?? 0,
    minStock: row.minStock ?? 0,
    coverUrl: row.coverUrl ?? undefined,
    description: row.description ?? undefined,
    isActive: row.isActive ?? true,
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getInventoryProductsAction(): Promise<IProductItem[]> {
  const context = await getDashboardContext();
  if (!context) throw new Error("You must be signed in to view inventory.");

  const rows = await db
    .select({
      id: products.id,
      sku: products.sku,
      name: products.name,
      categoryId: products.categoryId,
      categoryName: categories.name,
      price: products.price,
      costPrice: products.costPrice,
      stockQuantity: products.stockQuantity,
      minStock: products.minStock,
      coverUrl: products.coverUrl,
      description: products.description,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.shopId, context.shopId))
    .orderBy(products.name);

  return rows.map(toProductItem);
}

export async function getInventoryProductAction(id: string): Promise<IProductItem | null> {
  const context = await getDashboardContext();
  if (!context) throw new Error("You must be signed in to view inventory.");
  if (typeof id !== "string" || !id || id.length > 255) return null;

  const [row] = await db
    .select({
      id: products.id,
      sku: products.sku,
      name: products.name,
      categoryId: products.categoryId,
      categoryName: categories.name,
      price: products.price,
      costPrice: products.costPrice,
      stockQuantity: products.stockQuantity,
      minStock: products.minStock,
      coverUrl: products.coverUrl,
      description: products.description,
      isActive: products.isActive,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.id, id), eq(products.shopId, context.shopId)))
    .limit(1);

  return row ? toProductItem(row) : null;
}

export async function getInventoryCategoriesAction(): Promise<ICategoryItem[]> {
  const context = await getDashboardContext();
  if (!context) throw new Error("You must be signed in to view categories.");

  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      createdAt: categories.createdAt,
      productCount: count(products.id),
    })
    .from(categories)
    .leftJoin(
      products,
      and(
        eq(products.categoryId, categories.id),
        eq(products.shopId, context.shopId),
      ),
    )
    .groupBy(categories.id)
    .orderBy(categories.name);

  return rows.map((row) => ({
    ...row,
    description: row.description ?? undefined,
    createdAt: row.createdAt?.toISOString(),
    productCount: Number(row.productCount),
  }));
}

export async function canManageInventoryCategoriesAction(): Promise<boolean> {
  const context = await getDashboardContext();
  return context !== null && CATEGORY_WRITE_ROLES.includes(context.role);
}

export async function canManageInventoryProductsAction(): Promise<boolean> {
  const context = await getDashboardContext();
  return context !== null && PRODUCT_WRITE_ROLES.includes(context.role);
}

export async function createInventoryProductAction(input: unknown): Promise<ActionResult> {
  const context = await getDashboardContext();
  if (!context) return { success: false, error: "Sign in to add products." };
  if (!PRODUCT_WRITE_ROLES.includes(context.role)) {
    return { success: false, error: "You do not have permission to add products." };
  }

  const values = parseProductInput(input);
  if (typeof values === "string") return { success: false, error: values };

  const [existingSku] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.shopId, context.shopId), eq(products.sku, values.sku)))
    .limit(1);
  if (existingSku) return { success: false, error: "That SKU is already in use." };

  if (values.categoryId) {
    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, values.categoryId))
      .limit(1);
    if (!category) return { success: false, error: "Select an existing category." };
  }

  const id = randomUUID();
  try {
    await db.insert(products).values({
      id,
      shopId: context.shopId,
      sku: values.sku,
      name: values.name,
      categoryId: values.categoryId || null,
      price: values.price,
      costPrice: values.costPrice || null,
      stockQuantity: values.stockQuantity,
      minStock: values.minStock,
      coverUrl: values.coverUrl || null,
      description: values.description || null,
      isActive: values.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidateInventoryPaths(id);
    return { success: true, id };
  } catch (error) {
    console.error("Failed to create inventory product:", error);
    return { success: false, error: "Unable to save the product. Check that the SKU is unique and try again." };
  }
}

export async function updateInventoryProductAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const context = await getDashboardContext();
  if (!context) return { success: false, error: "Sign in to update products." };
  if (!PRODUCT_WRITE_ROLES.includes(context.role)) {
    return { success: false, error: "You do not have permission to update products." };
  }
  if (typeof id !== "string" || !id || id.length > 255) {
    return { success: false, error: "Invalid product." };
  }

  const values = parseProductInput(input);
  if (typeof values === "string") return { success: false, error: values };

  const [existingProduct] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, id), eq(products.shopId, context.shopId)))
    .limit(1);
  if (!existingProduct) return { success: false, error: "Product not found." };

  const [existingSku] = await db
    .select({ id: products.id })
    .from(products)
    .where(
      and(
        eq(products.shopId, context.shopId),
        eq(products.sku, values.sku),
        ne(products.id, id),
      ),
    )
    .limit(1);
  if (existingSku) return { success: false, error: "That SKU is already in use." };

  if (values.categoryId) {
    const [category] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.id, values.categoryId))
      .limit(1);
    if (!category) return { success: false, error: "Select an existing category." };
  }

  try {
    await db
      .update(products)
      .set({
        sku: values.sku,
        name: values.name,
        categoryId: values.categoryId || null,
        price: values.price,
        costPrice: values.costPrice || null,
        stockQuantity: values.stockQuantity,
        minStock: values.minStock,
        coverUrl: values.coverUrl || null,
        description: values.description || null,
        isActive: values.isActive,
        updatedAt: new Date(),
      })
      .where(and(eq(products.id, id), eq(products.shopId, context.shopId)));

    revalidateInventoryPaths(id);
    return { success: true, id };
  } catch (error) {
    console.error("Failed to update inventory product:", error);
    return { success: false, error: "Unable to update the product. Check that the SKU is unique and try again." };
  }
}

export async function importInventoryProductsAction(
  input: unknown,
): Promise<ProductImportResult> {
  const context = await getDashboardContext();
  if (!context) return { success: false, error: "Sign in to import products." };
  if (!PRODUCT_WRITE_ROLES.includes(context.role)) {
    return { success: false, error: "You do not have permission to import products." };
  }
  if (!Array.isArray(input) || input.length === 0) {
    return { success: false, error: "The CSV file does not contain any product rows." };
  }
  if (input.length > PRODUCT_IMPORT_MAX_ROWS) {
    return {
      success: false,
      error: `Import up to ${PRODUCT_IMPORT_MAX_ROWS} products at a time.`,
    };
  }
  if (JSON.stringify(input).length > PRODUCT_IMPORT_MAX_PAYLOAD_CHARS) {
    return { success: false, error: "The parsed CSV is too large to import in one batch." };
  }

  const rowErrors: string[] = [];
  const parsedRows: Array<{
    rowNumber: number;
    values: ProductFormValues;
    category: string;
  }> = [];
  const firstRowBySku = new Map<string, number>();

  input.forEach((inputRow: unknown, index: number) => {
    const rowNumber = index + 2;
    if (!isRecord(inputRow)) {
      rowErrors.push(`Row ${rowNumber}: invalid product row.`);
      return;
    }

    const values = parseProductInput({ ...inputRow, categoryId: "" });
    if (typeof values === "string") {
      rowErrors.push(`Row ${rowNumber}: ${values}`);
      return;
    }

    const category =
      typeof inputRow.category === "string" ? inputRow.category.trim() : "";
    if (category.length > 255) {
      rowErrors.push(`Row ${rowNumber}: category must be 255 characters or fewer.`);
      return;
    }

    const earlierRow = firstRowBySku.get(values.sku);
    if (earlierRow) {
      rowErrors.push(`Row ${rowNumber}: SKU duplicates row ${earlierRow}.`);
    } else {
      firstRowBySku.set(values.sku, rowNumber);
    }
    parsedRows.push({ rowNumber, values, category });
  });

  if (rowErrors.length) return { success: false, error: "Fix the CSV rows and try again.", rowErrors };

  const categoryRows = await db
    .select({ id: categories.id, name: categories.name, slug: categories.slug })
    .from(categories);
  const categoriesByKey = new Map<string, string>();
  categoryRows.forEach((category) => {
    categoriesByKey.set(category.id.toLowerCase(), category.id);
    categoriesByKey.set(category.name.trim().toLowerCase(), category.id);
    categoriesByKey.set(category.slug.trim().toLowerCase(), category.id);
  });

  const valuesWithCategories = parsedRows.map(({ rowNumber, values, category }) => {
    const categoryId = category ? categoriesByKey.get(category.toLowerCase()) : undefined;
    if (category && !categoryId) {
      rowErrors.push(
        `Row ${rowNumber}: category "${category}" does not match an existing global category.`,
      );
    }
    return { rowNumber, values, categoryId };
  });
  if (rowErrors.length) return { success: false, error: "Fix the CSV rows and try again.", rowErrors };

  const skus = parsedRows.map(({ values }) => values.sku);
  const existingProducts = await db
    .select({ sku: products.sku })
    .from(products)
    .where(and(eq(products.shopId, context.shopId), inArray(products.sku, skus)));
  const existingSkuSet = new Set(existingProducts.map(({ sku }) => sku));
  existingSkuSet.forEach((sku) => {
    parsedRows.forEach(({ rowNumber, values }) => {
      if (values.sku === sku) rowErrors.push(`Row ${rowNumber}: SKU "${sku}" already exists in this shop.`);
    });
  });
  if (rowErrors.length) return { success: false, error: "Fix the CSV rows and try again.", rowErrors };

  const now = new Date();
  const inserts = valuesWithCategories.map(({ values, categoryId }) => ({
    id: randomUUID(),
    shopId: context.shopId,
    sku: values.sku,
    name: values.name,
    categoryId: categoryId ?? null,
    price: values.price,
    costPrice: values.costPrice || null,
    stockQuantity: values.stockQuantity,
    minStock: values.minStock,
    coverUrl: values.coverUrl || null,
    description: values.description || null,
    isActive: values.isActive,
    createdAt: now,
    updatedAt: now,
  }));
  const batches = Array.from(
    { length: Math.ceil(inserts.length / PRODUCT_IMPORT_BATCH_SIZE) },
    (_, batchIndex) =>
      db
        .insert(products)
        .values(
          inserts.slice(
            batchIndex * PRODUCT_IMPORT_BATCH_SIZE,
            (batchIndex + 1) * PRODUCT_IMPORT_BATCH_SIZE,
          ),
        ),
  );
  const [firstBatch, ...remainingBatches] = batches;
  if (!firstBatch) {
    return { success: false, error: "No valid products were prepared for import." };
  }

  try {
    await db.batch([firstBatch, ...remainingBatches]);
    revalidateInventoryPaths("");
    return { success: true, inserted: inserts.length };
  } catch (error) {
    console.error("Failed to batch import inventory products:", error);
    return {
      success: false,
      error: "No products were imported. Check for duplicate SKUs and try again.",
    };
  }
}

export async function createInventoryCategoryAction(input: unknown): Promise<ActionResult> {
  const context = await getDashboardContext();
  if (!context) return { success: false, error: "Sign in to add categories." };
  if (!CATEGORY_WRITE_ROLES.includes(context.role)) {
    return { success: false, error: "Only administrators and managers can add categories." };
  }

  if (!isRecord(input)) {
    return { success: false, error: "Enter valid category details." };
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  const description =
    typeof input.description === "string" ? input.description.trim() : "";
  if (!name || name.length > 120) {
    return { success: false, error: "Category name is required and must be 120 characters or fewer." };
  }
  if (description.length > 1000) {
    return { success: false, error: "Description must be 1,000 characters or fewer." };
  }

  const slug = kebabCase(name);
  if (!slug) return { success: false, error: "Use a category name containing letters or numbers." };

  const [existing] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);
  if (existing) return { success: false, error: "A category with that name already exists." };

  try {
    await db.insert(categories).values({
      id: randomUUID(),
      name,
      slug,
      description: description || null,
      createdAt: new Date(),
    });
    revalidatePath(paths.dashboard.inventory.categories);
    revalidatePath(paths.dashboard.inventory.create);
    revalidatePath(paths.dashboard.inventory.list);
    return { success: true };
  } catch (error) {
    console.error("Failed to create inventory category:", error);
    return { success: false, error: "Unable to save the category. Check that its name is unique and try again." };
  }
}

function revalidateInventoryPaths(id: string) {
  revalidatePath(paths.dashboard.inventory.root);
  revalidatePath(paths.dashboard.inventory.list);
  revalidatePath(paths.dashboard.inventory.categories);
  if (id) {
    revalidatePath(paths.dashboard.inventory.details(id));
    revalidatePath(paths.dashboard.inventory.edit(id));
  }
}
