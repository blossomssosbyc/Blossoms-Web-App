import { mysqlTable, serial, varchar, int, timestamp, uniqueIndex, index } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const registrations = mysqlTable("REGISTRATIONS", {
  registrationId: serial("registration_id").primaryKey(),
  eventName: varchar("event_name", { length: 255 }).notNull().unique(),
  schoolOfSciences: int("school_of_sciences").notNull().default(0),
  schoolOfPsychologicalSciences: int("school_of_psychological_sciences").notNull().default(0),
  schoolOfSocialSciences: int("school_of_social_sciences_humanities_performing_arts").notNull().default(0),
  schoolOfBusiness: int("school_of_business_and_management").notNull().default(0),
  schoolOfCommerce: int("school_of_commerce_finance_accountancy").notNull().default(0),
  total: int("total").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const schoolOfSciences = mysqlTable("SCHOOL_OF_SCIENCES", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 255 }).notNull().unique(),
  totalReg: int("total_reg").notNull().default(0),
  turnUp: int("turn_up").notNull().default(0),
  turnDown: int("turn_down").notNull().default(0),
  score: int("score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const schoolOfSocialSciences = mysqlTable("SCHOOL_OF_SOCIAL_SCIENCES", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 255 }).notNull().unique(),
  totalReg: int("total_reg").notNull().default(0),
  turnUp: int("turn_up").notNull().default(0),
  turnDown: int("turn_down").notNull().default(0),
  score: int("score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const schoolOfBusiness = mysqlTable("SCHOOL_OF_BUSINESS_AND_MANAGEMENT", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 255 }).notNull().unique(),
  totalReg: int("total_reg").notNull().default(0),
  turnUp: int("turn_up").notNull().default(0),
  turnDown: int("turn_down").notNull().default(0),
  score: int("score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const schoolOfCommerce = mysqlTable("SCHOOL_OF_COMMERCE_FINANCE_ACCOUNTANCY", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 255 }).notNull().unique(),
  totalReg: int("total_reg").notNull().default(0),
  turnUp: int("turn_up").notNull().default(0),
  turnDown: int("turn_down").notNull().default(0),
  score: int("score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const schoolOfPsychology = mysqlTable("SCHOOL_OF_PSYCHOLOGICAL_SCIENCES", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 255 }).notNull().unique(),
  totalReg: int("total_reg").notNull().default(0),
  turnUp: int("turn_up").notNull().default(0),
  turnDown: int("turn_down").notNull().default(0),
  score: int("score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const winnersList = mysqlTable("WINNERS_LIST", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 255 }).notNull(),
  position: varchar("position", { length: 50 }).notNull(),
  school: varchar("school", { length: 255 }).notNull(),
  class: varchar("class", { length: 100 }).notNull(),
  team: varchar("team", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

/**
 * NEW: POINTS_TABLE schema
 * Columns:
 *  id (int AI PK)
 *  event (varchar(255))
 *  school_of_sciences (int)
 *  school_of_psychological_sciences (int)
 *  school_of_social_sciences (int)
 *  school_of_business_and_management (int)
 *  school_of_commerce (int)
 *  created_at (timestamp)
 */
export const pointsTable = mysqlTable("POINTS_TABLE", {
  id: serial("id").primaryKey(),
  event: varchar("event", { length: 255 }).notNull().unique(),
  school_of_sciences: int("school_of_sciences").notNull().default(0),
  school_of_psychological_sciences: int("school_of_psychological_sciences").notNull().default(0),
  school_of_social_sciences: int("school_of_social_sciences").notNull().default(0),
  school_of_business_and_management: int("school_of_business_and_management").notNull().default(0),
  school_of_commerce: int("school_of_commerce").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Types for points table
export type PointsData = typeof pointsTable.$inferSelect;
export type InsertPointsData = typeof pointsTable.$inferInsert;
