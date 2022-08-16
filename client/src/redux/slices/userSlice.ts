import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserInfo } from "../../../../models/user"
import _ from "lodash";
import { apiCreateStaff, apiLoadUser, apiLoadUserInfo, apiUpdateStaff } from "../../api/services";

export interface UserState {
  users: UserInfo[],
  loading: boolean,
  error: string,
  userInfo: UserInfo | null
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: '',
  userInfo: null
};

export const requestLoadUsers = createAsyncThunk('user/loadUsers', async (props: { status: Number[] }) => {
  const res = await apiLoadUser(props);
  return res.data
})

export const requestCreateUser = createAsyncThunk("user/createUser", async (props: { userInfo: UserInfo }) => {
  const res = await apiCreateStaff(props);
  return res.data
})

export const requestUpdateUser = createAsyncThunk("user/updateUser", async (props: { userInfo: any }) => {
  const res = await apiUpdateStaff(props);
  return res.data
})

export const requestDeleteUser = createAsyncThunk("user/deleteUser", async (props: { userInfo: any }) => {
  const res = await apiUpdateStaff(props);
  return res.data
})

export const requestLoadUserInfo = createAsyncThunk("user/loadUserInfo", async (props: { userId: string }) => {
  const res = await apiLoadUserInfo(props);
  return res.data
})

export const requestUpdateUserInfo = createAsyncThunk("user/updateUserInfo", async (props: { userInfo: string }) => {
  const res = await apiUpdateStaff(props);
  return res.data
})

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const actionList = [requestLoadUsers, requestCreateUser, requestUpdateUser, requestDeleteUser, requestLoadUserInfo, requestUpdateUserInfo];
    actionList.forEach(action => {
      builder.addCase(action.pending, (state) => {
        state.loading = true;
      })
    })

    /**
     * getList
     */
    builder.addCase(requestLoadUsers.fulfilled, (state, action: PayloadAction<UserInfo[]>) => {
      state.loading = false;
      state.users = action.payload;
    })

    /**
     * create
     */
    builder.addCase(requestCreateUser.fulfilled, (state, action: PayloadAction<UserInfo>) => {
      state.users = state.users.concat(action.payload)
      state.loading = false;
    })

    /**
     * update
     */
    builder.addCase(requestUpdateUser.fulfilled, (state, action: PayloadAction<UserInfo>) => {
      const index = _.findIndex(state.users, { _id: action.payload._id });
      state.users.splice(index, 1, action.payload);
      state.loading = false;
    })

    /**
     * delete
     */
    builder.addCase(requestDeleteUser.fulfilled, (state, action: PayloadAction<UserInfo>) => {
      _.remove(state.users, (user) => user._id === action.payload._id);
      state.loading = false;
    })

    /**
     * load user info
     */
    builder.addCase(requestLoadUserInfo.fulfilled, (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.loading = false;
    })

    /**
    * update user info
    */
    builder.addCase(requestUpdateUserInfo.fulfilled, (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.loading = false;
    })
  }
});

export const userState = (state: RootState) => state.userState;

export default userSlice.reducer;