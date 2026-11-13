import {
  pgTable,
  text,
  timestamp,
  varchar,
  numeric,
  integer,
  boolean,
  jsonb,
  unique,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  role: varchar("role", { length: 32 }).default("cashier"),
  avatarUrl: text("avatar_url"),
  phoneNumber: text("phone_number"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
});

export const userRoles = pgTable("user_roles", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: varchar("name", { length: 64 }).notNull().unique(),
  permissions: jsonb("permissions").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shops = pgTable(
  "shops",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: text("name").notNull(),
    location: text("location").notNull(),
    address: text("address").notNull(),
    businessType: varchar("business_type", { length: 64 }).notNull(),
    contactEmail: text("contact_email"),
    contactPhone: text("contact_phone"),
    inviteCodeHash: varchar("invite_code_hash", { length: 64 })
      .notNull()
      .unique(),
    createdBy: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [index("shops_created_by_idx").on(table.createdBy)],
);

export const shopMembers = pgTable(
  "shop_members",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    shopId: varchar("shop_id", { length: 255 })
      .notNull()
      .references(() => shops.id, { onDelete: "cascade" }),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 32 }).notNull().default("cashier"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("shop_members_shop_user_key").on(table.shopId, table.userId),
    index("shop_members_user_id_idx").on(table.userId),
  ],
);

export const categories = pgTable("categories", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id", { length: 255 }).primaryKey(),
  shopId: varchar("shop_id", { length: 255 }).references(() => shops.id, {
    onDelete: "cascade",
  }),
  sku: text("sku").notNull(),
  name: text("name").notNull(),
  categoryId: varchar("category_id", { length: 255 }),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  costPrice: numeric("cost_price", { precision: 12, scale: 2 }),
  stockQuantity: integer("stock_quantity").default(0),
  minStock: integer("min_stock").default(0),
  coverUrl: text("cover_url"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("products_shop_sku_key").on(table.shopId, table.sku),
  index("products_shop_id_idx").on(table.shopId),
]);

export const customers = pgTable("customers", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country"),
  totalSpent: numeric("total_spent", { precision: 12, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: varchar("customer_id", { length: 255 }),
  userId: varchar("user_id", { length: 255 }),
  status: varchar("status", { length: 32 }).default("pending"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0"),
  discount: numeric("discount", { precision: 12, scale: 2 }).default("0"),
  shipping: numeric("shipping", { precision: 12, scale: 2 }).default("0"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderId: varchar("order_id", { length: 255 }).notNull(),
  productId: varchar("product_id", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
  lineTotal: numeric("line_total", { precision: 12, scale: 2 }).notNull(),
});

export const invoices = pgTable("invoices", {
  id: varchar("id", { length: 255 }).primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  orderId: varchar("order_id", { length: 255 }),
  customerId: varchar("customer_id", { length: 255 }),
  status: varchar("status", { length: 32 }).default("unpaid"),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0"),
  discount: numeric("discount", { precision: 12, scale: 2 }).default("0"),
  totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id", { length: 255 }).primaryKey(),
  orderId: varchar("order_id", { length: 255 }),
  invoiceId: varchar("invoice_id", { length: 255 }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).default("completed"),
  transactionRef: text("transaction_ref"),
  createdAt: timestamp("created_at").defaultNow(),
});
