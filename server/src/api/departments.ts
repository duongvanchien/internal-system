import express from 'express';
import { isValidObjectId } from 'mongoose';
import EndPoint from '../../../common/endpoints';
import { Department } from '../../../models/department';
import { UserInfo } from '../../../models/user';
import DepartmentService from '../services/department';
const deparmentRouter = express.Router();
import asyncHandler from '../utils/async_handle';

const departmentService = new DepartmentService();

deparmentRouter.post(EndPoint.SAVE_NEW_DEPARTMENT, asyncHandler(async (req, res) => {
    const body: { departmentInfo: Department } = req.body;
    if (!body.departmentInfo?._id) {
        const responseDb: Department = await departmentService.saveNewDepartment(body);
        res.json(responseDb);
    } else {
        res.sendStatus(403); // bad request
    }
}));

deparmentRouter.post(EndPoint.LOAD_DEPARTMENTS, asyncHandler(async (req, res) => {
    const body: { status: number[] } = req.body;
    const responseDb: Department[] = await departmentService.loadDepartments(body);
    res.json(responseDb);
}));

deparmentRouter.post(EndPoint.UPDATE_DEPARTMENT, asyncHandler(async (req, res) => {
    const body: { departmentInfo: Object } = req.body;
    if (!body.departmentInfo['_id'] || !isValidObjectId(body.departmentInfo['_id'])) {
        res.sendStatus(403); // bad request
    } else {
        const responseDb: Department | null = await departmentService.updateDepartment(body);
        res.json(responseDb)
    }
}));
deparmentRouter.post(EndPoint.UPDATE_DEPARTMENT, asyncHandler(async (req, res) => {
    const body: { departmentId: string } = req.body;
    if (!body.departmentId['_id'] || !isValidObjectId(body.departmentId['_id'])) {
        res.sendStatus(403); // bad request
    } else {
        const responseDb: UserInfo[] = await departmentService.loadStaffInDepartment(body);
        res.json(responseDb)
    }
}));


export { deparmentRouter };
