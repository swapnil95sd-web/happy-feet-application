import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, classesTable, enrollmentsTable, studentsTable } from "@workspace/db";
import {
  CreateClassBody,
  UpdateClassBody,
  GetClassParams,
  UpdateClassParams,
  DeleteClassParams,
  ListClassesQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/classes", async (req, res) => {
  const query = ListClassesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { category } = query.data;
  let classes;
  if (category) {
    classes = await db
      .select()
      .from(classesTable)
      .where(eq(classesTable.category, category));
  } else {
    classes = await db.select().from(classesTable);
  }
  res.json(
    classes.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }))
  );
});

router.post("/classes", async (req, res) => {
  const body = CreateClassBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [created] = await db.insert(classesTable).values(body.data).returning();
  res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
});

router.get("/classes/:id", async (req, res) => {
  const params = GetClassParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [c] = await db.select().from(classesTable).where(eq(classesTable.id, params.data.id));
  if (!c) {
    res.status(404).json({ error: "Class not found" });
    return;
  }
  res.json({ ...c, createdAt: c.createdAt.toISOString() });
});

router.patch("/classes/:id", async (req, res) => {
  const params = UpdateClassParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateClassBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  const [updated] = await db
    .update(classesTable)
    .set(body.data)
    .where(eq(classesTable.id, params.data.id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Class not found" });
    return;
  }
  res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
});

router.delete("/classes/:id", async (req, res) => {
  const params = DeleteClassParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(classesTable).where(eq(classesTable.id, params.data.id));
  res.status(204).send();
});

router.get("/classes/:id/enrollments", async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rows = await db
    .select()
    .from(enrollmentsTable)
    .innerJoin(studentsTable, eq(enrollmentsTable.studentId, studentsTable.id))
    .where(eq(enrollmentsTable.classId, id))
    .orderBy(enrollmentsTable.createdAt);

  res.json(
    rows.map((r) => ({
      id: r.enrollments.id,
      status: r.enrollments.status,
      createdAt: r.enrollments.createdAt.toISOString(),
      student: { ...r.students, createdAt: r.students.createdAt.toISOString() },
    }))
  );
});

export default router;
