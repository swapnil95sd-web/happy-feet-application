import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, videosTable, classesTable } from "@workspace/db";
import { CreateVideoBody, DeleteVideoParams, ListVideosQueryParams } from "@workspace/api-zod";

const router = Router();

router.get("/videos", async (req, res) => {
  const query = ListVideosQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: "Invalid query" });
    return;
  }

  const rows = await db
    .select({
      id: videosTable.id,
      title: videosTable.title,
      url: videosTable.url,
      description: videosTable.description,
      classId: videosTable.classId,
      className: classesTable.name,
      createdAt: videosTable.createdAt,
    })
    .from(videosTable)
    .leftJoin(classesTable, eq(videosTable.classId, classesTable.id));

  const filtered = query.data.classId
    ? rows.filter((v) => v.classId === query.data.classId)
    : rows;

  res.json(
    filtered.map((v) => ({
      ...v,
      description: v.description ?? null,
      classId: v.classId ?? null,
      className: v.className ?? null,
      createdAt: v.createdAt.toISOString(),
    }))
  );
});

router.post("/videos", async (req, res) => {
  const body = CreateVideoBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [created] = await db.insert(videosTable).values(body.data).returning();

  let className: string | null = null;
  if (created.classId) {
    const [cls] = await db.select().from(classesTable).where(eq(classesTable.id, created.classId));
    className = cls?.name ?? null;
  }

  res.status(201).json({
    ...created,
    description: created.description ?? null,
    classId: created.classId ?? null,
    className,
    createdAt: created.createdAt.toISOString(),
  });
});

router.delete("/videos/:id", async (req, res) => {
  const params = DeleteVideoParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(videosTable).where(eq(videosTable.id, params.data.id));
  res.status(204).send();
});

export default router;
