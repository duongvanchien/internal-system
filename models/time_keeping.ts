import { isObject } from "../server/src/utils/async_handle";
import { UserInfo } from "./user";

class TimeKeeping {
    _id: string | undefined;
    checkin: string;
    checkout: string;
    status: number;
    type: number;
    note: string;
    date: string;
    /**
     * Số công trong ngày: 0,1/2,1
     */
    workingNumber: number;
    /**
     * Hình thức làm việc: Online hay Offline
     */
    workingType: number;
    createdAt: string;
    updateAt: string;
    userId: string | undefined;
    user: UserInfo | null = null;
    constructor(args: any) {
        if (!args) {
            args = {};
        }
        this._id = args._id ?? undefined;
        this.checkin = args.checkin ?? "";
        this.checkout = args.checkout ?? "";
        this.status = args.status ?? 1;
        this.type = args.type ?? 0;
        this.note = args.note ?? "";
        this.date = args.date ?? "";
        this.workingNumber = args.workingNumber ?? 0;
        this.workingType = args.workingType ?? 0;
        this.createdAt = args.createdAt ?? "";
        this.updateAt = args.updateAt ?? "";
        this.userId = args.userId?._id ?? (args.userId ?? undefined);
        if (isObject(args.userId)) {
            this.user = new UserInfo(args.userId);
        }
    }
}
export { TimeKeeping }