import styled from '@emotion/styled';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import { Avatar, Container, Grid, Tab, Tabs } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import { useEffect, useReducer, useState } from 'react';
import KSInternalConfig from '../../../../../common/config';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { authState } from '../../../redux/slices/authSlice';
import { requestLoadUsers, userState } from '../../../redux/slices/userSlice';
import { MyAchievements } from './components/MyAchievements';
import { Ranking } from './components/Ranking';
import { useHistory } from 'react-router-dom';
import { Routes } from '../../../navigation/routes';
import './styles.scss';
import { achievementReducer, initState } from './logic';
import { requestLoadRankingStaff, statisticTimesheetState } from '../../../redux/slices/statisticTimesheetsSlice';
import { FCLoading } from '../../../components/FCLoading';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{ backgroundColor: '#fff', borderRadius: '0px 20px 0px 0px', boxShadow: '0px 4px 30px rgba(95, 73, 118, 0.15)' }}
        >
            {value === index && (
                <div>{children}</div>
            )}
        </div>
    );
}

const StyledTab = styled((props: any) => (
    <Tab disableRipple {...props} />
))(() => ({
    textTransform: 'none',
    color: '#fff',
    backgroundColor: '#6D6AF0',
    marginRight: '5px',
    borderRadius: '10px 10px 0px 0px',
    fontWeight: 500,
    '&.Mui-selected': {
        color: '#000',
        fontWeight: 700,
        backgroundColor: '#fff',
        boxShadow: '0px 4px 30px rgba(95, 73, 118, 0.15)',
    },
}));

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export const AchievementScreen = () => {
    const [tab, setTab] = useState(0);
    const authReducer = useAppSelector(authState);
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const userReducer = useAppSelector(userState);
    const statisticTimesheetReducer = useAppSelector(statisticTimesheetState);
    const history = useHistory();
    const [uiState, uiLogic] = useReducer(achievementReducer, initState);

    const loadRankingStaff = async (props: { month?: number, year?: number }) => {
        try {
            const actionResult = await dispatch(requestLoadRankingStaff({ month: props.month!, year: props.year! }))
            unwrapResult(actionResult);
        } catch (err) {
            enqueueSnackbar("Không thể lấy thông tin bảng xếp hạng", { variant: "error" })
        }
    }

    useEffect(() => {
        const handleLoadUsers = async () => {
            try {
                const actionResult = await dispatch(requestLoadUsers({ status: [KSInternalConfig.STATUS_PUBLIC] }))
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Không thể tải danh sách nhân viên", { variant: "error" })
            }
        }
        loadRankingStaff({ month: uiState.monthRanking, year: uiState.yearRanking });
        handleLoadUsers();
    }, [authReducer.userInfo])

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const renderHeader = () => {
        return (
            <>
                <h2 style={{ color: '#fff', textAlign: 'center' }}>THÀNH TÍCH CỦA TÔI</h2>
                <div>
                    <div className="slogan_header">THÀNH TÍCH CỦA BẠN VÀ CỦA CHÚNG TA</div>
                </div>
            </>
        )
    }

    const renderStaff = () => {
        return (
            <div>
                {!!userReducer.users.length && userReducer.users.map((user, key) => (
                    <div key={key} className="staff_item" onClick={() => history.push(`${Routes.achievement}/${user._id}`)}>
                        <Avatar src={user.avatar} />
                        <div className="staff_item_name">
                            <div className="name">{user.name}</div>
                            <small className="department">{user.department?.name}</small>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div style={{ marginBottom: '3rem' }}>
            {statisticTimesheetReducer.loading && <FCLoading />}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div className="header_page">
                    {renderHeader()}
                </div>
            </div>

            <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '-5rem' }}>
                    <Grid item md={8} sm={12} style={{ minHeight: '950px' }}>
                        <Tabs
                            value={tab}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                            textColor="secondary"
                            indicatorColor="secondary"
                            TabIndicatorProps={{
                                style: {
                                    display: "none",
                                },
                            }}
                        >
                            <StyledTab label={<div className="tab_name"><MilitaryTechIcon />Thành tích của tôi</div>} {...a11yProps(0)} />
                            <StyledTab label={<div className="tab_name"><EmojiEventsIcon />Bảng xếp hạng</div>} {...a11yProps(1)} />
                        </Tabs>
                        <TabPanel value={tab} index={0}>
                            <MyAchievements />
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <Ranking
                                listRanking={statisticTimesheetReducer.statisticTimesheets}
                                handleLoadRankingStaff={loadRankingStaff}
                            />
                        </TabPanel>
                    </Grid>
                    <Grid item md={4} sm={12} style={{ minHeight: '950px' }}>
                        <div className="tab_right">
                            <div className="tab_right_title">
                                <GroupsOutlinedIcon sx={{ mr: 2 }} />
                                <h5 className="m-0">Danh sách thành viên</h5>
                            </div>
                            <div className="list_staff_box">{renderStaff()}</div>
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div >
    )
}