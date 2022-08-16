import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import _ from "lodash";
import { apiDeleteTimeSheets, apiImportTimeSheets, apiLoadTimeSheets, apiLoadTimeSheetsForStaff } from "../../api/services";
import { TimeKeeping } from "../../../../models/time_keeping"

export interface TimeSheetsState {
    timeSheets: TimeKeeping[],
    loading: boolean,
    error: string,
    count: number,
}

const initialState: TimeSheetsState = {
    timeSheets: [],
    loading: false,
    error: '',
    count: 0,
};

export const requestImportTimeSheet = createAsyncThunk('timeSheet/import', async (props: { file: any }) => {
    const res = await apiImportTimeSheets(props.file);
    return res.data
});

export const requestLoadTimeSheets = createAsyncThunk('timeSheet/getList', async (props: { month: number, year: number, userId?: string, page: number }) => {
    const res = await apiLoadTimeSheets(props);
    return res.data
});

export const requestDeleteTimeSheets = createAsyncThunk('timeSheet/delete', async (props: { month: number, year: number }) => {
    const res = await apiDeleteTimeSheets(props);
    return res.data
});

export const requestLoadTimeSheetsForStaff = createAsyncThunk('timeSheet/getListForStaff', async (props: { month: number, year: number, userId: string }) => {
    const res = await apiLoadTimeSheetsForStaff(props);
    return res.data
});


export const timesheetSlice = createSlice({
    name: "timeSheet",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const actionList = [requestImportTimeSheet, requestLoadTimeSheets, requestDeleteTimeSheets, requestLoadTimeSheetsForStaff];
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })

        builder.addCase(requestImportTimeSheet.fulfilled, (state, action: PayloadAction<string>) => {
            state.loading = false;
        })

        builder.addCase(requestLoadTimeSheets.fulfilled, (state, action: PayloadAction<{ data: TimeKeeping[], count: number }>) => {
            state.loading = false;
            state.timeSheets = action.payload.data;
            state.count = action.payload.count;
        })

        builder.addCase(requestDeleteTimeSheets.fulfilled, (state, action: PayloadAction<TimeKeeping[]>) => {
            state.loading = false;
            state.timeSheets = [];
            state.count = 0
        })

        builder.addCase(requestLoadTimeSheetsForStaff.fulfilled, (state, action: PayloadAction<TimeKeeping[]>) => {
            state.loading = false;
            state.timeSheets = action.payload;
        })
    }
});

export const timesheetState = (state: RootState) => state.timesheetState;

export default timesheetSlice.reducer;