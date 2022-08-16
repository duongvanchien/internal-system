import moment from "moment";
import { Form } from "../../../../../models/form";

//ACTIONS
export enum ActionTypes {
    CHANGE_STAFF_ID,
    SET_START_DATE_FILLTER,
    SET_END_DATE_FILLTER,
    CHANGE_FORM_TYPE,
    OPEN_DIALOG_INFO_FORM,
    SET_FORM_SELECTED,
    CLEAR_ALL
}

interface FormManagementAction {
    type: ActionTypes,
    staffId?: string,
    startDateFillter?: Date | null,
    endDateFillter?: Date | null,
    formType?: number | string,
    openDialogForm?: boolean,
    formSelected?: Form | null
}

type FormManagementState = {
    staffId?: string,
    startDateFillter: Date | null,
    endDateFillter: Date | null,
    formType: number | string,
    openDialogForm: boolean,
    formSelected?: Form | null
}

export const initState: FormManagementState = {
    staffId: '',
    startDateFillter: new Date(moment().startOf('month').format('MM/DD/YYYY')),
    endDateFillter: new Date(moment().endOf('month').format('MM/DD/YYYY')),
    formType: "",
    openDialogForm: false,
    formSelected: null
}

export const formManagementReducer = (state: FormManagementState = initState, action: FormManagementAction): FormManagementState => {
    switch (action.type) {
        case ActionTypes.CHANGE_STAFF_ID:
            state.staffId = action.staffId!;
            return { ...state }
        case ActionTypes.SET_START_DATE_FILLTER:
            state.startDateFillter = action.startDateFillter!;
            return { ...state }
        case ActionTypes.SET_END_DATE_FILLTER:
            state.endDateFillter = action.endDateFillter!;
            return { ...state }
        case ActionTypes.CHANGE_FORM_TYPE:
            state.formType = action.formType!;
            return { ...state }
        case ActionTypes.OPEN_DIALOG_INFO_FORM:
            state.openDialogForm = action.openDialogForm!;
            return { ...state }
        case ActionTypes.SET_FORM_SELECTED:
            state.formSelected = action.formSelected!;
            return { ...state }
        case ActionTypes.CLEAR_ALL:
            state.staffId = action.staffId!;
            state.startDateFillter = new Date(moment().startOf('month').format('MM/DD/YYYY'));
            state.endDateFillter = new Date(moment().endOf('month').format('MM/DD/YYYY'));
            state.formType = "";
            return { ...state }
        default:
            throw new Error('Unknown Action');
    }
}

export const setChangeStaffId = (staffId: string): FormManagementAction => {
    return {
        type: ActionTypes.CHANGE_STAFF_ID,
        staffId
    }
}

export const setStartDateFillter = (startDateFillter: Date | null): FormManagementAction => {
    return {
        type: ActionTypes.SET_START_DATE_FILLTER,
        startDateFillter
    }
}

export const setEndDateFillter = (endDateFillter: Date | null): FormManagementAction => {
    return {
        type: ActionTypes.SET_END_DATE_FILLTER,
        endDateFillter
    }
}

export const setFormType = (formType: number | string): FormManagementAction => {
    return {
        type: ActionTypes.CHANGE_FORM_TYPE,
        formType
    }
}

export const setOpenDialogForm = (openDialogForm: boolean): FormManagementAction => {
    return {
        type: ActionTypes.OPEN_DIALOG_INFO_FORM,
        openDialogForm
    }
}

export const setFormSelected = (formSelected: Form | null): FormManagementAction => {
    return {
        type: ActionTypes.SET_FORM_SELECTED,
        formSelected
    }
}

export const resetAll = (): FormManagementAction => {
    return {
        type: ActionTypes.CLEAR_ALL,
    }
}





