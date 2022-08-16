import express from 'express';
import EndPoint from '../../../common/endpoints';
import { TimeKeepingService } from '../services/time_keeping';
import asyncHandler from '../utils/async_handle';
import multer from 'multer';

const timeSheetsRouter = express.Router();
const timeKeepingService = new TimeKeepingService();

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

timeSheetsRouter.post(EndPoint.IMPORT_TIMESHEETS, upload.single("file"), asyncHandler(async (req: any, res) => {
    const timeSheets = await timeKeepingService.importTimeSheets(req.file);
    return res.json(timeSheets);
}));

timeSheetsRouter.post(EndPoint.LOAD_TIMESHEETS, asyncHandler(async (req, res) => {
    const timeSheets = await timeKeepingService.loadTimeSheets(req.body);
    return res.json(timeSheets);
}));

timeSheetsRouter.post(EndPoint.DELETE_TIMESHEETS, asyncHandler(async (req, res) => {
    const timeSheets = await timeKeepingService.deleteTimeSheets(req.body);
    return res.json(timeSheets);
}));

timeSheetsRouter.post(EndPoint.LOAD_TIMESHEETS_FOR_STAFF, asyncHandler(async (req, res) => {
    const timeSheets = await timeKeepingService.loadTimeSheetsForStaff(req.body);
    return res.json(timeSheets);
}));


timeSheetsRouter.post(EndPoint.DOWNLOAD_FILE_TIMESHEETS, asyncHandler(async (req, res) => {
    const result = await timeKeepingService.downloadTimeSheets({ res, body: req.body });
    // return res.json(result);
    return result;
}));

timeSheetsRouter.post(EndPoint.LOAD_STAFF_TIMEKEEPING, asyncHandler(async (req, res) => {
    const loadTimeKeeping = await timeKeepingService.loadTableTimeSheetsForStaff(req.body);
    return res.json(loadTimeKeeping);
}));
export { timeSheetsRouter };
