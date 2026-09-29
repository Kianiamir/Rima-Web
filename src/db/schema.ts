import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  bigint,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* Admin & sessions                                                    */
/* ------------------------------------------------------------------ */

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 190 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  // sha256 of the opaque cookie token — the raw token never touches the DB.
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Portfolio + private project management                              */
/* ------------------------------------------------------------------ */

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 190 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  summary: varchar("summary", { length: 300 }).notNull(),
  description: text("description").notNull().default(""),
  // Uploaded cover (path under /uploads). Empty → gradient placeholder.
  coverImage: varchar("cover_image", { length: 300 }).notNull().default(""),
  coverGradient: varchar("cover_gradient", { length: 200 })
    .notNull()
    .default("from-[#7C6CFF] to-[#2DD4BF]"),
  link: varchar("link", { length: 300 }).notNull().default(""),
  year: varchar("year", { length: 10 }).notNull().default(""),
  tags: text("tags").notNull().default(""), // comma-separated
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),

  // ── Private management data (never shown on the public site) ──
  clientName: varchar("client_name", { length: 120 }).notNull().default(""),
  clientPhone: varchar("client_phone", { length: 40 }).notNull().default(""),
  clientEmail: varchar("client_email", { length: 190 }).notNull().default(""),
  // Amounts in Toman.
  contractAmount: bigint("contract_amount", { mode: "number" }),
  paidAmount: bigint("paid_amount", { mode: "number" }).notNull().default(0),
  startDate: date("start_date"),
  dueDate: date("due_date"),
  internalNote: text("internal_note").notNull().default(""),
});

/* ------------------------------------------------------------------ */
/* Per-project tasks (the admin todo lists)                            */
/* ------------------------------------------------------------------ */

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  // Null → personal task, not tied to a project.
  projectId: integer("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  title: varchar("title", { length: 300 }).notNull(),
  isDone: boolean("is_done").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

/* ------------------------------------------------------------------ */
/* Contact messages                                                    */
/* ------------------------------------------------------------------ */

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 190 }).notNull(),
  phone: varchar("phone", { length: 40 }).notNull().default(""),
  body: text("body").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
