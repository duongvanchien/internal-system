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
                enqueueSnackbar("Kh??ng th??? l???y th??ng tin nh??n vi??n", { variant: "error" })
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
            enqueueSnackbar("C???p nh???t th??ng tin th??nh c??ng", { variant: "success" });
            reset();
            uiLogic(setOpenDialogUpdateInfo(false))
        } catch (error) {
            enqueueSnackbar("C???p nh???t th??ng tin th???t b???i", { variant: "error" })
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
                        : <div className="field_content">{content || "Ch??a c???p nh???t"}</div>}
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
                    : <div style={{ fontSize: '0.8rem', marginLeft: '2rem', marginTop: '0.5rem' }}>Ch??a c???p nh???t</div>
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
                    <h6 style={{ margin: 0, color: "#1E2959" }}>Th??ng tin c?? b???n</h6>
                    <Grid container spacing={2}>
                        <Grid item sm={12} style={{ justifyContent: "center" }}>
                            <FCUploadImage onChange={handleChangeImage} className="upload_box_avatar" url={uiState?.avatar} />
                        </Grid>
                        <Grid item sm={6}>
                            {renderFieldTemp({ label: "T??n", name: "name", placeholder: "Nh???p t??n", require: true })}
                            {renderFieldTemp({ label: "?????a ch??? hi???n t???i", name: "address", placeholder: "Nh???p ?????a ch??? hi???n t???i" })}
                            <div style={{ margin: "0.7rem 0" }}>
                                <span>Ng??y sinh</span>
                                <FCDateTime value={uiState.birth} handleChangeValue={(newValue) => uiLogic(setBirth(newValue))} register={register} name="birth" />
                            </div>
                        </Grid>
                        <Grid item sm={6}>
                            {renderFieldTemp({ label: "S??? ??i???n tho???i", name: "phoneNumber", placeholder: "Nh???p s??? ??i???n tho???i" })}
                            {renderFieldTemp({ label: "Email", name: "email", placeholder: "Nh???p email" })}
                            {renderFieldTemp({ label: "Link facebook", name: "facebookId", placeholder: "Nh???p link facebook" })}
                        </Grid>
                    </Grid >

                    <h4 style={{ margin: 0, color: "#1E2959" }}>Th??ng tin gi???i thi???u</h4>
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            {renderFieldTemp({ label: "Gi???i thi???u", name: "description", placeholder: "Nh???p m?? t???", multiline: true, rows: 5 })}
                            {renderFieldTemp({ label: "Tr?????ng ?????i h???c/Cao ?????ng", name: "university", placeholder: "Nh???p tr?????ng ?????i h???c/cao ?????ng" })}
                        </Grid>
                        <Grid item sm={6}>
                            {renderFieldTemp({ label: "S??? th??ch", name: "hobby", placeholder: "Nh???p s??? th??ch", multiline: true, rows: 5 })}
                            {renderFieldTemp({ label: "Qu?? qu??n", name: "hometown", placeholder: "Nh???p qu?? qu??n" })}
                        </Grid>
                    </Grid>

                    <div className="buttons_dialog">
                        <div>
                            <FCButton text="X??a t???t c???" color="error" size="small" handleAction={() => reset()} />
                        </div>
                        <div>
                            <FCButton
                                text="????ng"
                                variant="text"
                                color="error"
                                size="small"
                                handleAction={() => {
                                    uiLogic(setOpenDialogUpdateInfo(false));
                                    reset()
                                }}
                            />
                            <FCButton type="submit" text="X??c nh???n" color="success" size="small" />
                        </div>
                    </div>
                </form >
            </div>
        )
    }

    const renderHeader = () => {
        return (
            <>
                <h2 style={{ color: '#fff', textAlign: 'center' }}>TH??NG TIN C?? NH??N</h2>
                <div>
                    <div className="slogan_header">TH??NG TIN NH??N VI??N KOOLSOFT</div>
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
                    {params.userId === authReducer.userInfo?._id && <div className="btn_edit_profile" onClick={() => handleStartUpdateInfo()}>Ch???nh s???a trang c?? nh??n</div>}
                </div>

                <div>
                    <h5 className="title_profile">Th??ng tin c?? b???n</h5>
                </div>
                <div>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            {renderFieldUser({ icon: <PersonRoundedIcon />, title: 'Ph??ng ban', content: userReducer?.userInfo?.department?.name })}
                            {renderFieldUser({ icon: <AssignmentIndRoundedIcon />, title: 'Ng??y/th??ng/n??m sinh', content: userReducer?.userInfo?.birth ? moment(userReducer?.userInfo?.birth).format("DD/MM/YYYY") : "Ch??a c???p nh???t" })}
                            {renderFieldUser({ icon: <LocationOnRoundedIcon />, title: '?????a ch??? hi???n t???i', content: userReducer?.userInfo?.address || "Ch??a c???p nh???t" })}
                        </Grid>
                        <Grid item md={6} xs={12}>
                            {renderFieldUser({ icon: <EmailRoundedIcon />, title: 'Email', content: userReducer?.userInfo?.email || "Ch??a c???p nh???t" })}
                            {renderFieldUser({ icon: <LocalPhoneRoundedIcon />, title: 'S??? ??i???n tho???i', content: userReducer?.userInfo?.phoneNumber || "Ch??a c???p nh???t" })}
                            {renderFieldUser({ icon: <FacebookRoundedIcon />, title: 'Facebook', content: userReducer?.userInfo?.facebookId })}
                        </Grid>
                    </Grid>
                </div>

                <div>
                    <h5 className="title_profile">Gi???i thi???u</h5>
                </div>
                <div>
                    <Grid container spacing={2}>
                        <Grid item md={6} xs={12}>
                            {renderFieldDescriptionUser({ title: "Gi???i thi???u", content: userReducer?.userInfo?.description })}
                            {renderFieldDescriptionUser({ title: "Qu?? qu??n", content: userReducer?.userInfo?.hometown })}
                        </Grid>
                        <Grid item md={6} xs={12}>
                            {renderFieldDescriptionUser({ title: "S??? th??ch", content: userReducer?.userInfo?.hobby })}
                            {renderFieldDescriptionUser({ title: "Tr?????ng ?????i h???c/cao ?????ng", content: userReducer?.userInfo?.university })}
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
                title="C???p nh???t th??ng tin"
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