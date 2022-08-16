import { isObject } from "../server/src/utils/async_handle";
import { Department } from "./department";
import { UserInfo } from './user';
class UserDepartment {
    _id: string | undefined;
    userId: string | undefined;
    departmentId: string | undefined;
    user: UserInfo | undefined;
    department: Department | undefined;
    status: number;
    constructor(props: any) {
        if (!props) {
            props = {}
        }
        this._id = props._id ?? undefined;
        this.userId = props.userId?._id ?? (props.userId ?? undefined);
        this.departmentId = props.departmentId?._id ?? (props.departmentId ?? undefined);
        this.status = props.status ?? 1;
        if (isObject(props.userId)) {
            this.user = new UserInfo(props.userId);
        }
        if (isObject(props.departmentId)) {
            this.department = new Department(props.departmentId);
        }
    }
}
export { UserDepartment }