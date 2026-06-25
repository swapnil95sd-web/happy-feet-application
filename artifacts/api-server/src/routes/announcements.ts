import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, announcementsTable } from "@workspace/db";
import { CreateAnnouncementBody, DeleteAnnouncementParams } from "@workspace/api-zod";

const router = Router();

router.get("/announcements", async (_req, res) => {
  const announcements = await db
    .select()
    .from(announcementsTable)
    .orderBy(announcementsTable.publishedAt);
  res.json(
    announcements.map((a) => ({ ...a, publishedAt: a.publishedAt.toISOString() }))
  );
});

router.post("/announcements", async (req, res) => {
  const body = CreateAnnouncementBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const [created] = await db.insert(announcementsTable).values(body.data).returning();
  res.status(201).json({ ...created, publishedAt: created.publishedAt.toISOString() });
});

router.delete("/announcements/:id", async (req, res) => {
  const params = DeleteAnnouncementParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(announcementsTable).where(eq(announcementsTable.id, params.data.id));
  res.status(204).send();
});

export default router;
