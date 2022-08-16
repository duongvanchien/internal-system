import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserInfo } from "../../../../models/user"
import _ from "lodash";
import { apiLogin } from "../../api/services";

export interface UserState {
    userInfo: UserInfo | null,
    loading: boolean
}

const initialState: UserState = {
    userInfo: null,
    loading: false
};

export const requestLogin = createAsyncThunk('auth/login', async (props: { account: string, password: string }) => {
    const res = await apiLogin(props);
    return res.data
})

export const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loadUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
        },
    },
    extraReducers: (builder) => {
        /**
         * login
         */
        builder.addCase(requestLogin.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(requestLogin.fulfilled, (state, action: PayloadAction<UserInfo>) => {
            state.loading = false;
            state.userInfo = action.payload;
        })
    }
});

export const authState = (state: RootState) => state.authState;

export const { loadUserInfo } = authSlice.actions;
export default authSlice.reducer;