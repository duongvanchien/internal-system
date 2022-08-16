import KSInternalConfig from "../common/config";
import { UserInfo } from "../models/user";
import { isObject } from "../server/src/utils/async_handle";

class Form {
    _id: string | undefined;
    userId: string | undefined;
    approverId: string | undefined;
    startDate: number;
    endDate: number;
    content: string;
    offDayNum: number;
    note: string;
    type: number;
    status: number;
    user: UserInfo | undefined;
    approver: UserInfo | undefined;
    /**
     * Ngày tạo đơn
     */
    createdDate: Date;

    /**
     * Đơn xin đi muộn
     */
    date: number;
    offTimeNum: number;

    constructor(props?: any) {
        if (!props) {
            props = {}
        }
        this._id = props._id ?? undefined;
        this.userId = props.userId?._id ?? undefined;
        this.approverId = props.approverId?._id ?? undefined;
        this.offDayNum = props.offDayNum ?? 0;
        this.startDate = props.startDate ?? 0;
        this.endDate = props.endDate ?? 0;
        this.date = props.date ?? 0;
        this.offTimeNum = props.offTimeNum ?? 0;
        this.content = props.content ?? '';
        this.note = props.note ?? '';
        this.type = props.type ?? KSInternalConfig.FORM_TYPE_REST;
        this.status = props.status ?? KSInternalConfig.STATUS_WAITING;
        this.createdDate = props.createdAt ?? "";
        if (isObject(props.userId)) {
            this.user = new UserInfo(props.userId);
        }
        if (isObject(props.approverId)) {
            this.approver = new UserInfo(props.approverId);
        }
    }
}
export { Form };