"use server";

import { randomUUID } from "node:crypto";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  categories,
  orderItems,
  orders,
  products,
  shops,
  users,
} from "@/schema/pos";
import { getDashboardContext } from "@/app/dashboard/context";
import type { PosDashboardData } from "@/types/dashboard";

export async function getPosDashboardData(): Promise<PosDashboardData> {
  const context = await getDashboardContext();
  if (!context) throw new Error("You must be signed in to view the dashboard.");

  const now = new Date();
  const fetchedAt = now.toISOString();
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
  const nextYearStart = new Date(Date.UTC(now.getUTCFullYear() + 1, 0, 1));
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const salesFilters = [
    eq(products.shopId, context.shopId),
    eq(orders.status, "completed"),
  ];
  if (context.role === "cashier") {
    salesFilters.push(eq(orders.userId, context.userId));
  }

  const salesWhere = and(...salesFilters);
  const [[shop], [profile], [inventory], allTimeRows, monthlyRows, todayRows, categoryRows, sellerRows, productRows] =
    await Promise.all([
      db.select({ name: shops.name }).from(shops).where(eq(shops.id, context.shopId)).limit(1),
      db.select({ name: users.name }).from(users).where(eq(users.id, context.userId)).limit(1),
      db
        .select({
          productCount: sql<number>`count(*)::int`,
          activeProducts: sql<number>`count(*) filter (where ${products.isActive} = true)::int`,
          lowStockProducts: sql<number>`count(*) filter (where ${products.stockQuantity} <= ${products.minStock})::int`,
          stockUnits: sql<number>`coalesce(sum(${products.stockQuantity}), 0)::int`,
          retailValue: sql<number>`coalesce(sum(${products.price} * coalesce(${products.stockQuantity}, 0)), 0)::float8`,
        })
        .from(products)
        .where(eq(products.shopId, context.shopId)),
      db
        .select({
          revenue: sql<string>`coalesce(sum(${orderItems.lineTotal}), 0)`,
          orders: sql<number>`count(distinct ${orders.id})::int`,
          itemsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(salesWhere),
      db
        .select({
          month: sql<number>`extract(month from ${orders.createdAt})::int`,
          revenue: sql<string>`coalesce(sum(${orderItems.lineTotal}), 0)`,
          orders: sql<number>`count(distinct ${orders.id})::int`,
          itemsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(
            salesWhere,
            gte(orders.createdAt, yearStart),
            lt(orders.createdAt, nextYearStart),
          ),
        )
        .groupBy(sql`extract(month from ${orders.createdAt})`),
      db
        .select({
          revenue: sql<string>`coalesce(sum(${orderItems.lineTotal}), 0)`,
          orders: sql<number>`count(distinct ${orders.id})::int`,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(salesWhere, gte(orders.createdAt, todayStart), lt(orders.createdAt, tomorrowStart)),
        ),
      db
        .select({
          label: sql<string>`coalesce(${categories.name}, 'Uncategorized')`,
          itemsSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)::int`,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          and(
            salesWhere,
            gte(orders.createdAt, yearStart),
            lt(orders.createdAt, nextYearStart),
          ),
        )
        .groupBy(categories.name)
        .orderBy(desc(sql`sum(${orderItems.quantity})`)),
      db
        .select({
          id: users.id,
          name: users.name,
          role: users.role,
          email: users.email,
          avatarUrl: users.avatarUrl,
          orders: sql<number>`count(distinct ${orders.id})::int`,
          sales: sql<string>`coalesce(sum(${orderItems.lineTotal}), 0)`,
        })
        .from(orderItems)
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .innerJoin(users, eq(orders.userId, users.id))
        .where(salesWhere)
        .groupBy(users.id, users.name, users.role, users.email, users.avatarUrl)
        .orderBy(desc(sql`sum(${orderItems.lineTotal})`))
        .limit(5),
      db
        .select({
          id: products.id,
          name: products.name,
          coverUrl: products.coverUrl,
          price: products.price,
        })
        .from(products)
        .where(eq(products.shopId, context.shopId))
        .orderBy(desc(products.createdAt))
        .limit(5),
    ]);

  if (!shop) throw new Error("Your shop could not be found.");

  const [allTime] = allTimeRows;
  const [today] = todayRows;
  const monthly = {
    revenue: Array.from({ length: 12 }, () => 0),
    orders: Array.from({ length: 12 }, () => 0),
    itemsSold: Array.from({ length: 12 }, () => 0),
  };
  for (const row of monthlyRows) {
    const index = row.month - 1;
    monthly.revenue[index] = Number(row.revenue);
    monthly.orders[index] = row.orders;
    monthly.itemsSold[index] = row.itemsSold;
  }

  const yearRevenue = monthly.revenue.reduce((total, value) => total + value, 0);
  const yearOrders = monthly.orders.reduce((total, value) => total + value, 0);
  const yearItemsSold = monthly.itemsSold.reduce((total, value) => total + value, 0);
  const topCategories = categoryRows.slice(0, 3);
  const otherCategoryItems = categoryRows
    .slice(3)
    .reduce((total, row) => total + row.itemsSold, 0);
  const categoryTotal = categoryRows.reduce((total, row) => total + row.itemsSold, 0);
  const inventoryStats = inventory ?? {
    productCount: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    stockUnits: 0,
    retailValue: 0,
  };

  return {
    snapshotId: randomUUID(),
    fetchedAt,
    shopName: shop.name,
    userName: profile?.name ?? "",
    role: context.role,
    summary: {
      grossSales: Number(allTime?.revenue ?? 0),
      completedOrders: allTime?.orders ?? 0,
      itemsSold: allTime?.itemsSold ?? 0,
      yearRevenue,
      yearOrders,
      yearItemsSold,
      todayRevenue: Number(today?.revenue ?? 0),
      todayOrders: today?.orders ?? 0,
      stockUnits: inventoryStats.stockUnits,
      productCount: inventoryStats.productCount,
      activeProducts: inventoryStats.activeProducts,
      lowStockProducts: inventoryStats.lowStockProducts,
      retailValue: inventoryStats.retailValue,
    },
    monthly,
    categorySales: [
      ...topCategories.map((row) => ({
        label: row.label,
        value: categoryTotal ? (row.itemsSold / categoryTotal) * 100 : 0,
      })),
      ...(otherCategoryItems
        ? [{ label: "Other", value: (otherCategoryItems / categoryTotal) * 100 }]
        : []),
    ],
    sellers: sellerRows.map((row, index) => ({
      id: row.id,
      name: row.name ?? row.email,
      role: row.role ?? "Staff",
      email: row.email,
      avatarUrl: row.avatarUrl ?? "",
      orders: row.orders,
      sales: Number(row.sales),
      rank: `Top ${index + 1}`,
    })),
    latestProducts: productRows.map((row) => ({
      id: row.id,
      name: row.name,
      coverUrl: row.coverUrl ?? "",
      price: Number(row.price),
    })),
  };
}
