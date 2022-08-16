import KSInternalConfig from '../common/config'
class Department {
    _id: string | undefined;
    name: string;
    address: string;
    email: string;
    hotline: string;
    status: number;
    type: number;
    constructor(props: any) {
        if (!props) {
            props = {}
        }
        this._id = props._id ?? undefined;
        this.name = props.name ?? "";
        this.address = props.address ?? "";
        this.email = props.email ?? "";
        this.hotline = props.hotline ?? "";
        /**
         * Trạng thái: public, delete,...
         */
        this.status = props.status ?? 0;
        this.type = props.type ?? 0;
    }
}
export { Department }