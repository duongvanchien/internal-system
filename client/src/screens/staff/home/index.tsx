import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { Container, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import { useEffect, useReducer } from 'react';
import { Event } from '../../../../../models/event';
import { FCLoading } from '../../../components/FCLoading';
import { MONTHS, YEARS } from '../../../constant/utils';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { eventState, requestLoadEvents } from '../../../redux/slices/eventSlice';
import { requestLoadRankingStaff, statisticTimesheetState } from '../../../redux/slices/statisticTimesheetsSlice';
import { Activities } from './components/Activities';
import { InfoSlide } from './components/InfoSlide';
import { TopMember } from './components/TopMember';
import { changeMonth, changeYear, homeReducer, initState } from './logic';
import './style.scss';

export const HomeScreen = () => {
    const eventSlice = useAppSelector(eventState);
    const [uiState, uiLogic] = useReducer(homeReducer, initState);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const statisticTimesheetSlice = useAppSelector(statisticTimesheetState);

    const loadRankingStaff = async (props: { month: number, year: number }) => {
        try {
            const actionResult = await dispatch(requestLoadRankingStaff({ month: props.month, year: props.year }))
            unwrapResult(actionResult);
        } catch (err) {
            enqueueSnackbar("Không thể lấy thông tin bảng xếp hạng", { variant: "error" })
        }
    }

    useEffect(() => {
        loadRankingStaff({ month: uiState.month, year: uiState.year });
    }, [])



    const handleChangeMonth = (e: any) => {
        uiLogic(changeMonth(e.target.value))
        loadRankingStaff({ month: Number(e.target.value), year: uiState.year });
    }

    const handleChangeYear = (e: any) => {
        uiLogic(changeYear(e.target.value))
        loadRankingStaff({ month: uiState.month, year: Number(e.target.value) });
    }

    const renderHeader = () => {
        return (
            <>
                <h2 style={{ color: '#fff' }}>TOP NHÂN VIÊN XUẤT SẮC</h2>
                <div className="filter_btn">
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size='small'
                        style={{ borderColor: '#fff', backgroundColor: '#6D6AF0', color: '#fff', fontWeight: 'bold' }}
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
                        style={{ borderColor: '#fff', backgroundColor: '#6D6AF0', color: '#fff', fontWeight: 'bold' }}
                        defaultValue={uiState.year}
                        onChange={handleChangeYear}
                    >
                        {YEARS.map((value, key) => (
                            <MenuItem value={value.value} key={key}>{value.label}</MenuItem>
                        ))}
                    </Select>
                </div>
            </>
        )
    }

    const renderTopMember = () => {
        return (
            <>
                <TopMember listRanking={statisticTimesheetSlice?.statisticTimesheets} />
            </>
        )
    }

    const renderActivities = (events: Event[]) => {
        return (
            <Activities events={events} />
        )
    }

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const actionResult = await dispatch(requestLoadEvents({ time: Date.now() }))
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Không thể tải danh sách sự kiện", { variant: "error" })
            }
        }
        loadEvents();
    }, [])


    return (
        <div>
            {statisticTimesheetSlice.loading && <FCLoading />}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div className="header_page">
                    {renderHeader()}
                </div>
            </div>
            <div>{renderTopMember()}</div>

            <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center' }}>
                <LightbulbIcon style={{ color: '#6D6AF0' }} />
                <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Hoạt động của team</div>
            </Container>
            <div>
                {renderActivities(eventSlice.events)}
            </div>

            {/* <Container maxWidth="lg">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LightbulbIcon style={{ color: '#6D6AF0' }} />
                    <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Các thông tin khác</div>
                </div>
                <div><InfoSlide /></div>
            </Container> */}
        </div >
    )
}