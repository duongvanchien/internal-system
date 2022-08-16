import Endpoint from '../../../common/endpoints';
import express from 'express';
import asyncHandler from '../utils/async_handle';
import { ClickUpService } from '../services/clickup';

const clickupRouter = express.Router();
const clickupService = new ClickUpService();

clickupRouter.post(Endpoint.LOAD_SPACES, asyncHandler(async (req, res) => {
    const response = await clickupService.loadSpaces();
    res.json(response);
}));

clickupRouter.post(Endpoint.LOAD_TASKS, asyncHandler(async (req, res) => {
    const response = await clickupService.loadTasks(req.body);
    res.json(response);
}));

clickupRouter.post(Endpoint.LOAD_TASKS_BY_USER, asyncHandler(async (req, res) => {
    const response = await clickupService.loadTasksByUser(req.body);
    res.json(response);
}));

export { clickupRouter };
