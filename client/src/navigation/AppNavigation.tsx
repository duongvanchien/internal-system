import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import { Route } from "react-router-dom";
import KSInternalConfig from "../../../common/config";
import { RealtimeContext } from "../App";
import LayoutAdmin from "../layout/admin";
import { LayoutStaff } from "../layout/staff";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { authState, loadUserInfo } from "../redux/slices/authSlice";
import { LoginScreen } from "../screens/login";
import { Routes } from "./routes";

export const AppNavigation = () => {
    const authReducer = useAppSelector(authState);
    const dispatch = useAppDispatch();
    const realtime = useContext(RealtimeContext);

    useEffect(() => {
        const userInfo = Cookies.get("user") ? JSON.parse(Cookies.get("user") || "") : null;
        dispatch(loadUserInfo(userInfo));
        if (userInfo) {
            realtime.joinSocket({ userInfo });
        }
    }, [])

    const renderLayoutStaff = () => {
        return (
            <LayoutStaff />
        )
    }

    const renderLayoutAdmin = () => {
        return (
            <LayoutAdmin />
        )
    }

    return (
        <>
            <Route path={Routes.login} exact component={LoginScreen} />
            {authReducer.userInfo?.userRole === KSInternalConfig.ADMIN ? renderLayoutAdmin() : renderLayoutStaff()}
        </>
    );
};
