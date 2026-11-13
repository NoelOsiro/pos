import { pgTable, text, timestamp, varchar, numeric, integer, boolean, jsonb } from "drizzle-orm/pg-core";

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

export const categories = pgTable("categories", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id", { length: 255 }).primaryKey(),
  sku: text("sku").notNull().unique(),
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
});

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
