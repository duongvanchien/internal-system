import { FCDialog } from "../../components/FCDialog"
import Logo from '../../assets/images/logo.jpg'
import "./styles.scss"
import { FCTextField } from "../../components/FCTextField"
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TYPE_ERROR } from "../../constant/utils";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import { FCButton } from "../../components/FCButton";
import BackgroundLogin from "../../assets/images/background_login.jpg"
import { useSnackbar } from "notistack";
import { encodePassword } from "../../constant/helpers";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { authState, requestLogin } from "../../redux/slices/authSlice";
import KSInternalConfig from "../../../../common/config";
import Cookies from "js-cookie"
import { Routes } from "../../navigation/routes";
import { useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { FCLoading } from "../../components/FCLoading";
import { RealtimeContext } from "../../App";
import { useContext } from "react";
import { Grid } from "@mui/material";
import LoginLeft from "../../assets/images/login_left.png"

const LoginSchema = yup.object().shape({
    account: yup.string().required(TYPE_ERROR.isEmpty),
    password: yup.string().required(TYPE_ERROR.isEmpty),
});

export const LoginScreen = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(LoginSchema),
    });
    const { enqueueSnackbar } = useSnackbar();
    const authReducer = useAppSelector(authState);
    const dispatch = useAppDispatch();
    const history = useHistory();
    const realtime = useContext(RealtimeContext);

    const handleLogin: any = async (data: {
        account: string,
        password: string
    }) => {
        try {
            // const res = await apiLogin({ account: data.account, password: encodePassword(data.account, data.password) })
            const actionResult = await dispatch(requestLogin({
                account: data.account,
                password: encodePassword(data.account, data.password)
            }))
            const res = unwrapResult(actionResult);
            switch (res.loginCode) {
                case KSInternalConfig.LOGIN_FAILED:
                    enqueueSnackbar("Đăng nhập thất bại", { variant: "error" });
                    break;
                case KSInternalConfig.LOGIN_ACCOUNT_NOT_EXIST:
                    enqueueSnackbar("Tài khoản không tồn tại", { variant: "error" });
                    break;
                case KSInternalConfig.LOGIN_WRONG_PASSWORD:
                    enqueueSnackbar("Sai mật khẩu", { variant: "error" });
                    break;
                case KSInternalConfig.LOGIN_SUCCESS:

                    /**
                     * Tạm thời lưu user vào cookies, sau sử dụng jwt
                     */
                    Cookies.set("user", JSON.stringify(res));

                    realtime.joinSocket({ userInfo: res });

                    res.userRole === KSInternalConfig.ADMIN ? history.push(Routes.dashboard) : history.push(Routes.home);
                    break;
            }
        } catch (err) {
            enqueueSnackbar("Đăng nhập thất bại", { variant: "error" })
        }
    }

    const renderContentFormLogin = () => {
        return (
            <>
                <div className="logo_form_login">
                    <img src={Logo} width={48} />
                    <h5>KOOLSOFT</h5>
                </div>
                <div className="slogan_form_login">Hi, Welcome</div>
                <div className="text_after_slogan">Enter your credentials to continue</div>
                <div className="tutorial_form_login">Sign in with username/password</div>

                <div>
                    <form onSubmit={handleSubmit(handleLogin)}>
                        <div className="field_form_login">
                            <FCTextField
                                type='text'
                                label="Tài khoản"
                                placeholder="ex: abc1003"
                                name='account'
                                size="medium"
                                register={register}
                                startAdornment={<AccountCircleOutlinedIcon />}
                                className="cus_textfield"
                            />
                            {errors.account && <p className='text_error'>{errors.account.message}</p>}
                        </div>
                        <div className="field_form_login">
                            <FCTextField
                                type='password'
                                label="Mật khẩu"
                                placeholder="ex: 123456"
                                name='password'
                                size="medium"
                                register={register}
                                startAdornment={<PasswordOutlinedIcon />}
                                className="cus_textfield"
                            />
                            {errors.password && <p className='text_error'>{errors.password.message}</p>}
                        </div>
                        <FCButton type="submit" text="Đăng nhập" className="btn_login" />
                    </form>
                </div>
            </>
        )
    }

    return (
        <div className="login_screen_container">
            {authReducer.loading && <FCLoading />}
            <FCDialog
                open={true}
                content={renderContentFormLogin()}
                size="xs"
                style={{ background: `url(${BackgroundLogin})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
        </div>
    )
}