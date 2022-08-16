import mongoose from 'mongoose';
import KSInternalConfig from '../../../common/config';
import { Department } from '../../../models/department';
import { UserInfo } from "../../../models/user";
import { UserModel } from "../database/mongo/users";
import { UserDepartmentModel } from "../database/mongo/user_department";
export default class UserService {
    loadUserInfo = async (body: { userId: string }): Promise<UserInfo> => {
        const user = await UserModel
            .findOne({
                status: KSInternalConfig.STATUS_PUBLIC,
                _id: body.userId
            }).populate("departmentId")

        return new UserInfo(user);
    }

    loadUsersByWorkStatus = async (body: { status: number[]; startDate?: number | undefined; endDate?: number | undefined; }): Promise<any[]> => {
        const users = await UserModel
            .find({
                status: { $in: body.status },
                userRole: KSInternalConfig.STAFF
            }).populate("departmentId")

        return users.map(user => new UserInfo(user));
    }

    updateUserInfo = async (body: { userInfo: UserInfo }): Promise<UserInfo | null> => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const findUser = await UserModel.findOne({ _id: body.userInfo['_id'] }).populate("departmentId");
            const userUpdate = await UserModel.findOneAndUpdate({ _id: body.userInfo['_id'] }, { $set: { ...body.userInfo } }, { new: true }).populate("departmentId");
            userUpdate.$session();

            /**
             * Tạo bản ghi trong bảng userDepartment nếu là update department
             */
            const department = new Department(findUser.departmentId);
            if (body.userInfo.departmentId !== department._id?.toString()) {
                const resUserDepartment = await new UserDepartmentModel({
                    userId: userUpdate._id,
                    departmentId: userUpdate.departmentId
                }).save();
                resUserDepartment.$session();
            }

            session.commitTransaction();
            return new UserInfo(userUpdate);
        } catch (err) {
            session.abortTransaction();
            return null
        } finally {
            session.endSession();
        }
    }

    saveNewUser = async (body: { userInfo: UserInfo }): Promise<UserInfo | null> => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const resUser = await new UserModel(body.userInfo).save();
            resUser.$session();
            const resUserDepartment = await new UserDepartmentModel({
                userId: resUser._id,
                departmentId: body.userInfo.departmentId
            }).save();
            resUserDepartment.$session();
            session.commitTransaction();
            return resUser;
        } catch (err) {
            session.abortTransaction();
            return null
        } finally {
            session.endSession();
        }
    }
}