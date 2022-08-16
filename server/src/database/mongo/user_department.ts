import mongoose, { Document, Model, model } from "mongoose";
import { UserDepartment } from "../../../../models/user_department";
import { departmentTable } from "./departments";
import { userTableName } from "./users";

export const userDepartmentTable = "UserDepartment";
interface IUserDeparmentModelDoc extends Model<UserDepartmentDoc> {

}
export interface UserDepartmentDoc extends UserDepartment, Document {
    _id: string;
}

const UserDepartmentSchema = new mongoose.Schema<UserDepartmentDoc, IUserDeparmentModelDoc>(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: userTableName
        },
        departmentId: {
            type: mongoose.Types.ObjectId,
            ref: departmentTable
        },
        status: { type: Number, default: 1 },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

export const UserDepartmentModel = model(userDepartmentTable, UserDepartmentSchema);

