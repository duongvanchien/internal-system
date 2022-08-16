import { Grid } from "@mui/material";
import {
    VerticalTimeline,
    VerticalTimelineElement
} from "react-vertical-timeline-component";
import { Event } from '../../../../../../models/event';
import moment from 'moment';
import _ from 'lodash'
import { Routes } from "../../../../navigation/routes";
import { useHistory } from "react-router-dom";

export const Activities = (props: { events: Event[] }) => {
    const { events } = props;
    const eventsShorted = events ? _.orderBy(events, 'startTime', 'asc') : [];
    const history = useHistory();

    const renderTimelineElement = (props: { event: Event }) => {
        return (
            <VerticalTimelineElement
                contentStyle={{ boxShadow: 'none' }}
                contentArrowStyle={{ borderRight: '1rem solid #839C2D' }}
                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                icon={
                    <img
                        src={props.event.thumbnail}
                        style={{
                            borderRadius: "50%",
                            height: "100%",
                            width: "100%",
                            objectFit: 'cover'
                        }}
                    />
                }
                date={moment(props.event.startTime).format("DD/MM/YYYY")}
            >
                <Grid container spacing={2}>
                    <Grid item sm={4}>
                        <img
                            src={props.event.background}
                            width="100%"
                            height="100%"
                            style={{ objectFit: 'cover', borderRadius: '8px 0 8px 0' }}
                        />
                    </Grid>
                    <Grid item sm={8}>
                        <div style={{ fontStyle: 'italic', color: '#1E4071', fontWeight: 500 }}>Sự kiện</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{props.event.title}</div>
                        <div style={{ fontStyle: 'italic', color: '#6F6F6F', fontSize: '0.8rem' }}>{moment(props.event.startTime).format("DD/MM/YYYY") + " - " + moment(props.event.endTime).format("DD/MM/YYYY")}</div>
                        <div style={{ fontWeight: 500, marginTop: '0.8rem' }}>{props.event.shortDescription}</div>
                        <div className="btn_info_event" onClick={() => history.push(Routes.eventInfo + "/" + props.event?._id)}>{`Thông tin chi tiết`}</div>
                    </Grid>
                </Grid>
            </VerticalTimelineElement>
        )
    }

    return (
        <>
            <VerticalTimeline >
                {eventsShorted?.length && eventsShorted.map((value, key) => (
                    <>
                        {renderTimelineElement({ event: value })}
                    </>
                ))}
            </VerticalTimeline>
        </>
    )
}  