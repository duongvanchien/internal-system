import { Department } from "../../../../../models/department";

//ACTIONS
export enum ActionTypes {
    OPEN_ADD_OR_UPDATE_DEPARTMENT,
    OPEN_DELETE_DEPARTMENT,
    SET_DEPARTMENT,
    RESET
}

interface DepartmentAction {
    type: ActionTypes;
    openDialogAddOrUpdateDepartment?: boolean;
    openDialogDeleteDepartment?: boolean,
    departmentInfo?: Department | null;
}

type DepartmentState = {
    openDialogAddOrUpdateDepartment: boolean;
    openDialogDeleteDepartment: boolean,
    departmentInfo: Department | null;
};

export const initState: DepartmentState = {
    openDialogAddOrUpdateDepartment: false,
    openDialogDeleteDepartment: false,
    departmentInfo: null,
};

const initialState = { ...initState };

export const departmentReducer = (state: DepartmentState = initState, action: DepartmentAction): DepartmentState => {
    switch (action.type) {
        case ActionTypes.OPEN_ADD_OR_UPDATE_DEPARTMENT:
            state.openDialogAddOrUpdateDepartment = action.openDialogAddOrUpdateDepartment!;
            return { ...state };
        case ActionTypes.OPEN_DELETE_DEPARTMENT:
            state.openDialogDeleteDepartment = action.openDialogDeleteDepartment!;
            return { ...state };
        case ActionTypes.SET_DEPARTMENT:
            state.departmentInfo = action.departmentInfo!;
            return { ...state };
        case ActionTypes.RESET:
            state = initialState;
            return { ...state }
        default:
            throw new Error("Unknown Action");
    }
};

export const setDepartmentInfo = (departmentInfo: Department | null): DepartmentAction => {
    console.log(departmentInfo)
    return {
        type: ActionTypes.SET_DEPARTMENT,
        departmentInfo
    }
}

export const setOpenDialogAddOrUpdateDepartment = (openDialogAddOrUpdateDepartment: boolean): DepartmentAction => {
    return {
        type: ActionTypes.OPEN_ADD_OR_UPDATE_DEPARTMENT,
        openDialogAddOrUpdateDepartment
    };
};

export const setOpenDialogDeleteDepartment = (openDialogDeleteDepartment: boolean): DepartmentAction => {
    return {
        type: ActionTypes.OPEN_DELETE_DEPARTMENT,
        openDialogDeleteDepartment
    };
};

export const resetInitialState = (): DepartmentAction => {
    return {
        type: ActionTypes.RESET
    };
};