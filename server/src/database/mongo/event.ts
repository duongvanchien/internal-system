import mongoose, { Document, Model, model } from "mongoose";
import { Event } from "../../../../models/event";

import { departmentTable } from "./departments";
import { userTableName } from "./users";

export const eventTable = "Event";
interface IEventModelDoc extends Model<EventDoc> {

}
export interface EventDoc extends Event, Document {
    _id: string;
}

const EventSchema = new mongoose.Schema<EventDoc, IEventModelDoc>(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: userTableName
        },
        departmentId: {
            type: mongoose.Types.ObjectId,
            ref: departmentTable
        },
        memberIds: [{ type: mongoose.Types.ObjectId, ref: userTableName }],
        title: String,
        startTime: { type: Number, default: 0 },
        imagesUrl: [String],
        videosUrl: [String],
        extendUrl: [String],
        description: String,
        shortDescription: String,
        address: String,
        endTime: { type: Number, default: 0 },
        type: { type: Number, default: 1 },
        status: { type: Number, default: 1 },
        background: String,
        thumbnail: String
    },
    {
        versionKey: false,
        timestamps: true,
    }
);



export const EventModel = model(eventTable, EventSchema);

