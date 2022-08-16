import { UserInfo } from "./user";
import { isObject } from "../server/src/utils/async_handle";

class StatisticTimeSheet {
    _id: string | undefined;
    userId: string | undefined;
    date: string | undefined;
    /**
     * Số ngày đi làm muộn
     */
    lateDaysNumber: number;
    /**
     * Số ngày hoàn thành
     */
    successDaysNumber: number;
    /**
     * Số ngày quên chấm công
     */
    forgetDaysNumber: number;
    /**
     * Số ngày nghỉ
     */
    restDaysNumber: number;
    /**
     * Số ngày không hoàn thành đủ thời gian
     */
    notEnoughtDaysNumber: number;
    /**
     * Số ngày không đạt yêu cầu
     */
    notPassDaysNumber: number;
    /**
     * Tổng điểm của nhân viên trong tháng đó
     */
    score: number;
    /**
     * Tổng số công của nhân viên đó
     */
    workingNumber: number;
    user: UserInfo | null = null;

    constructor(props?: any) {
        if (!props) {
            props = {}
        }
        this._id = props._id ?? undefined;
        this.userId = props.userId?._id ?? undefined;
        this.date = props.date ?? undefined;
        this.lateDaysNumber = props.lateDaysNumber ?? 0;
        this.successDaysNumber = props.successDaysNumber ?? 0;
        this.forgetDaysNumber = props.forgetDaysNumber ?? 0;
        this.restDaysNumber = props.restDaysNumber ?? 0;
        this.notEnoughtDaysNumber = props.notEnoughtDaysNumber ?? 0;
        this.notPassDaysNumber = props.notPassDaysNumber ?? 0;
        this.score = props.score ?? 0;
        this.workingNumber = props.workingNumber ?? 0;
        this.userId = props.userId?._id ?? (props.userId ?? undefined);
        if (isObject(props.userId)) {
            this.user = new UserInfo(props.userId);
        }
    }
}
export { StatisticTimeSheet };