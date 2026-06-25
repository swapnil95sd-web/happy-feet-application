import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import classesRouter from "./classes";
import studentsRouter from "./students";
import enrollmentsRouter from "./enrollments";
import announcementsRouter from "./announcements";
import videosRouter from "./videos";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(classesRouter);
router.use(studentsRouter);
router.use(enrollmentsRouter);
router.use(announcementsRouter);
router.use(videosRouter);
router.use(dashboardRouter);

export default router;
