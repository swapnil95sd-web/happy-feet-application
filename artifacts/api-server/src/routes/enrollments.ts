import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable, enrollmentsTable, classesTable } from "@workspace/db";
import {
  CreateEnrollmentBody,
  UpdateEnrollmentParams,
  UpdateEnrollmentBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/enrollments", async (_req, res) => {
  const rows = await db
    .select()
    .from(enrollmentsTable)
    .innerJoin(studentsTable, eq(enrollmentsTable.studentId, studentsTable.id))
    .innerJoin(classesTable, eq(enrollmentsTable.classId, classesTable.id))
    .orderBy(enrollmentsTable.createdAt);

  res.json(
    rows.map((r) => ({
      id: r.enrollments.id,
      status: r.enrollments.status,
      createdAt: r.enrollments.createdAt.toISOString(),
      student: { ...r.students, createdAt: r.students.createdAt.toISOString() },
      class: { ...r.classes, createdAt: r.classes.createdAt.toISOString() },
    }))
  );
});

router.post("/enrollments", async (req, res) => {
  const body = CreateEnrollmentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { classId, firstName, lastName, email, phone, studentType, studentId } = body.data;

  let resolvedStudentId = studentId;

  if (!resolvedStudentId) {
    // Create student if no studentId provided
    const [student] = await db
      .insert(studentsTable)
      .values({ firstName, lastName, email, phone, studentType })
      .returning();
    resolvedStudentId = student.id;
  }

  // Check if already enrolled
  const [existing] = await db
    .select()
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.studentId, resolvedStudentId!))
    .limit(1);

  if (existing && existing.classId === classId) {
    res.status(409).json({ error: "Already enrolled in this class" });
    return;
  }

  const [enrollment] = await db
    .insert(enrollmentsTable)
    .values({ studentId: resolvedStudentId!, classId, status: "confirmed" })
    .returning();

  // Decrement spots available
  const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, classId));
  if (cls && cls.spotsAvailable > 0) {
    await db
      .update(classesTable)
      .set({ spotsAvailable: cls.spotsAvailable - 1 })
      .where(eq(classesTable.id, classId));
  }

  res.status(201).json({
    ...enrollment,
    createdAt: enrollment.createdAt.toISOString(),
  });
});

router.patch("/enrollments/:id", async (req, res) => {
  const params = UpdateEnrollmentParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateEnrollmentBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [updated] = await db
    .update(enrollmentsTable)
    .set(body.data)
    .where(eq(enrollmentsTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Enrollment not found" });
    return;
  }
  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

export default router;
