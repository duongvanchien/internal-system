import Endpoint from '../../../common/endpoints';
import express from 'express';
import asyncHandler from '../utils/async_handle';
import { EventService } from '../services/event';
import { isValidObjectId } from 'mongoose';
import { Event } from '../../../models/event';

const eventRouter = express.Router();
const eventService = new EventService();

eventRouter.post(Endpoint.SAVE_NEW_EVENT, asyncHandler(async (req, res) => {
    const { event: Event } = req.body;
    if (!req.body.event?._id) {
        const responseDb = await eventService.saveNewEvent(req.body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));

eventRouter.post(Endpoint.LOAD_EVENTS, asyncHandler(async (req, res) => {
    const { time } = req.body;
    const responseDb = await eventService.loadEvents(req.body);
    res.json(responseDb);
}));

eventRouter.post(Endpoint.UPDATE_EVENT, asyncHandler(async (req, res) => {
    const { event: Event } = req.body;
    if (req.body.event?._id) {
        const responseDb = await eventService.updateEvent(req.body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));

eventRouter.post(Endpoint.DELETE_EVENT, asyncHandler(async (req, res) => {
    const { _id } = req.body;
    if (!req.body.event?._id) {
        const responseDb = await eventService.deleteEvent(req.body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));

eventRouter.post(Endpoint.LOAD_EVENT_BY_ID, asyncHandler(async (req, res) => {
    if (!req.body.event?._id) {
        const responseDb = await eventService.loadEventById(req.body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));

export { eventRouter };
