import { UserInfo } from "../../../../../models/user";

//ACTIONS
export enum ActionTypes {
    OPEN_UPDATE_INFO,
    SET_AVATAR_URL,
    SET_BIRTH,
    RESET
}

interface ProfileAction {
    type: ActionTypes,
    openDialogUpdateInfo?: boolean,
    avatar?: string,
    birth?: Date | null,
}

type ProfileState = {
    openDialogUpdateInfo: boolean,
    avatar?: string,
    birth: Date | null,
}

export const initState: ProfileState = {
    openDialogUpdateInfo: false,
    avatar: '',
    birth: new Date(),
}

const initialState = { ...initState };

export const profileReducer = (state: ProfileState = initState, action: ProfileAction): ProfileState => {
    switch (action.type) {
        case ActionTypes.SET_BIRTH:
            state.birth = action.birth!;
            return { ...state }
        case ActionTypes.OPEN_UPDATE_INFO:
            state.openDialogUpdateInfo = action.openDialogUpdateInfo!;
            return { ...state }
        case ActionTypes.SET_AVATAR_URL:
            state.avatar = action.avatar!;
            return { ...state }
        case ActionTypes.RESET:
            state = initialState;
            return { ...state }
        default:
            throw new Error('Unknown Action');
    }
}

export const setOpenDialogUpdateInfo = (openDialogUpdateInfo: boolean): ProfileAction => {
    return {
        type: ActionTypes.OPEN_UPDATE_INFO,
        openDialogUpdateInfo
    }
}

export const setAvatarUrl = (avatar?: string): ProfileAction => {
    return {
        type: ActionTypes.SET_AVATAR_URL,
        avatar
    }
}

export const setBirth = (birth: Date | null): ProfileAction => {
    return {
        type: ActionTypes.SET_BIRTH,
        birth
    }
}

export const resetInitialState = (): ProfileAction => {
    return {
        type: ActionTypes.RESET
    };
};




