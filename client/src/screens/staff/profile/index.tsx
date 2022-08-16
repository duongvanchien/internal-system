import { yupResolver } from "@hookform/resolvers/yup";
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';
import ChangeHistoryRoundedIcon from '@mui/icons-material/ChangeHistoryRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Avatar, Container, Grid } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { apiUploadFile } from "../../../api/services";
import { FCButton } from "../../../components/FCButton";
import { FCDateTime } from "../../../components/FCDateTime";
import { FCDialog } from "../../../components/FCDialog";
import { FCLoading } from "../../../components/FCLoading";
import { FCTextField } from "../../../components/FCTextField";
import { FCUploadImage } from "../../../components/FCUploadImage";
import { TYPE_ERROR } from "../../../constant/utils";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { authState } from "../../../redux/slices/authSlice";
import { requestLoadUserInfo, requestUpdateUser, requestUpdateUserInfo, userState } from "../../../redux/slices/userSlice";
import { initState, profileReducer, setAvatarUrl, setBirth, setOpenDialogUpdateInfo } from "./logic";
import "./styles.scss";

const ProfileSchema = yup.object().shape({
    name: yup.string().required(TYPE_ERROR.isEmpty),
    phoneNumber: yup
        .string()
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, TYPE_ERROR.phoneNumberError),
    email: yup.string().email(TYPE_ERROR.emailError),
});

export const ProfileScreen = () => {
    const params: { userId: string } = useParams();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const userReducer = useAppSelector(userState);
    const authReducer = useAppSelector(authState);
    const [uiState, uiLogic] = useReducer(profileReducer, initState);
    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(ProfileSchema),
    });

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        uiLogic(setOpenDialogUpdateInfo(false));
        const handleLoadUserInfo = async () => {
            try {
                const actionResult = await dispatch(requestLoadUserInfo({ userId: params.userId }))
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Không thể lấy thông tin nhân viên", { variant: "error" })
            }
        }
        params.userId && handleLoadUserInfo();
    }, [params.userId])

    const handleUpdateInfo = async (data: any) => {
        try {
            const actionResult = await dispatch(requestUpdateUserInfo({
                userInfo: {
                    ...data,
                    avatar: uiState.avatar,
                    birth: uiState.birth?.getTime(),
                    _id: params.userId
                }
            }))
            const res = unwrapResult(actionResult);
            enqueueSnackbar("Cập nhật thông tin thành công", { variant: "success" });
            reset();
            uiLogic(setOpenDialogUpdateInfo(false))
        } catch (error) {
            enqueueSnackbar("Cập nhật thông tin thất bại", { variant: "error" })
        }
    }

    const handleStartUpdateInfo = () => {
        uiLogic(setOpenDialogUpdateInfo(true));
        setValue("name", userReducer?.userInfo?.name);
        setValue("address", userReducer?.userInfo?.address);
        setValue("phoneNumber", userReducer?.userInfo?.phoneNumber);
        setValue("email", userReducer?.userInfo?.email);
        setValue("facebookId", userReducer?.userInfo?.facebookId);
        setValue("description", userReducer?.userInfo?.description);
        setValue("hobby", userReducer?.userInfo?.hobby);
        setValue("university", userReducer?.userInfo?.university);
        setValue("hometown", userReducer?.userInfo?.hometown);
        uiLogic(setAvatarUrl(userReducer.userInfo?.avatar!));
        uiLogic(setBirth(new Date(userReducer.userInfo?.birth!)));
    }

    const handleChangeImage = async (event: any) => {
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        const res = await apiUploadFile(formData);
        res.data && uiLogic(setAvatarUrl(res.data));
    }

    const renderFieldUser = (props: {
        icon: JSX.Element,
        title: string,
        content?: string
    }) => {
        const { icon, title, content } = props;
        return (
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: "1px solid #EAEBEF", paddingBottom: '1rem', marginBottom: '1rem' }}>
                <div style={{ color: ' #6D6AF0' }}>{icon}</div>
                <div style={{ flex: 1, marginLeft: '0.3rem' }}>
                    <small className="field_title">{title}</small>
                    {content && title === "Facebook" ?
                        <div className="link_facebook" onClick={() => window.open(content.includes("https") ? content : "https://" + content)}>{content}</div>
                        : <div className="field_content">{content || "Chưa cập nhật"}</div>}
                </div>
            </div>

        )
    }

    const renderFieldDescriptionUser = (props: {
        title: string,
        content?: string
    }) => {
        const { title, content } = props;
        return (
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ChangeHistoryRoundedIcon style={{ color: ' #6D6AF0' }} />
                    <div style={{ fontWeight: 600, marginLeft: '0.3rem' }}>{title}</div>
                </div>
                {content ?
                    <li style={{ fontSize: '0.8rem', marginLeft: '2rem', marginTop: '0.5rem' }}>
                        {content}
                    </li>
                    : <div style={{ fontSize: '0.8rem', marginLeft: '2rem', marginTop: '0.5rem' }}>Chưa cập nhật</div>
                }
            </div>
        )
    }

    const renderFieldTemp = (props: { label: string, type?: string, placeholder: string, name: string, require?: boolean, multiline?: boolean, rows?: number }) => {
        const { label, type, placeholder, name, require, multiline, rows } = props;
        return (
            <div style={{ margin: "0.7rem 0" }}>
                <span>{label}</span>
                {require && <span className="text_error">*</span>}
                <FCTextField
                    type={type || "text"}
                    placeholder={placeholder}
                    name={name}
                    register={register}
                    size="small"
                    multiline={multiline}
                    rows={rows}
                />
                {errors[name] && <p className='text_error'>{errors[name].message}</p>}
            </div>
        )
    }

    const renderContentDialogUpdateInfo = () => {
        return (
            <div>
                <form onSubmit={handleSubmit(handleUpdateInfo)}>
                    <h6 style={{ margin: 0, color: "#1E2959" }}>Thông tin cơ bản</h6>
                    <Grid container spacing={2}>
                        <Grid item sm={12} style={{ justifyContent: "center" }}>
                            <FCUploadImage onChange={handleChangeImage} className="upload_box_avatar" url={uiState?.avatar} />
                        </Grid>
                        <Grid item sm={6}>
                            {renderFieldTemp({ label: "Tên", name: "name", placeholder: "Nhập tên", require: true })}
                            {renderFieldTemp({ label: "Địa chỉ hiện tại", name: "address", placeholder: "Nhập địa chỉ hiện tại" })}
                            <div style={{ margin: "0.7rem 0" }}>
                                <span>Ngày sinh</span>
                                <FCDateTime value={uiState.birth} handleChangeValue={(newValue) => uiLogic(setBirth(newValue))} register={register} name="birth" />
                            </div>
                        </Grid>
                        <Grid item sm={6}>
                            {renderFieldTemp({ label: "Số điện thoại", name: "phoneNumber", placeholder: "Nhập số điện thoại" })}
                            {renderFieldTemp({ label: "Email", name: "email", placeholder: "Nhập email" })}
                            {renderFieldTemp({ label: "Link facebook", name: "facebookId", placeholder: "Nhập link facebook" })}
                        </Grid>
                    </Grid >

                    <h4 style={{ margin: 0, color: "#1E2959" }}>Thông tin giới thiệu</h4>
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            {renderFieldTemp({ label: "Giới thiệu", name: "description", placeholder: "Nhập mô tả", multiline: true, rows: 5 })}
                            {renderFieldTemp({ label: "Trường đại học/Cao đẳng", name: "university", placeholder: "Nhập trường đại học/cao đẳng" })}
                        </Grid>
                        <Grid item sm={6}>
                            {renderFieldTemp({ label: "Sở thích", name: "hobby", placeholder: "Nhập sở thích", multiline: true, rows: 5 })}
                            {renderFieldTemp({ label: "Quê quán", name: "hometown", placeholder: "Nhập quê quán" })}
                        </Grid>
                    </Grid>

                    <div className="buttons_dialog">
                        <div>
                            <FCButton text="Xóa tất cả" color="error" size="small" handleAction={() => reset()} />
                        </div>
                        <div>
                            <FCButton
                                text="Đóng"
                                variant="text"
                                color="error"
                                size="small"
                                handleAction={() => {
                                    uiLogic(setOpenDialogUpdateInfo(false));
                                    reset()
                                }}
                            />
                            <FCButton type="submit" text="Xác nhận" color="success" size="small" />
                        </div>
                    </div>
                </form >
            </div>
        )
    }

    const renderHeader = () => {
        return (
            <>
                <h2 style={{ color: '#fff', textAlign: 'center' }}>THÔNG TIN CÁ NHÂN</h2>
                <div>
                    <div className="slogan_header">THÔNG TIN NHÂN VIÊN KOOLSOFT</div>
                </div>
            </>
        )
    }

    const renderProfile = () => {
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: "center" }}>
                    <Avatar src={userReducer.userInfo?.avatar} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    <h3 style={{ margin: '0.5rem 0 0 0', textTransform: 'uppercase' }}>{userReducer.userInfo?.name}</h3>
                    {params.userId === authReducer.userInfo?._id && <div className="btn_edit_profile" onClick={() => handleStartUpdateInfo()}>Chỉnh sửa trang cá nhân</div>}
                </div>

                <div>
                    <h5 className="title_profile">Thông tin cơ bản</h5>
                </div>
                <div>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            {renderFieldUser({ icon: <PersonRoundedIcon />, title: 'Phòng ban', content: userReducer?.userInfo?.department?.name })}
                            {renderFieldUser({ icon: <AssignmentIndRoundedIcon />, title: 'Ngày/tháng/năm sinh', content: userReducer?.userInfo?.birth ? moment(userReducer?.userInfo?.birth).format("DD/MM/YYYY") : "Chưa cập nhật" })}
                            {renderFieldUser({ icon: <LocationOnRoundedIcon />, title: 'Địa chỉ hiện tại', content: userReducer?.userInfo?.address || "Chưa cập nhật" })}
                        </Grid>
                        <Grid item md={6} xs={12}>
                            {renderFieldUser({ icon: <EmailRoundedIcon />, title: 'Email', content: userReducer?.userInfo?.email || "Chưa cập nhật" })}
                            {renderFieldUser({ icon: <LocalPhoneRoundedIcon />, title: 'Số điện thoại', content: userReducer?.userInfo?.phoneNumber || "Chưa cập nhật" })}
                            {renderFieldUser({ icon: <FacebookRoundedIcon />, title: 'Facebook', content: userReducer?.userInfo?.facebookId })}
                        </Grid>
                    </Grid>
                </div>

                <div>
                    <h5 className="title_profile">Giới thiệu</h5>
                </div>
                <div>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            {renderFieldDescriptionUser({ title: "Giới thiệu", content: userReducer?.userInfo?.description })}
                            {renderFieldDescriptionUser({ title: "Quê quán", content: userReducer?.userInfo?.hometown })}
                        </Grid>
                        <Grid item md={6} xs={12}>
                            {renderFieldDescriptionUser({ title: "Sở thích", content: userReducer?.userInfo?.hobby })}
                            {renderFieldDescriptionUser({ title: "Trường đại học/cao đẳng", content: userReducer?.userInfo?.university })}
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }

    return (
        <div>
            {userReducer.loading && <FCLoading />}
            <FCDialog
                open={uiState.openDialogUpdateInfo}
                title="Cập nhật thông tin"
                size="md"
                handleClose={() => {
                    uiLogic(setOpenDialogUpdateInfo(false));
                    reset()
                }}
                content={renderContentDialogUpdateInfo()}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div className="header_page">
                    {renderHeader()}
                </div>
            </div>

            <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '-5rem' }}>
                    <Grid xs={12} className="profile_container">
                        {renderProfile()}
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}