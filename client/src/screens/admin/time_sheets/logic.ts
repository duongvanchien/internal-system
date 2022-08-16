
//ACTIONS
export enum ActionTypes {
    CHANGE_DIALOG_UPLOAD_STATUS,
    CHANGE_FILE_UPLOAD,
    CHANGE_MONTH,
    CHANGE_YEAR,
    OPEN_DELETE_TIME_SHEET,
    CHANGE_STAFF_ID,
    CHANGE_CURRENT_PAGE
}

interface TimeSheetsAction {
    type: ActionTypes,
    openUploadFile?: boolean,
    openDialogDeleteTimeSheets?: boolean,
    fileUpload?: File | null,
    month?: number,
    year?: number,
    staffId?: string,
}

type TimeSheetsState = {
    openUploadFile: boolean,
    openDialogDeleteTimeSheets: boolean,
    fileUpload: File | null,
    month?: number,
    year?: number,
    staffId?: string,
}

export const initState: TimeSheetsState = {
    openUploadFile: false,
    openDialogDeleteTimeSheets: false,
    fileUpload: null,
    month: new Date().getMonth() + 1,
    /**
     * ?????
     */
    year: new Date().getFullYear(),
    staffId: '',
}

export const timeSheetsReducer = (state: TimeSheetsState = initState, action: TimeSheetsAction): TimeSheetsState => {
    switch (action.type) {
        case ActionTypes.CHANGE_DIALOG_UPLOAD_STATUS:
            state.openUploadFile = action.openUploadFile!;
            return { ...state }
        case ActionTypes.CHANGE_FILE_UPLOAD:
            state.fileUpload = action.fileUpload!;
            return { ...state }
        case ActionTypes.CHANGE_MONTH:
            state.month = action.month!;
            return { ...state }
        case ActionTypes.CHANGE_YEAR:
            state.year = action.year!;
            return { ...state }
        case ActionTypes.OPEN_DELETE_TIME_SHEET:
            state.openDialogDeleteTimeSheets = action.openDialogDeleteTimeSheets!;
            return { ...state }
        case ActionTypes.CHANGE_STAFF_ID:
            state.staffId = action.staffId!;
            return { ...state }
        default:
            throw new Error('Unknown Action');
    }
}

export const changeUploadStatusDialog = (openUploadFile: boolean): TimeSheetsAction => {
    return {
        type: ActionTypes.CHANGE_DIALOG_UPLOAD_STATUS,
        openUploadFile
    }
}

export const changeFileUpload = (fileUpload: File | null): TimeSheetsAction => {
    return {
        type: ActionTypes.CHANGE_FILE_UPLOAD,
        fileUpload
    }
}

export const changeMonth = (month: number): TimeSheetsAction => {
    return {
        type: ActionTypes.CHANGE_MONTH,
        month
    }
}

export const changeYear = (year: number): TimeSheetsAction => {
    return {
        type: ActionTypes.CHANGE_YEAR,
        year
    }
}

export const setOpenDialogDeleteTimeSheets = (openDialogDeleteTimeSheets: boolean): TimeSheetsAction => {
    return {
        type: ActionTypes.OPEN_DELETE_TIME_SHEET,
        openDialogDeleteTimeSheets
    }
}

export const setChangeStaffId = (staffId: string): TimeSheetsAction => {
    return {
        type: ActionTypes.CHANGE_STAFF_ID,
        staffId
    }
}



