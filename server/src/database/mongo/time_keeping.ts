import mongoose, { Document, Model, model, Types } from "mongoose";
import { userTableName } from "./users";
import { TimeKeeping } from '../../../../models/time_keeping';
export const timeKeepingTable = "TimeKeeping";
interface ITimeKeepingDoc extends Model<TimeKeepingDoc> {

}
export interface TimeKeepingDoc extends TimeKeeping, Document {
    _id: string;
}

const TimeKeepingSchema = new mongoose.Schema<TimeKeepingDoc, ITimeKeepingDoc>(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: userTableName
        },
        checkin: String,
        checkout: String,
        status: { type: Number, default: 1 },
        type: { type: Number, default: 0 },
        workingNumber: { type: Number, default: 0 },
        workingType: { type: Number, default: 0 },
        date: String,
        note: String
    },
    {
        versionKey: false,
        timestamps: true,
    }
);



export const TimeKeepingModel = model(timeKeepingTable, TimeKeepingSchema);

