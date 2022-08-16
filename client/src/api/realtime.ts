import io from 'socket.io-client';
import { UserInfo } from '../../../models/user';
import { Form } from '../../../models/form';
import KSInternalConfig from '../../../common/config'
import { toast } from 'react-toastify';

const REACT_APP_ENDPOINT = process.env.REACT_APP_ENDPOINT || "http://localhost:3001";
export class SocketService {
    private socket: any;
    public init = () => {
        this.socket = io(REACT_APP_ENDPOINT, {
            path: "/api/socketio/",
            transports: ['websocket'],
            reconnection: true,
            timeout: 1000,
            reconnectionDelay: 3000,
            reconnectionDelayMax: 30000
        });

        this.socket.on('connect', () => {
            console.log("connecttion socket successfully");
        })

        this.socket.on("connect_error", (err: any) => {
            console.log(`connecttion socket error` + err);
        });

        return this;
    };

    joinSocket = (props: { userInfo: UserInfo | null }) => {

        this.socket.emit("join_socket", props).on("join_socket", (msg: string) => {
            console.log(msg)
        });

        this.socket.on("create-form", (body: { form: Form }) => {
            if (props.userInfo?.userRole == KSInternalConfig.ADMIN) {
                toast.success(`Bạn nhận được đơn mới từ ${body.form.user?.name}`);
            }
        });

        this.socket.on("update-form", (body: { form: Form }) => {
            if (props.userInfo?._id == body.form?.user?._id) {
                toast.success(`Đơn của bạn đã được cập nhật`);
            }
        });

        this.socket.on("upload-file-excel", (body: { msg: string }) => {
            if (props.userInfo?.userRole == KSInternalConfig.STAFF) {
                toast.success(body.msg);
            }
        });
    };
}