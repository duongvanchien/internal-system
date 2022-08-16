import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Avatar, Container, Grid } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useReducer } from "react";
import KSInternalConfig from "../../../../../common/config";
import { UserInfo } from "../../../../../models/user";
import { FCLoading } from '../../../components/FCLoading';
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { requestLoadUsers, userState } from "../../../redux/slices/userSlice";
import { birthdayReducer, handleNextMonth, handlePrevMonth, initState } from "./logic";
import "./styles.scss";
import BirthdayIcon from '../../../assets/images/birthday.png';

export const BirthdayScreen = () => {
    const [uiState, uiLogic] = useReducer(birthdayReducer, initState);
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const userReducer = useAppSelector(userState);

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

    const decrementMonth = useCallback(() => uiLogic(handlePrevMonth()), []);
    const incrementMonth = useCallback(() => uiLogic(handleNextMonth()), []);

    const renderHeader = () => {
        return (
            <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ArrowLeftIcon className="icon_birth" fontSize="large" onClick={decrementMonth} />
                    <h2 style={{ color: '#fff', textAlign: 'center' }}>Sự kiện tháng {uiState.month}</h2>
                    <ArrowRightIcon className="icon_birth" fontSize="large" onClick={incrementMonth} />
                </div>
                <div>
                    <div className="slogan_header">CHÚC MỪNG SINH NHẬT MỌI NGƯỜI</div>
                </div>
            </>
        )
    }

    const renderStaff = (user: UserInfo) => {
        return (
            <div className="box_staff_birthday">
                <div className="box_staff_birthday_container">
                    <Avatar className="avatar_staff_box" src={user?.avatar} />
                    <div className="name_staff_box">{user?.name}</div>
                    <div className="department_staff_box">{user?.department?.name}</div>
                </div>
                <img src={BirthdayIcon} style={{ color: '#FEC001', marginTop: '0.5rem', width: "36px" }} />
                <div className="birthday_staff_box">{moment(user?.birth).format("DD/MM/YYYY")}</div>
            </div>
        )
    }

    const filterStaffByMonth = () => {
        let listStaffAfterFillter: UserInfo[] = [];
        if (userReducer.users.length) {
            userReducer.users?.map((value: UserInfo) => {
                if (Number(moment(value?.birth).format("M")) === uiState.month) {
                    listStaffAfterFillter.push(value)
                }
            });
        }
        return listStaffAfterFillter;
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
                <Grid container spacing={4} style={{ display: 'flex', justifyContent: 'center', marginTop: '-5rem' }}>
                    {filterStaffByMonth()?.length ? filterStaffByMonth()?.map((staff: any, key: any) => (
                        <Grid item md={4} key={key}>
                            {renderStaff(staff)}
                        </Grid>
                    )) : <div className="no_data_birth">
                        <img
                            src="https://vcdn-sohoa.vnecdn.net/2019/08/13/anh-vit-4994-1563184203-8682-1565668951.gif"
                            alt="Computer man"
                            style={{ width: 100, height: 'auto', borderRadius: '50%' }}
                        />
                        <div>Không có nhân viên nào có sinh nhật vào tháng này</div>
                    </div>}
                </Grid>
            </Container>
        </div >
    )
}