import moment from "moment";

//ACTIONS
export enum ActionTypes {
    SET_MONTH,
    SET_YEAR
}

interface HomeAction {
    type: ActionTypes,
    month?: number,
    year?: number
}

type HomeState = {
    month: number,
    year: number,
}

export const initState: HomeState = {
    month: new Date().getMonth() + 1 === 1 ? 12 : new Date().getMonth(),
    year: new Date().getMonth() + 1 === 1 ? new Date().getFullYear() - 1 : new Date().getFullYear()
}


export const homeReducer = (state: HomeState = initState, action: HomeAction): HomeState => {
    switch (action.type) {
        case ActionTypes.SET_MONTH:
            state.month = action.month!;
            return { ...state }
        case ActionTypes.SET_YEAR:
            state.year = action.year!;
            return { ...state }
        default:
            throw new Error('Unknown Action');
    }
}

export const changeMonth = (month?: number): HomeAction => {
    return {
        type: ActionTypes.SET_MONTH,
        month
    }
}

export const changeYear = (year?: number): HomeAction => {
    return {
        type: ActionTypes.SET_YEAR,
        year
    }
}

