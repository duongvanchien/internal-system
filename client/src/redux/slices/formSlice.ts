import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Form } from "../../../../models/form"
import _ from "lodash";
import { apiCreateForm, apiCreateStaff, apiLoadForms, apiLoadUser, apiLoadUserInfo, apiUpdateForm, apiUpdateStaff } from "../../api/services";

export interface formState {
  forms: Form[],
  initialForms: Form[],
  loading: boolean,
  error: string,
}

const initialState: formState = {
  forms: [],
  initialForms: [],
  loading: false,
  error: '',
};

export const requestLoadForms = createAsyncThunk('form/loadForms', async (props: { userId?: string }) => {
  const res = await apiLoadForms(props);
  return res.data
})

export const requestCreateForm = createAsyncThunk("form/createForm", async (props: { form: any }) => {
  const res = await apiCreateForm(props);
  return res.data
})

export const requestUpdateForm = createAsyncThunk("form/updateForm", async (props: { form: any }) => {
  const res = await apiUpdateForm(props);
  return res.data
})

// export const requestDeleteUser = createAsyncThunk("user/deleteUser", async (props: { userInfo: any }) => {
//   const res = await apiUpdateStaff(props);
//   return res.data
// })

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    fillterListForm: (state, action: PayloadAction<Form[]>) => {
      state.forms = action.payload;
    },
  },
  extraReducers: (builder) => {
    const actionList = [requestCreateForm, requestLoadForms, requestUpdateForm];
    actionList.forEach(action => {
      builder.addCase(action.pending, (state) => {
        state.loading = true;
      })
    })

    builder.addCase(requestLoadForms.fulfilled, (state, action: PayloadAction<Form[]>) => {
      state.loading = false;
      state.forms = action.payload;
      state.initialForms = action.payload;
    })

    builder.addCase(requestCreateForm.fulfilled, (state, action: PayloadAction<Form>) => {
      state.forms = state.forms.concat(action.payload);
      state.initialForms = state.forms.concat(action.payload);
      state.loading = false;
    })


    builder.addCase(requestUpdateForm.fulfilled, (state, action: PayloadAction<Form>) => {
      const index = _.findIndex(state.forms, { _id: action.payload._id });
      state.forms.splice(index, 1, action.payload);
      state.loading = false;
    })


    // builder.addCase(requestDeleteUser.fulfilled, (state, action: PayloadAction<UserInfo>) => {
    //   _.remove(state.users, (user) => user._id === action.payload._id);
    //   state.loading = false;
    // })
  }
});

export const formState = (state: RootState) => state.formState;
export const { fillterListForm } = formSlice.actions;

export default formSlice.reducer;