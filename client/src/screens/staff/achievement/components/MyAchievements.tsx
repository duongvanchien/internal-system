import { Avatar, Grid, MenuItem, Select, Tooltip } from "@mui/material";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { achievementReducer, initState, changeMonth, changeYear } from "../logic";
import { useCallback, useEffect, useReducer, useState } from "react";
import { MONTHS, YEARS } from "../../../../constant/utils";
import { authState } from "../../../../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hook";
import { requestLoadTimeSheetsForStaff, timesheetState } from "../../../../redux/slices/timesheetSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSnackbar } from "notistack";
import { FCLoading } from "../../../../components/FCLoading";
import KSInternalConfig from "../../../../../../common/config";
import _ from "lodash";
import { useParams, useHistory } from "react-router-dom";
import { requestLoadUserInfo, userState } from "../../../../redux/slices/userSlice";
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Routes } from '../../../../navigation/routes'
import { requestLoadRankingByStaff, statisticTimesheetState } from "../../../../redux/slices/statisticTimesheetsSlice";
import { apiLoadTimeKeppingByStaff } from "../../../../api/services";
import { FCDialog } from '../../../../components/FCDialog';
import { TimeKeeping } from "../../../../../../models/time_keeping";
const localizer = momentLocalizer(moment)

export const MyAchievements = () => {
    const authReducer = useAppSelector(authState);
    const userReducer = useAppSelector(userState);
    const timesheetReducer = useAppSelector(timesheetState);
    const [uiState, uiLogic] = useReducer(achievementReducer, initState);
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params: { userId: string } = useParams();
    const history = useHistory();
    const statisticTimesheetReducer = useAppSelector(statisticTimesheetState);
    const [open, setOpen] = useState(false)
    const [data_, setData_] = useState<TimeKeeping>()

    useEffect(() => {
        apiLoadTimeKeppingByStaff({ userId: `${authReducer.userInfo?._id}` }).then((res) => {
            setData_(res.data)
        })
    }, [])

    const handleLoadTimeSheets = useCallback(async (month: number, year: number, userId: string) => {
        try {
            const actionResult = await dispatch(requestLoadTimeSheetsForStaff({ month, year, userId }));
            unwrapResult(actionResult);
            const actionResultInfo = await dispatch(requestLoadRankingByStaff({ month, year, userId }));
            unwrapResult(actionResultInfo);
        } catch (err) {
            enqueueSnackbar("Không thể tải danh sách chấm công", { variant: "error" })
        }
    }, [])

    useEffect(() => {
        const handleLoadUserInfo = async () => {
            try {
                const actionResult = await dispatch(requestLoadUserInfo({ userId: params.userId }))
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Không thể lấy thông tin nhân viên", { variant: "error" })
            }
        }
        params.userId && handleLoadUserInfo();
        handleLoadTimeSheets(uiState.month!, uiState.year!, params.userId);
    }, [params.userId])

    const handleChangeMonth = (e: any) => {
        uiLogic(changeMonth(e.target.value));
        handleLoadTimeSheets(e.target.value, uiState.year!, params.userId)
    }

    const handleChangeYear = (e: any) => {
        uiLogic(changeYear(e.target.value));
        handleLoadTimeSheets(uiState.month!, e.target.value, params.userId)
    }

    const renderSelectTime = () => {
        return (
            <div className="select_time_achie">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size='small'
                    style={{ fontWeight: 'bold', margin: '0 0.3rem' }}
                    defaultValue={uiState.month}
                    onChange={handleChangeMonth}
                >
                    {MONTHS.map((value, key) => (
                        <MenuItem value={value.value} key={key}>{value.label}</MenuItem>
                    ))}
                </Select>

                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size='small'
                    style={{ fontWeight: 'bold', margin: '0 0.3rem' }}
                    defaultValue={uiState.year}
                    onChange={handleChangeYear}
                >
                    {YEARS.map((value, key) => (
                        <MenuItem value={value.value} key={key}>{value.label}</MenuItem>
                    ))}
                </Select>
            </div>
        )
    }

    const renderCalendar = () => {
        return (
            <Calendar
                localizer={localizer}
                date={new Date(`${uiState.month}/01/${uiState.year}`)}
                events={timesheetReducer.timeSheets.length ? timesheetReducer.timeSheets.map(timesheet => {
                    const event = (title: string, date: string, backgroundColor: string) => {
                        return ({
                            title,
                            allDay: true,
                            start: new Date(moment(date, "D/M/YYYY").format("MM/DD/YYYY")),
                            end: new Date(moment(date, "D/M/YYYY").format("MM/DD/YYYY")),
                            backgroundColor
                        })
                    }
                    if (timesheet.type === KSInternalConfig.TIME_KEPPING_LATE) {
                        return event("Đi muộn", timesheet.date, "#FEC001");
                    } else if (timesheet.type === KSInternalConfig.TIME_KEPPING_OK) {
                        return event("Đạt yêu cầu", timesheet.date, "#3FB660");
                    } else if (timesheet.type === KSInternalConfig.TIME_KEPPING_FORGET) {
                        return event("Quên chấm công", timesheet.date, "red");
                    } else if (timesheet.type === KSInternalConfig.TIME_KEPPING_REST) {
                        return event("Nghỉ", timesheet.date, "#FF5151");
                    } else if (timesheet.type === KSInternalConfig.TIME_KEEPING_NOT_ENOUGHT) {
                        return event("Không đủ thời gian", timesheet.date, "#51CBFF");
                    } else if (timesheet.type === KSInternalConfig.TIME_KEEPING_NOT_PASS) {
                        return event("Không đạt yêu cầu", timesheet.date, "#607d8b");
                    } else {
                        return event("Chưa cập nhật", timesheet.date, "gray");
                    }
                }) : []}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={["month"]}
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: `${event?.backgroundColor}`
                    }
                })}
                popupOffset={30}
                toolbar={false}
            />
        )
    }
    const openDialog = () => {
        setOpen(!open)
    }
    const renderContentTimeKeeping = () => {
        return (
            <>
                {
                    data_ && <div>
                        {data_?.checkin && <div style={{ fontSize: '17px', marginBottom: '10px', fontWeight: 'bold' }}>Hôm nay bạn đã checkin vào lúc <span style={{ color: '#8cbe64' }}>{data_?.checkin}</span></div>}
                        {data_?.checkout && <div style={{ fontSize: '17px', marginBottom: '10px', fontWeight: 'bold' }}>Bạn đã checkout vào lúc <span style={{ color: 'red' }}>{data_?.checkout}</span></div>}
                    </div>
                }

            </>
        )
    }
    const renderStatistic = () => {
        const statistic = _.countBy(timesheetReducer.timeSheets, (e) => e.type);
        let workingNumber = 0;
        timesheetReducer.timeSheets.forEach(value => {
            workingNumber += value.workingNumber;
        })
        return (
            <>
                <Grid container>
                    <Grid item sm={5} xs={12} className="box_statistic">
                        <div className="box_statistic_title">
                            <div className="dot dot_green"></div>
                            <div>Số ngày đạt yêu cầu</div>
                        </div>
                        <div className="box_value">{statistic[KSInternalConfig.TIME_KEPPING_OK] || 0}</div>
                    </Grid>
                    <Grid item sm={2} xs={12}></Grid>
                    <Grid item sm={5} xs={12} className="box_statistic">
                        <div className="box_statistic_title">
                            <div className="dot dot_blue"></div>
                            <div>Số ngày không đủ t/g</div>
                        </div>
                        <div className="box_value">{statistic[KSInternalConfig.TIME_KEEPING_NOT_ENOUGHT] || 0}</div>
                    </Grid>
                    <Grid item sm={5} xs={12} className="box_statistic">
                        <div className="box_statistic_title">
                            <div className="dot dot_yellow"></div>
                            <div>Số ngày đi muộn</div>
                        </div>
                        <div className="box_value">{statistic[KSInternalConfig.TIME_KEPPING_LATE] || 0}</div>
                    </Grid>
                    <Grid item sm={2} xs={12}></Grid>
                    <Grid item sm={5} xs={12} className="box_statistic">
                        <div className="box_statistic_title">
                            <div className="dot dot_red"></div>
                            <div>Số ngày nghỉ</div>
                        </div>
                        <div className="box_value">{statistic[KSInternalConfig.TIME_KEPPING_REST] || 0}</div>
                    </Grid>
                </Grid>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <div className="box_total">
                        <div className="text_statistic">TỔNG CÔNG</div>
                        <div className="number_statistic">{workingNumber}</div>
                    </div>

                    <div className="box_total">
                        <div className="text_statistic">TỔNG ĐIỂM</div>
                        <div className="number_statistic">{statisticTimesheetReducer.statisticTimeSheetInfo?.score || 0}</div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <div style={{ position: 'relative', padding: '1rem' }}>
            {timesheetReducer.loading && <FCLoading />}
            {
                authReducer.userInfo?._id !== userReducer.userInfo?._id && <Tooltip title="Thành tích của tôi">
                    <div className='btn_back' onClick={() => history.push(`${Routes.achievement}/${authReducer.userInfo?._id}`)}>
                        <div>
                            <Avatar src={authReducer.userInfo?.avatar} />
                        </div>
                        <div style={{ fontWeight: 600, marginLeft: '0.3rem' }}>
                            ME
                        </div>
                        <ChevronRightRoundedIcon />
                    </div>
                </Tooltip>
            }
            {
                authReducer.userInfo?._id === userReducer.userInfo?._id && data_ && <Tooltip title="Chấm công !">
                    <div className='btn_back' style={{ width: '110px' }} onClick={() => openDialog()}>
                        <div style={{ fontWeight: 600, marginLeft: '0.3rem' }}>
                            <FCDialog
                                open={open}
                                handleClose={() => {
                                    setOpen(false)
                                }}
                                title="Thông tin chấm công !"
                                content={renderContentTimeKeeping()} />
                        </div>
                        Chấm công
                        <ChevronRightRoundedIcon />
                    </div>
                </Tooltip>
            }

            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: "center" }}>
                <Avatar src={userReducer.userInfo?.avatar} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                <h3 style={{ margin: '0.5rem 0 0 0', textTransform: 'uppercase' }}>{userReducer.userInfo?.name}</h3>
                <div style={{ color: '#727272' }}>{userReducer.userInfo?.department?.name}</div>
            </div>

            <div style={{ textAlign: 'center', margin: '1rem 0' }}>{renderSelectTime()}</div>

            <div style={{ marginBottom: '1rem' }}>{renderCalendar()}</div>
            <div>{renderStatistic()}</div>

        </div>
    )
}