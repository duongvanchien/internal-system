
//ACTIONS
export enum ActionTypes {
    SET_MONTH,
    SET_NEXT_MONTH,
    SET_PREV_MONTH,
}

interface BirthdayAction {
    type: ActionTypes,
    month?: number
}

type BirthdayState = {
    month: number
}

export const initState: BirthdayState = {
    month: new Date().getMonth() + 1
}

export const birthdayReducer = (state: BirthdayState = initState, action: BirthdayAction): BirthdayState => {
    switch (action.type) {
        case ActionTypes.SET_MONTH:
            state.month = action.month!;
            return { ...state }
        case ActionTypes.SET_NEXT_MONTH:
            let n_month = state.month;
            if (n_month === 12) {
                n_month = 1;
            } else {
                n_month += 1
            }
            return { ...state, month: n_month }
        case ActionTypes.SET_PREV_MONTH:
            let p_month = state.month;
            if (p_month === 1) {
                p_month = 12;
            } else {
                p_month -= 1
            }
            return { ...state, month: p_month }
        default:
            throw new Error('Unknown Action');
    }
}

export const handleNextMonth = (): BirthdayAction => {
    return {
        type: ActionTypes.SET_NEXT_MONTH,
    }
}

export const handlePrevMonth = (): BirthdayAction => {
    return {
        type: ActionTypes.SET_PREV_MONTH,
    }
}






