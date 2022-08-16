import { Container, Grid } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FCLoading } from "../../../components/FCLoading";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { eventState, requestLoadEventById } from "../../../redux/slices/eventSlice";
import "./styles.scss";

export const EventInfoScreen = () => {
    const params: { eventId: string } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const eventReducer = useAppSelector(eventState);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        const loadEventById = async () => {
            try {
                if (params.eventId) {
                    const res = await dispatch(requestLoadEventById({ _id: params.eventId }));
                    unwrapResult(res);
                } else {
                    enqueueSnackbar("Không tải được thông tin sự kiện", { variant: "error" });
                }
            } catch (err) {
                enqueueSnackbar("Không tải được thông tin sự kiện", { variant: "error" });
            }
        }
        loadEventById()
    }, [])

    const renderHeader = () => {
        return (
            <>
                <h2 style={{ color: '#fff', textAlign: 'center' }}>Sự kiện</h2>
                <div>
                    <div className="slogan_header">THÔNG TIN CỦA SỰ KIỆN</div>
                </div>
            </>
        )
    }

    return (
        <div style={{ marginBottom: '3rem' }}>
            {eventReducer.loading && <FCLoading />}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div className="header_page">
                    {renderHeader()}
                </div>
            </div>

            <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '-5rem' }}>
                    <div style={{
                        padding: '1rem 5rem',
                        background: "#FFFFFF",
                        boxShadow: "0px 4px 30px rgba(95, 73, 118, 0.15)",
                        borderRadius: "10px",
                        width: '100%'
                    }}>
                        <h2>{eventReducer.eventInfo?.title}</h2>
                        <div dangerouslySetInnerHTML={{
                            __html: eventReducer.eventInfo?.description!,
                        }} />
                        <img src={eventReducer.eventInfo?.background} className="img_event" onClick={() => window.open(eventReducer.eventInfo?.background, '_blank')} />
                        <p>Dưới đây là các hình ảnh và video của sự kiện</p>
                        <Grid container spacing={2}>
                            {!!eventReducer.eventInfo?.imagesUrl?.length && eventReducer.eventInfo?.imagesUrl?.map((src, key) => (
                                <Grid item md={4} xs={12}>
                                    <img src={src} key={key} className="img_event" onClick={() => window.open(src, '_blank')} />
                                </Grid>
                            ))}
                        </Grid>
                        <div>
                            {!!eventReducer.eventInfo?.videosUrl?.length && eventReducer.eventInfo?.videosUrl?.map((src, key) => (
                                <video width="100%" height="auto" controls key={key} style={{ margin: '10px 10px 0 0', borderRadius: '4px' }}>
                                    <source src={src} />
                                    Trình duyệt của bạn không hỗ trợ video này
                                </video>
                            ))}
                        </div>
                        <div style={{ margin: '0.5rem 0' }}>Chuyển đến link sau để xem đầy đủ hình ảnh của sự kiện</div>
                        <div>
                            {!!eventReducer.eventInfo?.extendUrl?.length && eventReducer.eventInfo?.extendUrl?.map((src, key) => (
                                <a href={src} key={key} target="_blank">{src}</a>
                            ))}
                        </div>
                    </div>
                </Grid>
            </Container>
        </div >
    )
}