export default class EndPoint {
    static SAVE_NEW_USER = "/save-new-user";
    static UPDATE_USER = "/update-user";
    static IMPORT_TIMESHEETS = "/import-time-sheets";
    static DELETE_TIMESHEETS = "/delete-time-sheets";
    static LOAD_TIMESHEETS = "/load-timesheets";
    static LOAD_USERS_BY_WORK_STATUS = "/load-user-by-work-status";
    static LOAD_USER_INFO = "/load-user-info";
    static SAVE_NEW_DEPARTMENT = "/save-new-department";
    static UPDATE_DEPARTMENT_INFO = "/update-department-info";
    static DELETE_DEPARTMENT = "/delete-department"
    static LOAD_DEPARTMENTS = "/load-departments";
    static UPDATE_DEPARTMENT = "/update-department";
    static LOGIN = "/login";
    static LOGOUT = "/logout";
    static UPLOAD = "/upload";
    static UPLOAD_MULTIPLE = "/upload-multiple";
    static UPLOAD_MULTIPLE_VIDEO = "/upload-multiple-video";
    static SAVE_NEW_EVENT = "/save-new-event";
    static LOAD_EVENTS = "/load-events";
    static UPDATE_EVENT = "/update-event";
    static DELETE_EVENT = "/delete-event";
    static LOAD_EVENT_BY_ID = "/load-event-by-id";
    static LOAD_TIMESHEETS_FOR_STAFF = "/load-timesheets-for-staff";
    static DOWNLOAD_FILE_TIMESHEETS = "/download-file-timesheets";
    static SAVE_NEW_FORM = "/save-new-form";
    static LOAD_FORMS = "/load-forms";
    static UPDATE_FORM = "/update-form";
    static DELETE_FORM = "/delete-form";
    static RANKING_STAFF = "/ranking-staff";
    static LOAD_RANKING_BY_STAFF = "/load-ranking-by-staff";
    static LOAD_STAFF_TIMEKEEPING = "/load-timekeeping-by-staff";

    /**
     * Socket
     */
    static SEND_NOTIFICATION_FORM = "send-notification-form";

    /**
     * ClickUp
     */
    static LOAD_SPACES = "/load-spaces";
    static LOAD_TASKS = "/load-tasks";
    static LOAD_TASKS_BY_USER = "/load-tasks-by-user"
}
