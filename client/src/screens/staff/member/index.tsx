import { Avatar, Container, Grid } from "@mui/material"
import { unwrapResult } from "@reduxjs/toolkit";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import KSInternalConfig from "../../../../../common/config";
import { FCLoading } from "../../../components/FCLoading"
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { requestLoadUsers, userState } from "../../../redux/slices/userSlice";
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import "./styles.scss"
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertCommentRoundedIcon from '@mui/icons-material/InsertCommentRounded';
import { FCButton } from "../../../components/FCButton";
import { UserInfo } from "../../../../../models/user";
import moment from "moment";
import { Routes } from "../../../navigation/routes";
import { useHistory } from "react-router-dom";

export const MemberScreen = () => {
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const userReducer = useAppSelector(userState);
    const history = useHistory();

    useEffect(() => {
        const handleLoadUsers = async () => {
            try {
                const actionResult = await dispatch(requestLoadUsers({ status: [KSInternalConfig.STATUS_PUBLIC] }))
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Không thể tải danh sách nhân viên", { variant: "error" })
            }
        }
        handleLoadUsers();
    }, [])

    const renderHeader = () => {
        return (
            <>
                <h2 style={{ color: '#fff', textAlign: 'center' }}>DANH SÁCH</h2>
                <div>
                    <div className="slogan_header">THÀNH VIÊN CÔNG TY</div>
                </div>
            </>
        )
    }

    const renderStaffItem = (user: UserInfo) => {
        return (
            <div className="box_staff_birthday">
                <div className="box_staff_birthday_container">
                    <Avatar className="avatar_staff_box" src={user?.avatar} />
                    <div className="name_staff_box">{user?.name}</div>
                    <div>
                        <div className="btn_box_staff">
                            <FCButton startIcon={<FavoriteIcon />} text="20" color="inherit" className="icon_box_member favorite_icon" size="small" />
                            <FCButton startIcon={<InsertCommentRoundedIcon />} text="20" color="inherit" className="icon_box_member comment_icon" size="small" />
                        </div>
                    </div>
                </div>
                <div className="staff_box_depart">{user?.department?.name}</div>
                <div className="text_info_staff">
                    <LocalPhoneRoundedIcon style={{ fontSize: '1rem' }} />
                    <div>{user?.phoneNumber}</div>
                </div>

                <div className="text_info_staff">
                    <AccountBoxRoundedIcon style={{ fontSize: '1rem' }} />
                    <div>{moment(user?.birth).format("DD/MM/YYYY")}</div>
                </div>

                <div className="text_info_staff">
                    <EmailRoundedIcon style={{ fontSize: '1rem' }} />
                    <div>{user?.email}</div>
                </div>
                <div className="btn_show_info" onClick={() => history.push(`${Routes.profile}/${user._id}`)}>{`View all >`}</div>
            </div>
        )
    }

    return (
        <div style={{ marginBottom: '3rem' }}>
            {userReducer.loading && <FCLoading />}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div className="header_page">
                    {renderHeader()}
                </div>
            </div>

            <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '-5rem' }}>
                    {
                        userReducer.users?.map((staff: UserInfo, key) => (
                            <Grid item md={3} key={key}>
                                {renderStaffItem(staff)}
                            </Grid>
                        ))
                    }
                </Grid>
            </Container>
        </div >
    )
}