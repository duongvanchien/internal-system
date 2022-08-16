import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import _ from "lodash";
import { apiCreateEvent, apiDeleteEvent, apiLoadEventById, apiLoadEvents, apiUpdateEvent } from "../../api/services";
import { Event } from "../../../../models/event";

export interface EventState {
    events: Event[],
    loading: boolean,
    error: string,
    eventInfo: Event | null
}

const initialState: EventState = {
    events: [],
    loading: false,
    error: '',
    eventInfo: null
};

export const requestLoadEvents = createAsyncThunk('event/loadEvents', async (props: { time?: number }) => {
    const res = await apiLoadEvents(props);
    return res.data
})

export const requestCreateEvent = createAsyncThunk("event/createEvent", async (props: { event: any }) => {
    const res = await apiCreateEvent(props);
    return res.data
})

export const requestUpdateEvent = createAsyncThunk("event/updateEvent", async (props: { event: any }) => {
    const res = await apiUpdateEvent(props);
    return res.data
})

export const requestDeleteEvent = createAsyncThunk("event/deleteEvent", async (props: { _id: string }) => {
    const res = await apiDeleteEvent(props);
    return res.data
})

export const requestLoadEventById = createAsyncThunk("event/loadEventById", async (props: { _id: string }) => {
    const res = await apiLoadEventById(props);
    return res.data
})

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const actionList = [requestLoadEvents, requestCreateEvent, requestUpdateEvent, requestDeleteEvent, requestLoadEventById];
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })

        /**
         * getList
         */
        builder.addCase(requestLoadEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
            state.loading = false;
            state.events = action.payload;
        })

        /**
         * create
         */
        builder.addCase(requestCreateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
            state.events = state.events.concat(action.payload)
            state.loading = false;
        })

        /**
         * update
         */
        builder.addCase(requestUpdateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
            const index = _.findIndex(state.events, { _id: action.payload._id });
            state.events.splice(index, 1, action.payload);
            state.loading = false;
        })

        /**
         * delete
         */
        builder.addCase(requestDeleteEvent.fulfilled, (state, action: PayloadAction<Event>) => {
            _.remove(state.events, (event) => event._id === action.payload._id);
            state.loading = false;
        })

        /**
         * load event by id
         */
        builder.addCase(requestLoadEventById.fulfilled, (state, action: PayloadAction<Event>) => {
            state.eventInfo = action.payload;
            state.loading = false;
        })
    }
});

export const eventState = (state: RootState) => state.eventState;

export default eventSlice.reducer;