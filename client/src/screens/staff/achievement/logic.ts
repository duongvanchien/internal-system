
//ACTIONS
export enum ActionTypes {
    CHANGE_MONTH,
    CHANGE_YEAR,
    CHANGE_MONTH_RANKING,
    CHANGE_YEAR_RANKING,
    CHANGE_SHOW_RANKING,
    RESET,
}

interface AchievementAction {
    type: ActionTypes;
    month?: number;
    year?: number;
    monthRanking?: number;
    yearRanking?: number;
    showRanking?: number
}

type AchievementState = {
    month?: number;
    year?: number;
    monthRanking?: number;
    yearRanking?: number;
    showRanking?: number
};

export const initState: AchievementState = {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    monthRanking: new Date().getMonth() + 1 === 1 ? 12 : new Date().getMonth(),
    yearRanking: new Date().getMonth() + 1 === 1 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
    showRanking: 10
};

const initialState = { ...initState };

export const achievementReducer = (state: AchievementState = initState, action: AchievementAction): AchievementState => {
    switch (action.type) {
        case ActionTypes.CHANGE_MONTH:
            state.month = action.month!;
            return { ...state }
        case ActionTypes.CHANGE_YEAR:
            state.year = action.year!;
            return { ...state }
        case ActionTypes.CHANGE_MONTH_RANKING:
            state.monthRanking = action.monthRanking!;
            return { ...state }
        case ActionTypes.CHANGE_YEAR_RANKING:
            state.yearRanking = action.yearRanking!;
            return { ...state }
        case ActionTypes.CHANGE_SHOW_RANKING:
            state.showRanking = action.showRanking!;
            return { ...state }
        case ActionTypes.RESET:
            state = initialState;
            return { ...state }
        default:
            throw new Error("Unknown Action");
    }
};

export const changeMonth = (month: number): AchievementAction => {
    return {
        type: ActionTypes.CHANGE_MONTH,
        month
    }
}

export const changeYear = (year: number): AchievementAction => {
    return {
        type: ActionTypes.CHANGE_YEAR,
        year
    }
}

export const changeMonthRanking = (monthRanking: number): AchievementAction => {
    return {
        type: ActionTypes.CHANGE_MONTH_RANKING,
        monthRanking
    }
}

export const changeYearRanking = (yearRanking: number): AchievementAction => {
    return {
        type: ActionTypes.CHANGE_YEAR_RANKING,
        yearRanking
    }
}

export const resetInitialState = (): AchievementAction => {
    return {
        type: ActionTypes.RESET,
    }
}

export const changeShowRanking = (showRanking: number): AchievementAction => {
    return {
        type: ActionTypes.CHANGE_SHOW_RANKING,
        showRanking
    }
}