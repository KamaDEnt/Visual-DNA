import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const accountTypeEnum = pgEnum("account_type", ["cliente", "prestador"]);
export const pixKeyTypeEnum = pgEnum("pix_key_type", ["cpf", "cnpj", "email", "phone", "random"]);

export const usersTable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  accountType: accountTypeEnum("account_type").notNull(),
  specialty: text("specialty"),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const professionalBankingTable = pgTable("professional_banking", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
  pixKeyType: pixKeyTypeEnum("pix_key_type").notNull(),
  pixKey: text("pix_key").notNull(),
  fullName: text("full_name").notNull(),
  cpfCnpj: text("cpf_cnpj").notNull(),
  bankName: text("bank_name"),
  agency: text("agency"),
  accountNumber: text("account_number"),
  bankAccountType: text("bank_account_type"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  passwordHash: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const insertBankingSchema = createInsertSchema(professionalBankingTable).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(usersTable).omit({ passwordHash: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
export type PublicUser = Omit<User, "passwordHash">;
export type InsertBanking = z.infer<typeof insertBankingSchema>;
export type Banking = typeof professionalBankingTable.$inferSelect;
