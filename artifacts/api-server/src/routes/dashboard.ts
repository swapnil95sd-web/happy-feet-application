import { Router } from "express";
import { count, eq, sql } from "drizzle-orm";
import { db, studentsTable, classesTable, enrollmentsTable, announcementsTable } from "@workspace/db";

const router = Router();

router.get("/dashboard/summary", async (_req, res) => {
  const [totalStudentsRow] = await db.select({ count: count() }).from(studentsTable);
  const [activeClassesRow] = await db.select({ count: count() }).from(classesTable);
  const [totalEnrollmentsRow] = await db.select({ count: count() }).from(enrollmentsTable);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [announcementsRow] = await db
    .select({ count: count() })
    .from(announcementsTable)
    .where(sql`${announcementsTable.publishedAt} >= ${startOfMonth}`);

  const [newStudentsRow] = await db
    .select({ count: count() })
    .from(studentsTable)
    .where(sql`${studentsTable.createdAt} >= ${startOfMonth}`);

  // Classes with no spots available = "waitlist"
  const [waitlistRow] = await db
    .select({ count: count() })
    .from(classesTable)
    .where(eq(classesTable.spotsAvailable, 0));

  res.json({
    totalStudents: totalStudentsRow.count,
    activeClasses: activeClassesRow.count,
    totalEnrollments: totalEnrollmentsRow.count,
    announcementsThisMonth: announcementsRow.count,
    newStudentsThisMonth: newStudentsRow.count,
    classesWithWaitlist: waitlistRow.count,
  });
});

router.get("/dashboard/recent-enrollments", async (_req, res) => {
  const rows = await db
    .select()
    .from(enrollmentsTable)
    .innerJoin(studentsTable, eq(enrollmentsTable.studentId, studentsTable.id))
    .innerJoin(classesTable, eq(enrollmentsTable.classId, classesTable.id))
    .orderBy(sql`${enrollmentsTable.createdAt} DESC`)
    .limit(10);

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

router.get("/dashboard/schedule", async (_req, res) => {
  const classes = await db.select().from(classesTable);

  const enrollmentCounts: Record<number, number> = {};
  for (const cls of classes) {
    const [row] = await db
      .select({ count: count() })
      .from(enrollmentsTable)
      .where(eq(enrollmentsTable.classId, cls.id));
    enrollmentCounts[cls.id] = row.count;
  }

  res.json(
    classes.map((c) => ({
      day: c.scheduleDay,
      className: c.name,
      time: c.scheduleTime,
      location: c.location,
      instructor: c.instructor,
      enrolledCount: enrollmentCounts[c.id] ?? 0,
      capacity: c.capacity,
    }))
  );
});

export default router;
