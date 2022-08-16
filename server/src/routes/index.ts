import { Router } from 'express';
import { authRouter } from '../api/auth';
import { deparmentRouter } from '../api/departments';
import { timeSheetsRouter } from '../api/timesheets';
import { uploadRouter } from '../api/upload';
import { userRouter } from '../api/user';
import { eventRouter } from '../api/event'
import { formRouter } from '../api/form';
import { statisticTimesheetsRouter } from '../api/statistic_timesheet';
import { clickupRouter } from '../api/clickup';
const router = Router();

router.use(userRouter);
router.use(authRouter);
router.use(deparmentRouter);
router.use(timeSheetsRouter);
router.use(uploadRouter);
router.use(eventRouter);
router.use(formRouter);
router.use(statisticTimesheetsRouter);
router.use(clickupRouter);

export { router as webRouters };
