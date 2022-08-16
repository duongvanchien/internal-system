import { UserInfo } from "../../../../../models/user";

//ACTIONS
export enum ActionTypes {
    LOAD_USERS,
    OPEN_ADD_OR_UPDATE_STAFF,
    OPEN_DELETE_STAFF,
    SET_BIRTH,
    SET_USER,
    SET_AVATAR_URL
}

interface StaffAction {
    type: ActionTypes,
    openDialogAddOrUpdateStaff?: boolean,
    openDialogDeleteStaff?: boolean,
    birth?: Date | null,
    userInfo?: UserInfo | null,
    avatar?: string
}

type StaffState = {
    openDialogAddOrUpdateStaff: boolean,
    openDialogDeleteStaff: boolean,
    birth: Date | null,
    userInfo: UserInfo | null,
    avatar?: string
}

export const initState: StaffState = {
    openDialogAddOrUpdateStaff: false,
    openDialogDeleteStaff: false,
    birth: new Date(),
    userInfo: null,
    avatar: ''
}

export const staffReducer = (state: StaffState = initState, action: StaffAction): StaffState => {
    switch (action.type) {
        case ActionTypes.SET_BIRTH:
            state.birth = action.birth!;
            return { ...state }
        case ActionTypes.OPEN_ADD_OR_UPDATE_STAFF:
            state.openDialogAddOrUpdateStaff = action.openDialogAddOrUpdateStaff!;
            return { ...state }
        case ActionTypes.OPEN_DELETE_STAFF:
            state.openDialogDeleteStaff = action.openDialogDeleteStaff!;
            return { ...state }
        case ActionTypes.SET_USER:
            state.userInfo = action.userInfo!;
            return { ...state }
        case ActionTypes.SET_AVATAR_URL:
            state.avatar = action.avatar!;
            return { ...state }
        default:
            throw new Error('Unknown Action');
    }
}


export const setOpenDialogAddOrUpdateStaff = (openDialogAddOrUpdateStaff: boolean): StaffAction => {
    return {
        type: ActionTypes.OPEN_ADD_OR_UPDATE_STAFF,
        openDialogAddOrUpdateStaff
    }
}

export const setOpenDialogDeleteStaff = (openDialogDeleteStaff: boolean): StaffAction => {
    return {
        type: ActionTypes.OPEN_DELETE_STAFF,
        openDialogDeleteStaff
    }
}

export const setBirth = (birth: Date | null): StaffAction => {
    return {
        type: ActionTypes.SET_BIRTH,
        birth
    }
}

export const setUserInfo = (userInfo: UserInfo | null): StaffAction => {
    return {
        type: ActionTypes.SET_USER,
        userInfo
    }
}

export const setAvatarUrl = (avatar?: string): StaffAction => {
    return {
        type: ActionTypes.SET_AVATAR_URL,
        avatar
    }
}




