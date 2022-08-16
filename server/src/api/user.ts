import Endpoint from '../../../common/endpoints';
import express from 'express';
import asyncHandler from '../utils/async_handle';
import { UserInfo } from '../../../models/user';
import UserService from '../services/user';
import { isValidObjectId } from 'mongoose';

const userRouter = express.Router();
const userService = new UserService();

userRouter.post(Endpoint.SAVE_NEW_USER, asyncHandler(async (req, res) => {
    const body: { userInfo: UserInfo } = req.body;
    if (!body.userInfo?._id) {
        const responseDb = await userService.saveNewUser(body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));

userRouter.post(Endpoint.UPDATE_USER, asyncHandler(async (req, res) => {
    const body: { userInfo: UserInfo } = req.body;
    if (!body.userInfo['_id'] || !isValidObjectId(body.userInfo['_id'])) {
        res.sendStatus(403); // bad request
    } else {
        const responseDb = await userService.updateUserInfo(body);
        res.json(responseDb)
    }
}));

userRouter.post(Endpoint.LOAD_USERS_BY_WORK_STATUS, asyncHandler(async (req, res) => {
    const body: { status: number[], startDate?: number, endDate?: number } = req.body;
    const users = await userService.loadUsersByWorkStatus(body);
    res.json(users)
}));

userRouter.post(Endpoint.LOAD_USER_INFO, asyncHandler(async (req, res) => {
    const body: { userId } = req.body;
    const users = await userService.loadUserInfo(body);
    res.json(users)
}));

export { userRouter };
