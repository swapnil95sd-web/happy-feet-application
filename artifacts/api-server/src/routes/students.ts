import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, studentsTable, enrollmentsTable, classesTable } from "@workspace/db";
import {
  CreateStudentBody,
  GetStudentParams,
  GetStudentEnrollmentsParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/students", async (_req, res) => {
  const students = await db.select().from(studentsTable).orderBy(studentsTable.createdAt);
  res.json(students.map((s) => ({ ...s, createdAt: s.createdAt.toISOString() })));
});

router.post("/students", async (req, res) => {
  const body = CreateStudentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [created] = await db.insert(studentsTable).values(body.data).returning();
  res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
});

router.get("/students/:id", async (req, res) => {
  const params = GetStudentParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [s] = await db.select().from(studentsTable).where(eq(studentsTable.id, params.data.id));
  if (!s) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.json({ ...s, createdAt: s.createdAt.toISOString() });
});

router.get("/students/:id/enrollments", async (req, res) => {
  const params = GetStudentEnrollmentsParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rows = await db
    .select()
    .from(enrollmentsTable)
    .innerJoin(classesTable, eq(enrollmentsTable.classId, classesTable.id))
    .where(eq(enrollmentsTable.studentId, params.data.id));

  res.json(
    rows.map((r) => ({
      id: r.enrollments.id,
      studentId: r.enrollments.studentId,
      classId: r.enrollments.classId,
      status: r.enrollments.status,
      createdAt: r.enrollments.createdAt.toISOString(),
      class: { ...r.classes, createdAt: r.classes.createdAt.toISOString() },
    }))
  );
});

export default router;
