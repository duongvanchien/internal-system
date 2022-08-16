import { configureStore, Action } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import departmentReducer from "./slices/departmentSlice";
import authReducer from "./slices/authSlice";
import eventReducer from "./slices/eventSlice";
import timeSheetReducer from "./slices/timesheetSlice";
import formReducer from "./slices/formSlice";
import statisticTimesheetReducer from "./slices/statisticTimesheetsSlice";

export const store = configureStore({
    reducer: {
        userState: userReducer,
        departmentState: departmentReducer,
        authState: authReducer,
        eventState: eventReducer,
        timesheetState: timeSheetReducer,
        formState: formReducer,
        statisticTimesheetState: statisticTimesheetReducer,
    },
    middleware: (getDefaultMiddle) => getDefaultMiddle({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;