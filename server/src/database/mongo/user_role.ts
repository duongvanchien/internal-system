
// import mongoose, { Document, Model, model } from "mongoose";
// import { Department } from "../../../../models/department";
// import { UserDepartment } from "../../../../models/user_department";
// import { departmentTable } from "./departments";
// import { userTableName } from "./users";

// export const userRoleTableName = "UserRole"
// interface IUserRoleSchema extends Model<UserRoleDoc> {
//     findByType(type: number): Promise<UserRoleDoc[]>

// }
// export interface UserRoleDoc extends Document {
//     _id: string,
// }
// const UserRoleShema = new mongoose.Schema<UserRoleDoc, IUserRoleSchema>({
//     userId: {
//         type: mongoose.Types.ObjectId,
//         ref: userTableName
//     },
//     roleId: {
//         type: mongoose.Types.ObjectId,
//         ref: roleTableName
//     },
//     itemId: {
//         type: mongoose.Types.ObjectId,
//     },
//     createDate: { type: Number, default: 0 },
//     expireDate: { type: Number, default: 0 },
//     status: { type: Number, default: 0 },
//     type: { type: Number, default: 0 },
//     from: { type: Number, default: 0 } // 0:Web, 1:CRM , 2:CMS , 3:classes-mng.vvv 
// }, { versionKey: false, });

// const UserRoleModel = model(userRoleTableName, UserRoleShema);