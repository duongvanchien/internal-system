import { Server } from 'http';
import SocketIO from 'socket.io';
import { Form } from '../../../models/form';
import { UserInfo } from '../../../models/user';

let io: SocketIO.Server;

export function initSocket(srv: Server) {
    io = new SocketIO.Server(srv, {
        path: "/api/socketio/"
    });

    io.on("connection", (socket) => {
        socket.on("join_socket", (props: { userInfo: UserInfo }) => {
            socket.join("general_room");
            io.emit("join_socket", `${props.userInfo?.name} connected`);
        });
    });

    io.on('disconnect', () => {
        console.log('user disconnected');
    });
}

export const sendNotiPrivateRoom = (props: { form: Form }) => {
    io.sockets.in("general_room").emit('create-form', props);
}

export const sendNotiConfirmForm = (props: { form: Form }) => {
    io.sockets.in("general_room").emit('update-form', props);
}

export const sendNotiUploadFileExcel = (props: { msg: string }) => {
    io.sockets.in("general_room").emit('upload-file-excel', props);
}
