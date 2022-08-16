import { Redirect, Route } from "react-router-dom"
import { useAppSelector } from "../redux/hook";
import { authState } from "../redux/slices/authSlice";

export const PrivateRoute = (props: {
    path: string,
    Component: any
}) => {
    const { path, Component } = props;
    const authReducer = useAppSelector(authState);

    return (
        <Route
            path={path}
            exact={true}
            render={(routeProps) =>
                authReducer.userInfo && <Component {...props} {...routeProps} />
            }
        />
    )
}