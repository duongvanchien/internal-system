import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertCommentRoundedIcon from '@mui/icons-material/InsertCommentRounded';
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { StatisticTimeSheet } from "../../../../../../models/statistic_timesheet";
import DefaultAvatar from '../../../../assets/images/default_avatar.png';
import Star from '../../../../assets/images/star.png';
import Winner from '../../../../assets/images/winner.png';
import { FCButton } from "../../../../components/FCButton";
import { Routes } from "../../../../navigation/routes";

export const TopMember = (props: {
    listRanking: StatisticTimeSheet[]
}) => {
    const { listRanking } = props;
    const history = useHistory();

    console.log(listRanking);

    const renderInteractive = () => {
        return (
            <div className="icons_box_member">
                <FCButton startIcon={<FavoriteIcon />} color="inherit" className="icon_box_member favorite_icon" />
                <FCButton startIcon={<InsertCommentRoundedIcon />} text="100" color="inherit" className="icon_box_member comment_icon" />
            </div>
        )
    }

    const renderWinner = () => {
        return (
            <div style={{ padding: '0 1.5rem' }}>
                <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '-6rem' }}>
                    <Grid item lg={3} md={12} xs={12} className="box_ranking_home box_top_two">
                        <div className="box_staff_home" style={{ marginTop: '2rem' }} onClick={() => history.push(Routes.profile + "/" + listRanking[1]?.user?._id)}>
                            <div className="box_staff_home_container">
                                <div className="avatar_home">
                                    <img src={Star} className="star_orther" />
                                    <img src={listRanking[1]?.user?.avatar || DefaultAvatar} className="avatar_orther" />
                                </div>
                                <div className="member_name">{listRanking[1]?.user?.name}</div>
                                <div className="deparment">Phòng ban</div>
                                <div className="department_member">{listRanking[1]?.user?.department?.name}</div>
                                {renderInteractive()}
                            </div>
                        </div>
                        <div className="top_number">TOP 2</div>
                    </Grid>
                    <Grid item lg={3} md={12} xs={12} className="box_ranking_home box_top_one">
                        <div className="box_staff_home" onClick={() => history.push(Routes.profile + "/" + listRanking[0]?.user?._id)}>
                            <div className="box_staff_home_container">
                                <div className="avatar_home_top1">
                                    <img src={Winner} className="logo_top1" />
                                    <img src={listRanking[0]?.user?.avatar || DefaultAvatar} className="avatar_orther" />
                                </div>
                                <div className="member_name">{listRanking[0]?.user?.name}</div>
                                <div className="deparment">Phòng ban</div>
                                <div className="department_member" style={{ marginBottom: '4rem' }}>{listRanking[0]?.user?.department?.name}</div>

                                {renderInteractive()}
                            </div>
                        </div>
                        <div className="top_number_1">TOP 1</div>
                    </Grid>
                    <Grid item lg={3} md={12} xs={12} className="box_ranking_home box_top_three">
                        <div className="box_staff_home" style={{ marginTop: '2rem' }} onClick={() => history.push(Routes.profile + "/" + listRanking[2]?.user?._id)}>
                            <div className="box_staff_home_container">
                                <div className="avatar_home">
                                    <img src={Star} className="star_orther" />
                                    <img src={listRanking[2]?.user?.avatar || DefaultAvatar} className="avatar_orther" />
                                </div>
                                <div className="member_name">{listRanking[2]?.user?.name}</div>
                                <div className="deparment">Phòng ban</div>
                                <div className="department_member">{listRanking[2]?.user?.department?.name}</div>
                                {renderInteractive()}
                            </div>
                        </div>
                        <div className="top_number">TOP 3</div>
                    </Grid>
                </Grid>
            </div>

        )
    }

    return (
        <>
            {renderWinner()}
        </>
    )
}