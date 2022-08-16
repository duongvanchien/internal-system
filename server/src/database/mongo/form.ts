import mongoose, { Document, Model, model } from "mongoose";
import KSInternalConfig from "../../../../common/config";
import { Form } from "../../../../models/form";

import { userTableName } from "./users";

export const formTable = "form";
interface IFormModelDoc extends Model<FormDoc> {

}
export interface FormDoc extends Form, Document {
    _id: string;
}

const FormSchema = new mongoose.Schema<FormDoc, IFormModelDoc>(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: userTableName
        },
        approverId: {
            type: mongoose.Types.ObjectId,
            ref: userTableName
        },
        startDate: { type: Number, default: 0 },
        endDate: { type: Number, default: 0 },
        offDayNum: { type: Number, default: 0 },
        date: { type: Number, default: 0 },
        createdDate: Date,
        offTimeNum: { type: Number, default: 0 },
        content: String,
        type: { type: Number, default: KSInternalConfig.FORM_TYPE_REST },
        status: { type: Number, default: KSInternalConfig.STATUS_WAITING },
        note: String,
    },
    {
        versionKey: false,
        timestamps: true,
    }
);



export const FormModel = model(formTable, FormSchema);

