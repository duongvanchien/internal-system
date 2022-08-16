import moment from "moment";

//ACTIONS
export enum ActionTypes {
    SET_START_DATE,
    SET_END_DATE,
    SET_DATE,
    CHANGE_TYPE_FORM,
    RESET,
    SET_START_DATE_FILLTER,
    SET_END_DATE_FILLTER
}

interface FormAction {
    type: ActionTypes,
    startDate?: Date | null,
    endDate?: Date | null,
    date?: Date | null,
    typeForm?: number,
    startDateFillter?: Date | null,
    endDateFillter?: Date | null,
}

type FormState = {
    startDate: Date | null,
    endDate: Date | null,
    date: Date | null,
    typeForm: number,
    startDateFillter: Date | null,
    endDateFillter: Date | null,
}

export const initState: FormState = {
    startDate: new Date(),
    endDate: new Date(),
    date: new Date(),
    typeForm: 0,
    startDateFillter: new Date(moment().startOf('month').format('MM/DD/YYYY')),
    endDateFillter: new Date(moment().endOf('month').format('MM/DD/YYYY')),
}

const initialState = { ...initState };

export const formReducer = (state: FormState = initState, action: FormAction): FormState => {
    switch (action.type) {
        case ActionTypes.SET_START_DATE:
            state.startDate = action.startDate!;
            return { ...state }
        case ActionTypes.SET_END_DATE:
            state.endDate = action.endDate!;
            return { ...state }
        case ActionTypes.SET_DATE:
            state.date = action.date!;
            return { ...state }
        case ActionTypes.CHANGE_TYPE_FORM:
            state.typeForm = action.typeForm!;
            return { ...state }
        case ActionTypes.SET_START_DATE_FILLTER:
            state.startDateFillter = action.startDateFillter!;
            return { ...state }
        case ActionTypes.SET_END_DATE_FILLTER:
            state.endDateFillter = action.endDateFillter!;
            return { ...state }
        default:
            throw new Error('Unknown Action');
    }
}

export const setStartDate = (startDate: Date | null): FormAction => {
    return {
        type: ActionTypes.SET_START_DATE,
        startDate
    }
}

export const setEndDate = (endDate: Date | null): FormAction => {
    return {
        type: ActionTypes.SET_END_DATE,
        endDate
    }
}

export const setDate = (date: Date | null): FormAction => {
    return {
        type: ActionTypes.SET_DATE,
        date
    }
}

export const changeTypeForm = (typeForm: number): FormAction => {
    return {
        type: ActionTypes.CHANGE_TYPE_FORM,
        typeForm
    }
}

export const setStartDateFillter = (startDateFillter: Date | null): FormAction => {
    return {
        type: ActionTypes.SET_START_DATE_FILLTER,
        startDateFillter
    }
}

export const setEndDateFillter = (endDateFillter: Date | null): FormAction => {
    return {
        type: ActionTypes.SET_END_DATE_FILLTER,
        endDateFillter
    }
}
