import { Avatar, MenuItem, Select, TextField } from "@mui/material";
import { StatisticTimeSheet } from "../../../../../../models/statistic_timesheet"
import { FCEmpty } from "../../../../components/FCEmpty";
import Top1 from "../../../../assets/images/top1.png";
import Top2 from "../../../../assets/images/top2.png";
import Top3 from "../../../../assets/images/top3.png";
import { useReducer } from "react";
import { achievementReducer, changeMonthRanking, changeShowRanking, changeYearRanking, initState } from "../logic";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { MONTHS, YEARS } from "../../../../constant/utils";

export const Ranking = (props: {
    listRanking: StatisticTimeSheet[],
    handleLoadRankingStaff: any
}) => {
    const { listRanking, handleLoadRankingStaff } = props;
    const [uiState, uiLogic] = useReducer(achievementReducer, initState);

    const getRankingForUser = (top: number) => {
        if (top === 1) {
            return <img src={Top1} className="icon_top" />
        } else if (top === 2) {
            return <img src={Top2} className="icon_top" />
        } else if (top === 3) {
            return <img src={Top3} className="icon_top" />
        } else {
            if (top < 10) {
                return <div className="number_top">{`0${top}`}</div>
            } else {
                return <div className="number_top">{top}</div>
            }
        }
    }

    const handleChangeMonth = (e: any) => {
        uiLogic(changeMonthRanking(e.target.value));
        handleLoadRankingStaff({ month: e.target.value, year: uiState.yearRanking })
    }

    const handleChangeYear = (e: any) => {
        uiLogic(changeYearRanking(e.target.value));
        handleLoadRankingStaff({ month: uiState.yearRanking, year: e.target.value })

    }

    const renderSelectTime = () => {
        return (
            <div className="select_time_achie">
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size='small'
                    style={{ fontWeight: 'bold', margin: '0 0.3rem' }}
                    defaultValue={uiState.monthRanking}
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
                    defaultValue={uiState.yearRanking}
                    onChange={handleChangeYear}
                >
                    {YEARS.map((value, key) => (
                        <MenuItem value={value.value} key={key}>{value.label}</MenuItem>
                    ))}
                </Select>
            </div>
        )
    }

    return (
        <div style={{ padding: '1rem', minHeight: '950px' }}>
            <div style={{ textAlign: 'center' }}>
                {renderSelectTime()}
            </div>
            {listRanking?.length ? listRanking?.map((ranking: StatisticTimeSheet, key) => {
                if (key < uiState?.showRanking!) {
                    return (
                        <div>
                            <div key={key} className="ranking_staff">
                                <div className="ranking_number">{getRankingForUser(key + 1)}</div>
                                <div className="top_avatar">
                                    <Avatar src={ranking?.user?.avatar} />
                                </div>    

                                <div className="top_info">
                                    <div className="name_staff_ranking">{ranking?.user?.name}</div>
                                    <div className="department_staff_ranking">{ranking?.user?.department?.name}</div>
                                </div>
                                <div className="top_score">
                                    {ranking?.score} Điểm
                                </div>
                            </div>
                        </div>
                    )
                }
            }) : <FCEmpty />}
            {!!listRanking?.length &&
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {uiState.showRanking !== listRanking.length ?
                        <div className="btn_content" onClick={() => uiLogic(changeShowRanking(listRanking.length))}>
                            <div>Xem thêm</div>
                            <ExpandMoreIcon />
                        </div> :
                        <div className="btn_content" onClick={() => uiLogic(changeShowRanking(10))}>
                            <div>Thu gọn</div>
                            <ExpandLessIcon />
                        </div>
                    }
                </div>
            }
        </div>
    )
}