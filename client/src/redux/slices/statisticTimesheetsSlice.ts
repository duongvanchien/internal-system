import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import _ from "lodash";
import { StatisticTimeSheet } from "../../../../models/statistic_timesheet";
import { apiLoadRankingByStaff, apiLoadRankingStaff } from "../../api/services";

export interface StatisticTimesheetState {
    statisticTimesheets: StatisticTimeSheet[],
    loading: boolean,
    error: string,
    statisticTimeSheetInfo: StatisticTimeSheet | null
}

const initialState: StatisticTimesheetState = {
    statisticTimesheets: [],
    loading: false,
    error: '',
    statisticTimeSheetInfo: null
};

export const requestLoadRankingStaff = createAsyncThunk('statisticTimesheets/loadRankingStaff', async (props: { month?: number, year: number }) => {
    const res = await apiLoadRankingStaff(props);
    return res.data
});

export const requestLoadRankingByStaff = createAsyncThunk('statisticTimesheets/loadRankingByStaff', async (props: { month?: number, year: number, userId: string }) => {
    const res = await apiLoadRankingByStaff(props);
    return res.data
});

export const statisticTimesheetSlice = createSlice({
    name: "statisticTimesheet",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const actionList = [requestLoadRankingStaff, requestLoadRankingByStaff];
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })

        builder.addCase(requestLoadRankingStaff.fulfilled, (state, action: PayloadAction<StatisticTimeSheet[]>) => {
            state.loading = false;
            state.statisticTimesheets = action.payload;
        })

        builder.addCase(requestLoadRankingByStaff.fulfilled, (state, action: PayloadAction<StatisticTimeSheet>) => {
            state.loading = false;
            state.statisticTimeSheetInfo = action.payload;
        })
    }
});

export const statisticTimesheetState = (state: RootState) => state.statisticTimesheetState;

export default statisticTimesheetSlice.reducer;