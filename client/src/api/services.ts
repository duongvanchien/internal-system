import { UserInfo } from "../../../models/user"
import { Event } from "../../../models/event"
import { ApiConfig } from "./config"
import EndPoint from "../../../common/endpoints"
import { Department } from "../../../models/department"
import { Form } from "../../../models/form"

export const apiLoadUser = async (payload?: any) => {
    return ApiConfig(EndPoint.LOAD_USERS_BY_WORK_STATUS, payload)
}

export const apiCreateStaff = async (payload: { userInfo: UserInfo }) => {
    return ApiConfig(EndPoint.SAVE_NEW_USER, payload)
}

export const apiUpdateStaff = async (payload: { userInfo: any }) => {
    return ApiConfig(EndPoint.UPDATE_USER, payload)
}

export const apiLoadUserInfo = async (payload: { userId: string }) => {
    return ApiConfig(EndPoint.LOAD_USER_INFO, payload)
}

export const apiLogin = async (payload: { account: string, password: string }) => {
    return ApiConfig(EndPoint.LOGIN, payload)
}

export const apiUploadFile = async (file: any) => {
    return ApiConfig(EndPoint.UPLOAD, file)
}

export const apiUploadMultipleFile = async (files: any) => {
    return ApiConfig(EndPoint.UPLOAD_MULTIPLE, files)
}

export const apiUploadMultipleVideo = async (files: any) => {
    return ApiConfig(EndPoint.UPLOAD_MULTIPLE_VIDEO, files)
}

export const apiCreateEvent = async (payload: { event: any }) => {
    return ApiConfig(EndPoint.SAVE_NEW_EVENT, payload)
}

export const apiLoadEvents = async (payload: { time?: number }) => {
    return ApiConfig(EndPoint.LOAD_EVENTS, payload)
}

export const apiUpdateEvent = async (payload: { event?: Event }) => {
    return ApiConfig(EndPoint.UPDATE_EVENT, payload)
}

export const apiDeleteEvent = async (payload: { _id: string }) => {
    return ApiConfig(EndPoint.DELETE_EVENT, payload)
}

export const apiLoadEventById = async (payload: { _id: string }) => {
    return ApiConfig(EndPoint.LOAD_EVENT_BY_ID, payload)
}

export const apiLoadDepartment = async (payload?: { status: Number[] }) => {
    return ApiConfig(EndPoint.LOAD_DEPARTMENTS, payload)
}

export const apiCreateDepartment = async (payload?: { departmentInfo: Department }) => {
    return ApiConfig(EndPoint.SAVE_NEW_DEPARTMENT, payload)
}

export const apiUpdateDepartment = async (payload?: { departmentInfo: any }) => {
    return ApiConfig(EndPoint.UPDATE_DEPARTMENT, payload)
}

export const apiImportTimeSheets = async (file: any) => {
    return ApiConfig(EndPoint.IMPORT_TIMESHEETS, file)
}

export const apiLoadTimeSheets = async (payload: { month: number, year: number, userId?: string, page: number }) => {
    return ApiConfig(EndPoint.LOAD_TIMESHEETS, payload)
}

export const apiDeleteTimeSheets = async (payload: { month: number, year: number }) => {
    return ApiConfig(EndPoint.DELETE_TIMESHEETS, payload)
}

export const apiLoadTimeSheetsForStaff = async (payload: { month: number, year: number, userId: string }) => {
    return ApiConfig(EndPoint.LOAD_TIMESHEETS_FOR_STAFF, payload)
}

export const apiLoadForms = async (payload: { userId?: string }) => {
    return ApiConfig(EndPoint.LOAD_FORMS, payload)
}

export const apiCreateForm = async (payload: { form: Form }) => {
    return ApiConfig(EndPoint.SAVE_NEW_FORM, payload)
}

export const apiUpdateForm = async (payload: { form: Form }) => {
    return ApiConfig(EndPoint.UPDATE_FORM, payload)
}

export const apiLoadRankingStaff = async (payload: { month?: number, year?: number }) => {
    return ApiConfig(EndPoint.RANKING_STAFF, payload)
}

export const apiLoadRankingByStaff = async (payload: { month?: number, year?: number, userId: string }) => {
    return ApiConfig(EndPoint.LOAD_RANKING_BY_STAFF, payload)
}

export const apiLoadTasksByUser = async (payload: { statuses: string[], clickupId: any }) => {
    return ApiConfig(EndPoint.LOAD_TASKS_BY_USER, payload)
}
export const apiLoadTimeKeppingByStaff = async (payload: { userId: string }) => {
    return ApiConfig(EndPoint.LOAD_STAFF_TIMEKEEPING, payload)
}
