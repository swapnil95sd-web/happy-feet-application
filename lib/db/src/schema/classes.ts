import { pgTable, serial, text, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const classesTable = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  style: text("style").notNull(),
  description: text("description").notNull(),
  instructor: text("instructor").notNull(),
  location: text("location").notNull(),
  scheduleDay: text("schedule_day").notNull(),
  scheduleTime: text("schedule_time").notNull(),
  price: real("price").notNull(),
  pricePeriod: text("price_period").notNull(),
  duration: text("duration").notNull(),
  ageGroup: text("age_group").notNull(),
  category: text("category").notNull(),
  capacity: integer("capacity").notNull(),
  spotsAvailable: integer("spots_available").notNull(),
  colorScheme: text("color_scheme").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertClassSchema = createInsertSchema(classesTable).omit({ id: true, createdAt: true });
export type InsertClass = z.infer<typeof insertClassSchema>;
export type DanceClass = typeof classesTable.$inferSelect;
