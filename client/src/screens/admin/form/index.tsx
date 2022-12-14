
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Avatar, Grid, TableCell, TableRow, Tooltip } from '@mui/material';
import FCTable from '../../../components/FCTable';
import "./styles.scss";
import _ from 'lodash';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { requestLoadUsers, userState } from '../../../redux/slices/userSlice';
import { FCSelect } from '../../../components/FCSelect';
import { useEffect, useReducer, useRef } from 'react';
import { formManagementReducer, initState, setChangeStaffId, setEndDateFillter, setFormType, setOpenDialogForm, setStartDateFillter, setFormSelected, resetAll } from './logic';
import { FCDateTime } from '../../../components/FCDateTime';
import { FCButton } from '../../../components/FCButton';
import { FORM_STATUS, FORM_TYPES } from '../../../constant/utils';
import KSInternalConfig from '../../../../../common/config';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import { fillterListForm, formState, requestLoadForms, requestUpdateForm } from '../../../redux/slices/formSlice';
import { Form } from '../../../../../models/form';
import moment from 'moment';
import { FCEmpty } from '../../../components/FCEmpty';
import { FCIconButton } from '../../../components/FCIconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { FCDialog } from '../../../components/FCDialog';
import { FCTextField } from '../../../components/FCTextField';
import { authState } from '../../../redux/slices/authSlice';

export const FormManagementScreen = () => {
    const userReducer = useAppSelector(userState);
    const [uiState, uiLogic] = useReducer(formManagementReducer, initState);
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const formSlice = useAppSelector(formState);
    const noteRef = useRef<any>(null);
    const authReducer = useAppSelector(authState);

    useEffect(() => {
        uiLogic(setOpenDialogForm(false));
        const handleLoadStaff = async () => {
            try {
                const actionResult = await dispatch(requestLoadUsers({ status: [KSInternalConfig.STATUS_PUBLIC] }))
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Kh??ng th??? t???i danh s??ch nh??n vi??n", { variant: "error" })
            }
        }
        const loadFormsByUser = async () => {
            try {
                const actionResult = await dispatch(requestLoadForms({}))
                const res = unwrapResult(actionResult);
                const newForms = res.filter((form: Form) => { //Ban ?????u load s??? ????n ???? nh???n trong th??ng n??y
                    if (new Date(form.createdDate).getTime() >= uiState.startDateFillter?.getTime()! && new Date(form.createdDate).getTime() <= uiState.endDateFillter?.getTime()!) {
                        return form;
                    }
                })
                dispatch(fillterListForm(newForms || []));
            } catch (err) {
                enqueueSnackbar(`T???i danh s??ch ????n th???t b???i`, { variant: "error" })
            }
        }
        loadFormsByUser();
        handleLoadStaff();
    }, [])

    const parseListStaff = () => {
        const listStaff: any = [{ value: "", label: "T???t c??? nh??n vi??n" }]
        _.sortBy(userReducer.users, user => user.name).forEach(user => {
            listStaff.push({
                value: user?._id,
                label: user.name
            })
        })
        return listStaff;
    }

    const filterResult = () => {
        const listFormFilterDate = formSlice.initialForms.filter((form: Form) => {
            if (new Date(form.createdDate).getTime() >= uiState.startDateFillter?.getTime()!
                && new Date(form.createdDate).getTime() <= uiState.endDateFillter?.getTime()!
            ) {
                return form;
            }
        })
        const listFormFilterStaff = uiState.staffId ? listFormFilterDate.filter(form => form.userId === uiState.staffId) : listFormFilterDate;
        const listFormFilterType = uiState.formType ? listFormFilterStaff.filter(form => form.type == uiState.formType) : listFormFilterStaff;
        dispatch(fillterListForm(listFormFilterType || []));
    }

    const handleChangeStaff = (value: string) => {
        uiLogic(setChangeStaffId(value));
    }

    const handleChangeTypeForm = (value: number) => {
        uiLogic(setFormType(value));
    }

    const handleSetStartDateFillter = (newValue: Date | null) => {
        uiLogic(setStartDateFillter(newValue));
    }

    const handleSetEndDateFillter = (newValue: Date | null) => {
        uiLogic(setEndDateFillter(newValue));
    }

    const handleUpdateForm = async (status: number) => {
        try {
            const actionResult = await dispatch(requestUpdateForm({
                form: {
                    ...uiState.formSelected,
                    note: noteRef.current ? noteRef.current['value'] : "",
                    approverId: authReducer.userInfo?._id,
                    status
                }
            }))
            const res = unwrapResult(actionResult);
            enqueueSnackbar(`C???p nh???t ????n th??nh c??ng`, { variant: "success" });
            uiLogic(setOpenDialogForm(false));
        } catch (err) {
            enqueueSnackbar(`C???p nh???t ????n th???t b???i, vui l??ng th??? l???i`, { variant: "error" })
        }
    }


    const renderFillter = () => {
        return (
            <div style={{ padding: '0 0.5rem 1rem 0.5rem' }}>
                <div className="m-3 text-center"></div>
                <div className="field_filter">
                    <FCSelect
                        size="small"
                        options={parseListStaff()}
                        placeholder="Ch???n nh??n vi??n"
                        defaultValue={uiState.staffId}
                        handleChange={handleChangeStaff}
                    />
                </div>
                <div className="field_filter">
                    <FCDateTime value={uiState.startDateFillter} handleChangeValue={handleSetStartDateFillter} />
                </div>
                <div className="field_filter">
                    <FCDateTime value={uiState.endDateFillter} handleChangeValue={handleSetEndDateFillter} />
                </div>

                <div className="field_filter">
                    <FCSelect
                        size="small"
                        options={[...FORM_TYPES, { value: "", label: "T???t c???" }]}
                        placeholder="Ch???n lo???i ????n"
                        defaultValue={uiState.formType}
                        handleChange={handleChangeTypeForm}
                    />
                </div>

                <div className="field_filter" style={{ textAlign: 'center' }}>
                    {/* <FCButton
                        text='X??a t???t c???'
                        size="small"
                        color='error'
                        style={{ margin: '0 0.3rem' }}
                        handleAction={() => uiLogic(resetAll())}
                    /> */}
                    <FCButton text='T??m ki???m' size="small" color="info" style={{ margin: '0 0.3rem' }} handleAction={filterResult} />
                </div>
            </div>
        )
    }

    const handleShowFormInfo = (form: Form) => {
        uiLogic(setOpenDialogForm(true));
        uiLogic(setFormSelected(form));
    }

    const renderBodyTable = () => {
        return (
            <>
                {
                    formSlice.forms?.length ? formSlice.forms?.map((value, key) => {
                        const status = FORM_STATUS.find(item => item.value === value.status);
                        return (
                            <TableRow
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                key={key}
                            >
                                <TableCell align="left">{FORM_TYPES.find(item => item.value === value.type)?.label}</TableCell>
                                <TableCell>
                                    <div style={{ display: 'flex', alignItems: "center" }}>
                                        <Avatar src={value.user?.avatar} />
                                        <div style={{ marginLeft: '0.5rem' }}>{value.user?.name || "Ch??a c???p nh???t"}</div>
                                    </div>
                                </TableCell>

                                <TableCell align="left">{moment(value.createdDate).format("DD/MM/YYYY")}</TableCell>
                                <TableCell style={{ color: status?.color, fontWeight: 600 }}>{status?.label}</TableCell>
                                <TableCell align="left">
                                    <Tooltip title="Xem chi ti???t">
                                        <div>
                                            <FCIconButton
                                                icon={
                                                    <InfoOutlinedIcon style={{ fontSize: "1.2rem" }} />
                                                }
                                                className="icon_table"
                                                handleAction={() => handleShowFormInfo(value)}
                                            />
                                        </div>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )
                    }) : <TableCell colSpan={9}><FCEmpty /></TableCell>
                }
            </>
        )
    }

    const renderContentDialogFormInfo = () => {
        return (
            <div>
                <div >
                    <div className="line_form">
                        <div>
                            <strong style={{ marginRight: '0.5rem ' }}>Ng?????i g???i:</strong>
                            <i>{uiState.formSelected?.user?.name}</i>
                        </div>
                        <hr />
                    </div>

                    <div className="line_form">
                        <div>
                            <strong style={{ marginRight: '0.5rem ' }}>Ng??y:</strong>
                            <i>
                                {uiState.formSelected?.type === KSInternalConfig.FORM_TYPE_REST
                                    ? moment(uiState.formSelected.startDate).format("DD/MM/YYYY") + " - " + moment(uiState.formSelected.endDate).format("DD/MM/YYYY")
                                    : moment(uiState.formSelected?.date).format("DD/MM/YYYY")
                                }
                            </i>
                        </div>
                        <hr />
                    </div>

                    <div className="line_form">
                        <div>
                            <strong style={{ marginRight: '0.5rem ' }}>Th???i gian:</strong>
                            <i>
                                {uiState.formSelected?.type === KSInternalConfig.FORM_TYPE_REST
                                    ? uiState.formSelected?.offDayNum + " ng??y"
                                    : uiState.formSelected?.offTimeNum + " gi???"
                                }
                            </i>
                        </div>
                        <hr />
                    </div>
                    <div className="line_form">
                        <div>
                            <strong style={{ marginRight: '0.5rem ' }}>L?? do:</strong>
                            <i>
                                {uiState.formSelected?.content}
                            </i>
                        </div>
                        <hr />
                    </div>

                    {uiState.formSelected?.status! !== KSInternalConfig.STATUS_WAITING &&
                        <div className="line_form">
                            <div>
                                <strong style={{ marginRight: '0.5rem ' }}>Ghi ch??:</strong>
                                <i>
                                    {uiState.formSelected?.note || "Kh??ng c?? ghi ch??"}
                                </i>
                            </div>
                            <hr />
                        </div>
                    }

                    {
                        uiState.formSelected?.status! === KSInternalConfig.STATUS_WAITING &&
                        <div className="line_form">
                            <FCTextField
                                inputRef={noteRef}
                                type="text"
                                size="small"
                                label="Ghi ch??"
                                multiline
                                rows={8}
                            />
                        </div>
                    }

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
                        <FCButton
                            text="????ng"
                            variant="text"
                            color="error"
                            size="small"
                            handleAction={() => {
                                uiLogic(setOpenDialogForm(false));
                            }}
                        />

                        {
                            uiState.formSelected?.status! === KSInternalConfig.STATUS_WAITING && <FCButton
                                text="T??? ch???i"
                                color="error"
                                size="small"
                                handleAction={() => handleUpdateForm(KSInternalConfig.STATUS_REJECTED)}
                                style={{ margin: '0.3rem' }}
                            />
                        }

                        {
                            uiState.formSelected?.status! === KSInternalConfig.STATUS_WAITING && <FCButton
                                text="X??c nh???n"
                                color="success"
                                size="small"
                                handleAction={() => handleUpdateForm(KSInternalConfig.STATUS_APPROVED)}
                            />
                        }
                    </div>
                </div>
            </div >
        )
    }

    return (
        <div style={{ height: '100vh' }}>
            <FCDialog
                open={uiState.openDialogForm}
                title={FORM_TYPES.find(item => item.value === uiState.formSelected?.type)?.label}
                size="sm"
                handleClose={() => {
                    uiLogic(setOpenDialogForm(false));
                }}
                content={renderContentDialogFormInfo()}
            />
            <div className="header_tab">
                <HomeOutlinedIcon />
                <div>{location.pathname}</div>
            </div>
            <div className="header_tab_name">
                <h5 className="tab_name">Qu???n l?? ????n</h5>
            </div>
            <div style={{ marginTop: '0.5rem' }}>
                <Grid container>
                    <Grid item sm={3} className="table_form_admin">
                        {renderFillter()}
                    </Grid>
                    <Grid item sm={9} style={{ paddingLeft: "1rem " }}>
                        <FCTable
                            headers={["Lo???i ????n", "Ng?????i g???i", "Ng??y g???i", "Tr???ng th??i", ""]}
                            tableBody={renderBodyTable()}
                        />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};
