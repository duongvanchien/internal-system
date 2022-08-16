import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { Container, Grid, MenuItem, Select } from "@mui/material";
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import { useEffect, useReducer } from "react";
import KSInternalConfig from "../../../../../common/config";
import { FCSelect } from "../../../components/FCSelect";
import { FORM_TYPES, FORM_STATUS } from "../../../constant/utils";
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { authState } from '../../../redux/slices/authSlice';
import { fillterListForm, formState, requestCreateForm, requestLoadForms } from '../../../redux/slices/formSlice';
import { LateForm } from "./components/LateForm";
import { RestForm } from "./components/RestForm";
import { changeTypeForm, formReducer, initState, setEndDateFillter, setStartDateFillter } from "./logic";
import UpdateIcon from '@mui/icons-material/Update';
import './styles.scss'
import { Form } from '../../../../../models/form';
import { FCEmpty } from '../../../components/FCEmpty';
import moment from 'moment';
import _ from 'lodash'
import { FCDateTime } from '../../../components/FCDateTime';
import { FCLoading } from '../../../components/FCLoading';

export const FormScreen = () => {
    const [uiState, uiLogic] = useReducer(formReducer, initState);
    const { enqueueSnackbar } = useSnackbar();
    const dispatch = useAppDispatch();
    const authReducer = useAppSelector(authState);
    const formSlice = useAppSelector(formState);

    useEffect(() => {
        const loadFormsByUser = async () => {
            try {
                const actionResult = await dispatch(requestLoadForms({
                    userId: authReducer.userInfo?._id
                }))
                const res = unwrapResult(actionResult);

                const newForms = res.filter((form: Form) => { //Ban đầu load số đơn trong tháng này
                    if (form.type === KSInternalConfig.FORM_TYPE_REST) {
                        if (form.startDate >= uiState.startDateFillter?.getTime()! && form.startDate <= uiState.endDateFillter?.getTime()!) {
                            return form;
                        }
                    } else if (form.type === KSInternalConfig.FORM_TYPE_LATE) {
                        if (form.date >= uiState.startDateFillter?.getTime()! && form.date <= uiState.endDateFillter?.getTime()!) {
                            return form;
                        }
                    }
                })
                dispatch(fillterListForm(newForms || []));
            } catch (err) {
                enqueueSnackbar(`Tải danh sách đơn thất bại`, { variant: "error" })
            }
        }
        loadFormsByUser()
    }, [])

    const handleCreateForm = async (data: any, reset: any) => {
        try {
            switch (Number(uiState.typeForm)) {
                case KSInternalConfig.FORM_TYPE_LATE:
                    const actionResultLate = await dispatch(requestCreateForm({
                        form: {
                            ...data,
                            type: uiState.typeForm,
                            date: data.date.getTime(),
                            userId: authReducer.userInfo?._id
                        }
                    }))
                    unwrapResult(actionResultLate);
                    enqueueSnackbar(`Gửi đơn thành công, vui lòng chờ xác nhận`, { variant: "success" })
                    reset;
                    break;
                case KSInternalConfig.FORM_TYPE_REST:
                    const actionResultRest = await dispatch(requestCreateForm({
                        form: {
                            ...data,
                            type: uiState.typeForm,
                            startDate: data.startDate.getTime(),
                            endDate: data.endDate.getTime(),
                            userId: authReducer.userInfo?._id
                        }
                    }))
                    unwrapResult(actionResultRest);
                    enqueueSnackbar(`Gửi đơn thành công, vui lòng chờ xác nhận`, { variant: "success" })
                    reset;
                    break;
            }
        } catch (error) {
            enqueueSnackbar(`Gửi đơn thất bại, vui lòng thử lại`, { variant: "error" })
        }
    }

    const handleChangeTypeForm = (value: number) => {
        uiLogic(changeTypeForm(value));
    }

    const handleSetStartDateFillter = (newValue: Date | null) => {
        uiLogic(setStartDateFillter(newValue));
        const newForms = formSlice.initialForms.filter(form => {
            if (form.type === KSInternalConfig.FORM_TYPE_REST) {
                if (form.startDate >= newValue?.getTime()! && form.startDate <= uiState.endDateFillter?.getTime()!) {
                    return form;
                }
            } else if (form.type === KSInternalConfig.FORM_TYPE_LATE) {
                if (form.date >= newValue?.getTime()! && form.date <= uiState.endDateFillter?.getTime()!) {
                    return form;
                }
            }
        })
        dispatch(fillterListForm(newForms || []));
    }

    const handleSetEndDateFillter = (newValue: Date | null) => {
        uiLogic(setEndDateFillter(newValue));
        const newForms = formSlice.initialForms.filter(form => {
            if (form.type === KSInternalConfig.FORM_TYPE_REST) {
                if (form.startDate >= uiState.startDateFillter?.getTime()! && form.startDate <= newValue?.getTime()!) {
                    return form;
                }
            } else if (form.type === KSInternalConfig.FORM_TYPE_LATE) {
                if (form.date >= uiState.startDateFillter?.getTime()! && form.date <= newValue?.getTime()!) {
                    return form;
                }
            }
        })
        dispatch(fillterListForm(newForms));
    }

    const renderHeader = () => {
        return (
            <>
                <h2 style={{ color: '#fff', textAlign: 'center' }}>QUẢN LÝ ĐƠN</h2>
                <div>
                    <div className="slogan_header">THÔNG TIN ĐƠN CỦA BẠN</div>
                </div>
            </>
        )
    }

    const renderHistoryItem = (form: Form) => {
        const status = FORM_STATUS.find(value => value.value === form.status);
        return (
            <div className="form_item">
                <div style={{ display: 'flex', alignItems: 'center', flex: 2 }}>
                    <ArticleOutlinedIcon sx={{ mr: 2, color: status?.color }} />
                    <div style={{ fontWeight: 600 }}>{FORM_TYPES.find(value => value.value === form.type)?.label}</div>
                </div>
                <div style={{ flex: 2 }}>
                    {form.type === KSInternalConfig.FORM_TYPE_REST
                        ? `${moment(form.startDate).format("DD/MM/YYYY")} - ${moment(form.endDate).format("DD/MM/YYYY")}`
                        : `${moment(form.date).format("DD/MM/YYYY")}`
                    }
                </div>
                <div className="status_form" style={{ color: status?.color }}>{status?.label}</div>
            </div>
        )
    }

    const renderStatistic = () => {
        const offDayNum = _.sumBy(formSlice.forms, (form: any) => {
            if (form.type === KSInternalConfig.FORM_TYPE_REST && form.status === KSInternalConfig.STATUS_APPROVED) { // Tổng số ngày nghỉ trong trường hợp đơn được chấp thuận
                return form?.offDayNum;
            }
        });
        let lateDayNum = 0;
        formSlice.forms.forEach(form => {
            if (form.type === KSInternalConfig.FORM_TYPE_LATE && form.status === KSInternalConfig.STATUS_APPROVED) {
                lateDayNum += 1;
            }
        })

        return (
            <Grid container spacing={3}>
                <Grid item sm={6}>
                    <div className="box_statistic_form">
                        <div className="text_box_form">Số ngày nghỉ</div>
                        <div className="num_box_form">{offDayNum || 0}</div>
                    </div>
                </Grid>
                <Grid item sm={6}>
                    <div className="box_statistic_form">
                        <div className="text_box_form">Số ngày xin đi muộn</div>
                        <div className="num_box_form">{lateDayNum || 0}</div>
                    </div>
                </Grid>
            </Grid>
        )
    }

    const renderContent = () => {
        return (
            <div className="tab_right">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div className="tab_right_title">
                        <h5 className='m-0'>Thống kê</h5>
                    </div>
                    <div className='date_fillter'>
                        <FCDateTime value={uiState.startDateFillter} handleChangeValue={handleSetStartDateFillter} />
                        <FCDateTime value={uiState.endDateFillter} handleChangeValue={handleSetEndDateFillter} />
                    </div>
                </div>
                <div style={{ padding: '0 2rem' }}>
                    <div style={{ marginTop: '1rem ' }}>
                        {renderStatistic()}
                    </div>

                    <div className="mt-2 mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                        <UpdateIcon />
                        <h6 className='m-0'>
                            Lịch sử
                        </h6>
                    </div>
                    <div>
                        {formSlice.forms.length ? formSlice.forms?.map((form, key) => (
                            <div key={key}>
                                {renderHistoryItem(form)}
                            </div>
                        )) : <FCEmpty />}
                    </div>
                </div>
            </div>
        )
    }

    const renderFormContent = () => {
        switch (Number(uiState.typeForm)) {
            case KSInternalConfig.FORM_TYPE_REST:
                return <RestForm handleCreateForm={handleCreateForm} />;
            case KSInternalConfig.FORM_TYPE_LATE:
                return <LateForm handleCreateForm={handleCreateForm} />;
        }
    }

    return (
        <div>
            {formSlice.loading && <FCLoading />}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <div className="header_page">
                    {renderHeader()}
                </div>
            </div>

            <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center' }}>
                <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '-5rem' }}>
                    <Grid item md={7} sm={12} style={{ minHeight: '950px' }}>
                        {renderContent()}
                    </Grid>
                    <Grid item md={5} sm={12}>
                        <div className="tab_right">
                            <div className="tab_right_title">
                                <ArticleOutlinedIcon sx={{ mr: 2 }} />
                                <h5 className="m-0">Tạo đơn mới</h5>
                            </div>
                            <div style={{ margin: "0.7rem 0" }}>
                                <span style={{ fontSize: "0.8rem", color: 'gray' }}>Loại đơn</span>
                                <span className="text_error">*</span>
                                <FCSelect size="small" options={FORM_TYPES} handleChange={handleChangeTypeForm} />
                            </div>
                            {renderFormContent()}
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}