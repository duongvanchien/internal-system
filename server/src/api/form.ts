import Endpoint from '../../../common/endpoints';
import express from 'express';
import asyncHandler from '../utils/async_handle';
import { isValidObjectId } from 'mongoose';
import { FormService } from '../services/form';

const formRouter = express.Router();
const formService = new FormService();

formRouter.post(Endpoint.SAVE_NEW_FORM, asyncHandler(async (req, res) => {
    if (!req.body.form?._id) {
        const responseDb = await formService.saveNewForm(req.body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));

formRouter.post(Endpoint.LOAD_FORMS, asyncHandler(async (req, res) => {
    const responseDb = await formService.loadForms(req.body);
    res.json(responseDb);
}));

formRouter.post(Endpoint.UPDATE_FORM, asyncHandler(async (req, res) => {
    if (req.body.form?._id) {
        const responseDb = await formService.updateForm(req.body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));

formRouter.post(Endpoint.DELETE_FORM, asyncHandler(async (req, res) => {
    if (!req.body._id) {
        const responseDb = await formService.deleteForm(req.body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));

export { formRouter };
