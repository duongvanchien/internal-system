import { Event } from "../../../models/event";
import { EventModel } from "../database/mongo/event";
import KSInternalConfig from '../../../common/config'
class EventService {
    saveNewEvent = async (body: { event: Event }): Promise<Event> => {
        const res = await new EventModel(body.event).save();
        return res;
    }

    loadEvents = async (body: { time: number }): Promise<Event[]> => {
        if (body.time) {
            const res = await EventModel.find({ startTime: { $lt: body.time }, status: { $in: [KSInternalConfig.STATUS_PUBLIC] } });
            return res;
        } else {
            const res = await EventModel.find();
            return res;
        }
    }

    updateEvent = async (body: { event: Event }): Promise<Event> => {
        const eventUpdate = await EventModel.findOneAndUpdate({ _id: body.event['_id'] }, { $set: { ...body.event } }, { new: true });
        return new Event(eventUpdate);
    }

    deleteEvent = async (body: { _id: string }): Promise<Event> => {
        const eventDeleted = await EventModel.findOneAndUpdate({ _id: body._id }, { $set: { status: KSInternalConfig.STATUS_DELETED } });
        return new Event(eventDeleted);
    }

    loadEventById = async (body: { _id: string }): Promise<Event> => {
        const event = await EventModel.findOne({ _id: body._id });
        return new Event(event);
    }
}

export { EventService }