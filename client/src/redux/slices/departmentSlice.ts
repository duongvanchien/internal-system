import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import _ from "lodash";
import { Department } from "../../../../models/department";
import { apiCreateDepartment, apiLoadDepartment, apiUpdateDepartment } from "../../api/services";

export interface DepartmentState {
    departments: Department[]
    loading: boolean
}

const initialState: DepartmentState = {
    departments: [],
    loading: false
};

export const requestLoadDepartments = createAsyncThunk('department/loadDepartments', async (props: { status: Number[] }) => {
    const res = await apiLoadDepartment(props);
    return res.data
})

export const requestCreateDepartment = createAsyncThunk("department/createDepartment", async (props: { departmentInfo: Department }) => {
    const res = await apiCreateDepartment(props);
    return res.data
})

export const requestUpdateDepartment = createAsyncThunk("department/updateDepartment", async (props: { departmentInfo: any }) => {
    const res = await apiUpdateDepartment(props);
    return res.data
})

export const requestDeleteDepartment = createAsyncThunk("department/deleteDepartment", async (props: { departmentInfo: any }) => {
    const res = await apiUpdateDepartment(props);
    return res.data
})

export const departmentSlice = createSlice({
    name: "department",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const actionList = [requestLoadDepartments, requestCreateDepartment, requestUpdateDepartment, requestDeleteDepartment];
        actionList.forEach(action => {
            builder.addCase(action.pending, (state) => {
                state.loading = true;
            })
        })

        builder.addCase(requestLoadDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
            state.loading = false;
            state.departments = action.payload;
        })

        builder.addCase(requestCreateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
            state.departments = state.departments.concat(action.payload)
            state.loading = false;
        })

        builder.addCase(requestUpdateDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
            const index = _.findIndex(state.departments, { _id: action.payload._id });
            state.departments.splice(index, 1, action.payload);
            state.loading = false;
        })

        builder.addCase(requestDeleteDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
            _.remove(state.departments, (department) => department._id === action.payload._id);
            state.loading = false;
          })
    }
});

export const departmentState = (state: RootState) => state.departmentState;

export default departmentSlice.reducer;