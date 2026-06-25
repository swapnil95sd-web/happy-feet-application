import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { studentsTable } from "./students";
import { classesTable } from "./classes";

export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id),
  classId: integer("class_id").notNull().references(() => classesTable.id),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEnrollmentSchema = createInsertSchema(enrollmentsTable).omit({ id: true, createdAt: true });
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollmentsTable.$inferSelect;
