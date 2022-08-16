import { yupResolver } from "@hookform/resolvers/yup";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Grid, Tooltip } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import _ from 'lodash';
import moment from "moment";
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Event } from "../../../../../models/event";
import { apiUploadFile, apiUploadMultipleFile, apiUploadMultipleVideo } from '../../../api/services';
import { FCButton } from '../../../components/FCButton';
import { FCConfirmDelete } from "../../../components/FCConfirmDelete";
import { FCDateTime } from '../../../components/FCDateTime';
import { FCDialog } from '../../../components/FCDialog';
import { FCEditor } from '../../../components/FCEditor';
import { FCEmpty } from "../../../components/FCEmpty";
import { FCLoading } from "../../../components/FCLoading";
import { FCRadioGroup } from '../../../components/FCRadioGroup';
import { FCTextField } from '../../../components/FCTextField';
import { FCUploadImage } from '../../../components/FCUploadImage';
import { TYPE_ERROR } from '../../../constant/utils';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { eventState, requestCreateEvent, requestDeleteEvent, requestLoadEvents, requestUpdateEvent } from '../../../redux/slices/eventSlice';
import { eventReducer, initState, resetInitialState, setBackgroundImage, setContentEditor, setDefaultContentEditor, setDeleteImage, setDeleteVideo, setEndTime, setEventInfo, setImagesUrl, setLoadingImages, setLoadingVideos, setOpenDialogAddOrUpdateEvent, setOpenDialogDeleteEvent, setStartTime, setThumbImage, setTypeUploadImages, setTypeUploadVideo, setVideosUrl } from './logic';
import './styles.scss';

const EventSchema = yup.object().shape({
    title: yup.string().required(TYPE_ERROR.isEmpty),
    shortDescription: yup.string().required(TYPE_ERROR.isEmpty),
    address: yup.string().required(TYPE_ERROR.isEmpty),
});

export const ImageUploaded = (props: {
    url: string,
    handleDeleteImage: any
}) => {
    const { url, handleDeleteImage } = props;
    return (
        <div className='image_container'>
            <img src={url} className="image_cus" />
            <div className='image_cus_overlay'>
                <Tooltip title="Xóa">
                    <DeleteOutlineIcon
                        className="icon"
                        onClick={handleDeleteImage}
                    />
                </Tooltip>
                <Tooltip title="Xem">
                    <RemoveRedEyeOutlinedIcon className="icon" onClick={() => window.open(url, '_blank')} />
                </Tooltip>
            </div>
        </div>
    )
}

export const EventManagermentScreen = () => {
    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(EventSchema),
    });
    const [uiState, uiLogic] = useReducer(eventReducer, initState);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const eventSlice = useAppSelector(eventState);

    useEffect(() => {
        uiLogic(setOpenDialogAddOrUpdateEvent(false))
        const loadEvents = async () => {
            try {
                const actionResult = await dispatch(requestLoadEvents({}))
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Không thể tải danh sách sự kiện", { variant: "error" })
            }
        }
        loadEvents()
    }, [])

    const handleAddOrUpdateEvent = async (data: any) => {
        const eventInfo = {
            title: data.title,
            startTime: uiState.startTime?.getTime(),
            endTime: uiState.endTime?.getTime(),
            description: uiState.contentEditor,
            shortDescription: data.shortDescription,
            address: data.address,
            background: uiState.backgroundImage,
            thumbnail: uiState.thumbImage,
            imagesUrl: uiState.imagesUrl,
            videosUrl: uiState.videosUrl,
            extendUrl: _.remove([data.extendImage, data.extendVideo], (e) => e !== '')
        }
        try {
            if (!uiState.eventInfo) {
                const actionResult = await dispatch(requestCreateEvent({
                    event: eventInfo
                }));
                unwrapResult(actionResult);
                enqueueSnackbar("Tạo sự kiện thành công", { variant: "success" })
            } else {
                const actionResult = await dispatch(requestUpdateEvent({
                    event: { ...eventInfo, _id: uiState.eventInfo._id }
                }))
                unwrapResult(actionResult);
                enqueueSnackbar("Cập nhật sự kiện thành công", { variant: "success" })
            };
            resetForm();
            uiLogic(setOpenDialogAddOrUpdateEvent(false));
        } catch (err) {
            enqueueSnackbar("Tạo sự kiện thất bại, vui lòng thử lại", { variant: "error" })
        }
    }

    const resetForm = useCallback(() => {
        reset();
        uiLogic(resetInitialState());
    }, [])

    const handleChangeThumbImage = useCallback(
        async (event: any) => {
            const formData = new FormData();
            formData.append("file", event.target.files[0])
            const res = await apiUploadFile(formData);
            res.data && uiLogic(setThumbImage(res.data))
        }, [])

    const handleChangeBackgroundImage = useCallback(
        async (event: any) => {
            const formData = new FormData();
            formData.append("file", event.target.files[0])
            const res = await apiUploadFile(formData);
            res.data && uiLogic(setBackgroundImage(res.data))
        }, [])

    const handleChangeListImage = useCallback(
        async (e: any) => {
            try {
                let formData = new FormData();
                for (let i = 0; i < e.target.files.length; i++) { // ??????????
                    formData.append("file", e.target.files[i])
                };
                uiLogic(setLoadingImages(true));
                const res = await apiUploadMultipleFile(formData);
                uiLogic(setImagesUrl(res.data));
            } catch (err) {
                enqueueSnackbar("Tải video thất bại, dung lượng tối đa là 100MB", { variant: "error" })
            }
            uiLogic(setLoadingImages(false));
        }, [])

    const handleChangeListVideo = useCallback(
        async (e: any) => {
            let formData = new FormData();
            for (let i = 0; i < e.target.files.length; i++) { // ??????????
                formData.append("file", e.target.files[i])
            };
            uiLogic(setLoadingVideos(true));
            const res = await apiUploadMultipleVideo(formData);
            uiLogic(setLoadingVideos(false));
            uiLogic(setVideosUrl(res.data));
        }, [])

    // const handleInitValue = (value: any) => {
    //     descriptionRef.current.value = value
    // }

    const handleUpdateEvent = useCallback(
        (eventInfo: Event) => {
            uiLogic(setOpenDialogAddOrUpdateEvent(true));
            setValue('title', eventInfo.title);
            uiLogic(setDefaultContentEditor(eventInfo.description));
            uiLogic(setContentEditor(eventInfo.description));
            setValue('shortDescription', eventInfo.shortDescription);
            setValue('address', eventInfo.address);
            setValue('extendImage', eventInfo.extendUrl[0]);
            setValue('extendVideo', eventInfo.extendUrl[1]);
            uiLogic(setStartTime(new Date(eventInfo.startTime)));
            uiLogic(setEndTime(new Date(eventInfo.endTime)));
            uiLogic(setThumbImage(eventInfo.thumbnail));
            uiLogic(setBackgroundImage(eventInfo.background));
            if (eventInfo.imagesUrl.length) {
                uiLogic(setTypeUploadImages(1))
            }
            if (eventInfo.videosUrl.length) {
                uiLogic(setTypeUploadVideo(1))
            }
            uiLogic(setImagesUrl(eventInfo.imagesUrl));
            uiLogic(setVideosUrl(eventInfo.videosUrl));
            uiLogic(setEventInfo(eventInfo));
        }, [])

    const handleDeleteEvent = useCallback(async () => {
        try {
            const actionResult = await dispatch(requestDeleteEvent({
                _id: uiState.eventInfo?._id!
            }))
            const res = unwrapResult(actionResult);
            enqueueSnackbar(`Xóa sự kiện ${res?.title} thành công`, { variant: "success" });
            resetForm();
            uiLogic(setOpenDialogDeleteEvent(false));
        } catch {
            enqueueSnackbar("Xóa sự kiện thất bại", { variant: "error" })
        }
    }, [uiState.eventInfo])

    const renderContentDialogAddOrUpdateEvent = () => {
        return (
            <div>
                <form onSubmit={handleSubmit(handleAddOrUpdateEvent)}>
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            <div style={{ margin: "0.7rem 0" }}>
                                <span>Tên sự kiện</span>
                                <span className="text_error">*</span>
                                <div>
                                    <FCTextField name="title" register={register} size="small" placeholder="Nhập tên sự kiện" />
                                </div>
                                {errors.title && <p className='text_error'>{errors.title.message}</p>}
                            </div>

                            <div style={{ margin: "0.7rem 0", display: 'flex' }}>
                                <div style={{ width: '100%', marginRight: '0.5rem' }}>
                                    <span>Ngày bắt đầu</span>
                                    <span className="text_error">*</span>
                                    <FCDateTime value={uiState.startTime} handleChangeValue={(newValue) => uiLogic(setStartTime(newValue))} register={register} name="startTime" />
                                </div>
                                <div style={{ width: '100%' }}>
                                    <span>Ngày kết thúc</span>
                                    <span className="text_error">*</span>
                                    <FCDateTime value={uiState.endTime} handleChangeValue={(newValue) => uiLogic(setEndTime(newValue))} register={register} name="endTime" />
                                </div>
                            </div>

                            <div style={{ margin: "0.7rem 0" }}>
                                <span>Địa điểm diễn ra sự kiện</span>
                                <span className="text_error">*</span>
                                <div>
                                    <FCTextField name="address" register={register} size="small" placeholder="Nhập tên đại điểm" />
                                </div>
                                {errors.address && <p className='text_error'>{errors.address.message}</p>}
                            </div>

                            <div style={{ margin: "0.7rem 0" }}>
                                <span>Mô tả ngắn</span>
                                <span className="text_error">*</span>
                                <div>
                                    <FCTextField name="shortDescription" register={register} size="small" placeholder="Nhập mô tả" multiline rows={9} />
                                </div>
                                {errors.shortDescription && <p className='text_error'>{errors.shortDescription.message}</p>}
                            </div>
                        </Grid>
                        <Grid item sm={6}>
                            <div style={{ margin: "0.7rem 0" }}>
                                <Grid container spacing={2}>
                                    <Grid item md={4}>
                                        <span>Ảnh thu nhỏ</span>
                                        <div>
                                            <FCUploadImage className='upload_box_thmb' onChange={handleChangeThumbImage} url={uiState?.thumbImage} id="thumb_img" />
                                        </div>
                                    </Grid>
                                    <Grid item md={8}>
                                        <span>Ảnh mô tả</span>
                                        <div>
                                            <FCUploadImage className='upload_box_background' onChange={handleChangeBackgroundImage} url={uiState?.backgroundImage} id="background_img" />
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>

                            <div style={{ margin: "1rem 0" }}>
                                <span>Ảnh sự kiện <small>(Nhập đường dẫn hoặc chọn ảnh)</small></span>
                                <FCRadioGroup
                                    radioList={[
                                        { value: 0, label: "Nhập đường dẫn ảnh" },
                                        { value: 1, label: "Upload ảnh" },
                                    ]}
                                    value={uiState.typeUploadImages}
                                    handleChange={(value: number) => uiLogic(setTypeUploadImages(value))}
                                    row
                                />
                                {
                                    Number(uiState.typeUploadImages) === 0 ?
                                        <div>
                                            <FCTextField size="small" placeholder="Nhập đường dẫn ảnh" register={register} name="extendImage" />
                                        </div> :
                                        <div>
                                            <input type="file" multiple accept='.jpg, .png, .jpeg' onChange={handleChangeListImage} />
                                            {uiState.loadingImages && <div><CircularProgress style={{ width: '20px', height: 'auto', marginTop: '3px' }} /></div>}
                                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {!!uiState.imagesUrl?.length && uiState.imagesUrl?.map((url, key) => (
                                                    <span key={key} style={{ margin: '5px' }}>
                                                        <ImageUploaded url={url} handleDeleteImage={() => uiLogic(setDeleteImage(url))} />
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                }
                            </div>

                            <div style={{ margin: "0.7rem 0" }}>
                                <span>Video <small>(Nhập đường dẫn hoặc chọn video)</small></span>
                                <FCRadioGroup
                                    radioList={[
                                        { value: 0, label: "Nhập đường dẫn video" },
                                        { value: 1, label: "Upload video" },
                                    ]}
                                    value={uiState.typeUploadVideo}
                                    handleChange={(value: number) => uiLogic(setTypeUploadVideo(value))}
                                    row
                                />
                                {
                                    Number(uiState.typeUploadVideo) === 0 ?
                                        <div>
                                            <FCTextField size="small" placeholder="Nhập đường dẫn video" register={register} name="extendVideo" />
                                        </div> :
                                        <div >
                                            <input type="file" multiple accept="video/*" onChange={handleChangeListVideo} />
                                            {uiState.loadingVideos && <div><CircularProgress style={{ width: '20px', height: 'auto', marginTop: '3px' }} /></div>}
                                            <div>
                                                {uiState.videosUrl && uiState.videosUrl?.map((url, key) => (
                                                    <>
                                                        <video width="340" height="250" controls key={key} style={{ margin: '10px 10px 0 0', borderRadius: '4px' }}>
                                                            <source src={url} />
                                                            Trình duyệt của bạn không hỗ trợ video này
                                                        </video>
                                                        <div style={{ cursor: 'pointer', color: 'red' }} onClick={() => uiLogic(setDeleteVideo(url))}>Xóa video</div>
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                }
                            </div>
                        </Grid>
                    </Grid >
                    <Grid container>
                        <Grid item xs={12}>
                            <div style={{ margin: "0.7rem 0" }}>
                                <span>Mô tả về sự kiện</span>
                                <FCEditor handleChangeContent={(content: string) => uiLogic(setContentEditor(content))} defaultValue={uiState.defaultContentEditor} height={800} />
                            </div>
                        </Grid>
                    </Grid>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                        <div>
                            <FCButton
                                text="Đóng"
                                variant="text"
                                color="error"
                                size="small"
                                handleAction={() => resetForm()}
                            />
                            <FCButton type="submit" text="Xác nhận" color="success" size="small" />
                        </div>
                    </div>
                </form >
            </div >
        )
    }


    const renderCardEvent = (event: Event) => {
        return (
            <Card sx={{ maxHeight: 350, minHeight: 350, position: 'relative' }}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" src={event.thumbnail} />
                    }
                    title={<b>{event.title}</b>}
                    subheader={moment(event.startTime).format('DD/MM/YYYY') + " - " + moment(event.endTime).format('DD/MM/YYYY')}
                />
                <CardMedia
                    component="img"
                    height="150"
                    image={event.background}
                    alt="Ảnh mô tả"
                />
                <CardContent>
                    <small className="text_des_split">
                        {event.shortDescription}
                    </small>
                </CardContent>
                <CardActions style={{ position: 'absolute', bottom: 0, right: 0 }}>
                    <FCButton
                        text="Xóa"
                        color="error"
                        size="small"
                        className="cus_btn_card"
                        handleAction={() => {
                            uiLogic(setEventInfo(event));
                            uiLogic(setOpenDialogDeleteEvent(true))
                        }}
                    />
                    <FCButton text="Sửa" color="info" size="small" className="cus_btn_card" handleAction={() => handleUpdateEvent(event)} />
                    {/* <FCButton text="Chi tiết" color="success" size="small" className="cus_btn_card" /> */}
                </CardActions>
            </Card>
        )
    }

    return (
        <>
            {eventSlice.loading && <FCLoading />}
            <FCConfirmDelete
                open={uiState.openDialogDeleteEvent}
                handleClose={() => {
                    uiLogic(setOpenDialogDeleteEvent(false))
                    resetForm()
                }}
                title={`${uiState.eventInfo?.title}`}
                handleConfirm={handleDeleteEvent}
            />
            <FCDialog
                open={uiState.openDialogAddOrUpdateEvent}
                fullScreen
                content={renderContentDialogAddOrUpdateEvent()}
                title={!uiState.eventInfo ? 'Tạo sự kiện' : `Sửa sự kiện ${uiState.eventInfo?.title}`}
            />
            <div className="header_tab">
                <HomeOutlinedIcon />
                <div>{location.pathname}</div>
            </div>
            <div className="header_tab_name">
                <h5 className="tab_name">Sự kiện</h5>
                <FCButton text="Tạo sự kiện" startIcon={<AddOutlinedIcon />} handleAction={() => { uiLogic(setOpenDialogAddOrUpdateEvent(true)) }} />
            </div>


            <div style={{ marginTop: "1rem" }}>
                <b>Chưa diễn ra</b>
                <hr />
                <div className="body_tab">
                    <Grid container spacing={2}>
                        {eventSlice.events?.length ? eventSlice.events.map((value, key) => (
                            <>
                                {value.startTime > Date.now() && <Grid item key={key} md={3} sm={12}>
                                    {renderCardEvent(value)}
                                </Grid>}
                            </>
                        )) : <FCEmpty />}
                    </Grid>
                </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
                <b>Đã tổ chức</b>
                <hr />
                <div className="body_tab">
                    <Grid container spacing={2}>
                        {eventSlice.events?.length ? eventSlice.events.map((value, key) => (
                            <>
                                {value.startTime <= Date.now() && <Grid item key={key} md={3} sm={12}>
                                    {renderCardEvent(value)}
                                </Grid>}
                            </>
                        )) : <FCEmpty />}
                    </Grid>
                </div>
            </div>
        </>
    )
}