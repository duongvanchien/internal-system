import mongoose, { Document, Model, model } from "mongoose";
import { Department } from "../../../../models/department";
export const departmentTable = "Department";
interface IDepartmentModelDoc extends Model<DepartmentDoc> {

}
export interface DepartmentDoc extends Department, Document {
    _id: string;
}

const DepartmentSchema = new mongoose.Schema<DepartmentDoc, IDepartmentModelDoc>(
    {
        name: String,
        address: String,
        email: String,
        hotline: String,
        status: { type: Number, default: 1 },
        type: { type: Number, default: 1 },

    },
    {
        versionKey: false,
        timestamps: true,
    }
);



export const DepartmentModel = model(departmentTable, DepartmentSchema);

