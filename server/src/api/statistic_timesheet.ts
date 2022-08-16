import Endpoint from '../../../common/endpoints';
import express from 'express';
import asyncHandler from '../utils/async_handle';
import { StatisticTimesheetsService } from '../services/statistic_timesheet';

const statisticTimesheetsRouter = express.Router();
const statisticTimesheetsService = new StatisticTimesheetsService();

statisticTimesheetsRouter.post(Endpoint.RANKING_STAFF, asyncHandler(async (req, res) => {
    const responseDb = await statisticTimesheetsService.rankingStaff(req.body);
    res.json(responseDb);
}));

statisticTimesheetsRouter.post(Endpoint.LOAD_RANKING_BY_STAFF, asyncHandler(async (req, res) => {
    const responseDb = await statisticTimesheetsService.loadRankingByStaff(req.body);
    res.json(responseDb);
}));

export { statisticTimesheetsRouter };
