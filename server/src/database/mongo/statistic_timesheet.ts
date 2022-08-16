import mongoose, { Document, Model, model } from "mongoose";
import { StatisticTimeSheet } from "../../../../models/statistic_timesheet";
import { userTableName } from "./users";

export const statisticTimeSheetTable = "statistictimesheet";
interface IStatisticTimeSheetModelDoc extends Model<StatisticTimeSheetDoc> {

}
export interface StatisticTimeSheetDoc extends StatisticTimeSheet, Document {
    _id: string;
}

const StatisticTimeSheetSchema = new mongoose.Schema<StatisticTimeSheetDoc, IStatisticTimeSheetModelDoc>(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: userTableName
        },
        date: String,
        lateDaysNumber: { type: Number, default: 0 },
        successDaysNumber: { type: Number, default: 0 },
        forgetDaysNumber: { type: Number, default: 0 },
        restDaysNumber: { type: Number, default: 0 },
        notEnoughtDaysNumber: { type: Number, default: 0 },
        notPassDaysNumber: { type: Number, default: 0 },
        score: { type: Number, default: 0 },
        workingNumber: { type: Number, default: 0 },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);



export const StatisticTimeSheetModel = model(statisticTimeSheetTable, StatisticTimeSheetSchema);

