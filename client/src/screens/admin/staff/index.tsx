import { yupResolver } from "@hookform/resolvers/yup";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Avatar as AvatarPreview, Grid, TableCell, TableRow, Tooltip } from '@mui/material';
import { unwrapResult } from "@reduxjs/toolkit";
import _ from 'lodash';
import moment from "moment";
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useReducer } from 'react';
import { useForm } from "react-hook-form";
import { useLocation } from 'react-router-dom';
import * as yup from "yup";
import KSInternalConfig from "../../../../../common/config";
import { UserInfo } from "../../../../../models/user";
import { apiUploadFile } from "../../../api/services";
import { FCButton } from '../../../components/FCButton';
import { FCConfirmDelete } from "../../../components/FCConfirmDelete";
import { FCDialog } from '../../../components/FCDialog';
import { FCEmpty } from '../../../components/FCEmpty';
import { FCIconButton } from '../../../components/FCIconButton';
import { FCLoading } from '../../../components/FCLoading';
import { FCSelect } from '../../../components/FCSelect';
import FCTable from '../../../components/FCTable';
import { FCTextField } from "../../../components/FCTextField";
import { encodeSHA256Pass } from "../../../constant/helpers";
import { GENDER, TYPE_ERROR, USER_TYPE } from "../../../constant/utils";
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { departmentState, requestLoadDepartments } from "../../../redux/slices/departmentSlice";
import { requestCreateUser, requestDeleteUser, requestLoadUsers, requestUpdateUser, userState } from '../../../redux/slices/userSlice';
import { initState, setAvatarUrl, setBirth, setOpenDialogAddOrUpdateStaff, setOpenDialogDeleteStaff, setUserInfo, staffReducer } from './logic';
import "./style.scss";

const StaffSchema = yup.object().shape({
    machineId: yup.string().required(TYPE_ERROR.isEmpty),
    account: yup.string().required(TYPE_ERROR.isEmpty),
    password: yup.string().required(TYPE_ERROR.isEmpty),
    name: yup.string().required(TYPE_ERROR.isEmpty),
    userType: yup.number().oneOf([0, 1, 2, 3, 4], TYPE_ERROR.isEmpty),
    gender: yup.number().oneOf([0, 1], TYPE_ERROR.isEmpty),
    departmentId: yup.string().required(TYPE_ERROR.isEmpty),
    workShift: yup.string().required(TYPE_ERROR.isEmpty),
});

export const StaffScreen = () => {
    const [uiState, uiLogic] = useReducer(staffReducer, initState);
    const userReducer = useAppSelector(userState);
    const departmentReducer = useAppSelector(departmentState);
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(StaffSchema),
    });

    useEffect(() => {
        /**
         * bug
         */
        uiLogic(setOpenDialogAddOrUpdateStaff(false))

        const handleLoadUsers = async () => {
            try {
                const actionResult = await dispatch(requestLoadUsers({ status: [KSInternalConfig.STATUS_PUBLIC] }))
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Kh??ng th??? t???i danh s??ch nh??n vi??n", { variant: "error" })
            }
        }

        const handleLoadDepartment = async () => {
            try {
                const actionResult = await dispatch(requestLoadDepartments({ status: [KSInternalConfig.STATUS_PUBLIC] }));
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Kh??ng th??? t???i danh s??ch ph??ng ban", { variant: "error" })
            }
        }
        handleLoadDepartment();
        handleLoadUsers();
    }, [])

    const resetForm = useCallback(() => {
        reset();
        uiLogic(setBirth(new Date()))
        uiLogic(setAvatarUrl(""));
        uiLogic(setUserInfo(null))
    }, [])

    const handleAddOrUpdateStaff = useCallback(
        async (data) => {
            try {
                if (!uiState.userInfo) {
                    /**
                     * async action
                     */
                    const actionResult = await dispatch(requestCreateUser({
                        userInfo: {
                            ...data,
                            password: encodeSHA256Pass(data.account, data.password),
                            userRole: 1,
                        }
                    }))
                    unwrapResult(actionResult);
                    enqueueSnackbar("Th??m nh??n vi??n th??nh c??ng", { variant: "success" })
                } else {
                    const actionResult = await dispatch(requestUpdateUser({
                        userInfo: {
                            ...data,
                            // birth: uiState.birth?.getTime(),
                            // avatar: uiState.avatar,

                            _id: uiState.userInfo?._id
                        }
                    }))
                    const res = unwrapResult(actionResult);
                    enqueueSnackbar(`C???p nh???t th??nh c??ng th??ng tin nh??n vi??n ${res?.name}`, { variant: "success" })
                }

                resetForm()
                uiLogic(setOpenDialogAddOrUpdateStaff(false))
            } catch (error) {
                enqueueSnackbar("Th??m nh??n vi??n th???t b???i", { variant: "error" })
            }
        },
        [uiState.birth],
    )

    const handleDeleteStaff = useCallback(async () => {
        try {
            const actionResult = await dispatch(requestDeleteUser({
                userInfo: {
                    status: KSInternalConfig.STATUS_DELETED,
                    _id: uiState.userInfo?._id
                }
            }))
            const res = unwrapResult(actionResult);
            enqueueSnackbar(`X??a nh??n vi??n ${res?.name} th??nh c??ng`, { variant: "success" })
            resetForm()
            uiLogic(setOpenDialogDeleteStaff(false))
        } catch {
            enqueueSnackbar("X??a nh??n vi??n th???t b???i", { variant: "error" })
        }
    }, [uiState.userInfo])

    const handleUpdateUserInfo = useCallback(
        (userInfo: UserInfo) => {
            uiLogic(setOpenDialogAddOrUpdateStaff(true))
            setValue("machineId", userInfo.machineId);
            setValue("account", userInfo.account);
            setValue("password", userInfo.password);
            setValue("name", userInfo.name);
            setValue("userType", userInfo.userType);
            setValue("gender", userInfo.gender);
            setValue("departmentId", userInfo.departmentId);
            setValue("workShift", userInfo.workShift);
            uiLogic(setBirth(new Date(userInfo.birth)));
            uiLogic(setUserInfo(userInfo));
        }, [])

    const renderBodyTable = () => {
        return (
            <>
                {
                    userReducer.users?.length ? userReducer.users.map((value, key) => (
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            key={key}
                        >
                            <TableCell component="th" scope="row" align="left" style={{ display: 'flex', alignItems: "center" }}>
                                <AvatarPreview src={value?.avatar} />
                                <div style={{ marginLeft: '0.5rem' }}>{value?.name}</div>
                            </TableCell>
                            <TableCell align="left">{value?.machineId}</TableCell>
                            <TableCell align="left">{value?.birth ? moment(value?.birth).format("DD/MM/YYYY") : "Ch??a c???p nh???t"}</TableCell>
                            <TableCell align="left">{_.find(GENDER, (o) => o.value === value?.gender)?.label}</TableCell>
                            <TableCell align="left">{_.find(USER_TYPE, (o) => o.value === value?.userType)?.label}</TableCell>
                            <TableCell align="left">{value?.department && value?.department?.name}</TableCell>
                            <TableCell align="left">
                                <div style={{ display: "flex" }}>
                                    <Tooltip title="Xem chi ti???t">
                                        <div>
                                            <FCIconButton icon={<InfoOutlinedIcon style={{ fontSize: "1.2rem" }} />} className="icon_table" />
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="C???p nh???t th??ng tin">
                                        <div>
                                            <FCIconButton
                                                icon={<EditOutlinedIcon style={{ fontSize: "1.2rem" }} />}
                                                className="icon_table"
                                                handleAction={() => handleUpdateUserInfo(value)}
                                            />
                                        </div>
                                    </Tooltip>
                                    <Tooltip title="X??a">
                                        <div>
                                            <FCIconButton
                                                icon={<DeleteOutlineOutlinedIcon style={{ fontSize: "1.2rem" }} />}
                                                className="icon_table"
                                                handleAction={() => {
                                                    uiLogic(setUserInfo(value));
                                                    uiLogic(setOpenDialogDeleteStaff(true))
                                                }} />
                                        </div>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    )) : <TableCell colSpan={9}><FCEmpty /></TableCell>
                }
            </>
        )
    }

    const renderTextFieldTemp = (label: string, type: string, placeholder: string, name: string, require?: boolean, disabled?: boolean) => {
        return (
            <div style={{ margin: "0.4rem 0" }}>
                <span>{label}</span>
                <span className={require ? "text_error" : ""}>*</span>
                <FCTextField
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    size="small"
                    register={register}
                    disabled={disabled}
                />
                {errors[name] && <p className='text_error'>{errors[name].message}</p>}
            </div>
        )
    }

    const renderContentDialogAddOrUpdateStaff = () => {
        return (
            <div>
                <form onSubmit={handleSubmit(handleAddOrUpdateStaff)}>
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            {renderTextFieldTemp("T??n t??i kho???n", "text", "ex: jindo", "account", true, uiState.userInfo ? true : undefined)}
                            {renderTextFieldTemp("M???t kh???u", "password", "ex: 123456", "password", true)}
                            {renderTextFieldTemp("M?? m??y ch???m c??ng", "text", "ex: 01", "machineId", true)}
                            {renderTextFieldTemp("T??n nh??n vi??n", "text", "ex: Nguy???n V??n A", "name", true)}

                        </Grid>
                        <Grid item sm={6}>
                            <div style={{ margin: "0.4rem 0" }}>
                                <span>Gi???i t??nh</span>
                                <span className="text_error">*</span>
                                <div>
                                    <FCSelect name="gender" register={register} size="small" options={GENDER} placeholder="Ch???n gi???i t??nh" />
                                </div>
                                {errors.gender && <p className='text_error'>{errors.gender.message}</p>}
                            </div>
                            <div style={{ margin: "0.4rem 0" }}>
                                <span>Lo???i nh??n vi??n</span>
                                <span className="text_error">*</span>
                                <div>
                                    <FCSelect name="userType" register={register} size="small" options={USER_TYPE} placeholder="Ch???n ki???u nh??n vi??n" />
                                </div>
                                {errors.userType && <p className='text_error'>{errors.userType.message}</p>}
                            </div>

                            <div style={{ margin: "0.4rem 0" }}>
                                <span>Gi??? l??m vi???c</span>
                                <span className="text_error">*</span>
                                <div>
                                    <FCSelect name="workShift" register={register} size="small" options={[{ value: KSInternalConfig.WORK_SHIFT_ONE, label: "08:00" }, { value: KSInternalConfig.WORK_SHIFT_TWO, label: "08:30" }]} placeholder="Ch???n ki???u nh??n vi??n" />
                                </div>
                                {errors.workShift && <p className='text_error'>{errors.workShift.message}</p>}
                            </div>

                            <div style={{ margin: "0.4rem 0" }}>
                                <span>Ph??ng ban</span>
                                <span className="text_error">*</span>
                                <div>
                                    <FCSelect
                                        name="departmentId"
                                        register={register} size="small"
                                        options={departmentReducer.departments.map(department => {
                                            return {
                                                value: department?._id,
                                                label: department?.name
                                            }
                                        })}
                                        placeholder="Ch???n ph??ng ban"
                                    />
                                </div>
                                {errors.departmentId && <p className='text_error'>{errors.departmentId.message}</p>}
                            </div>
                        </Grid>
                    </Grid >
                    <div>

                    </div>
                    <div className="buttons_dialog">
                        <div>
                            <FCButton text="X??a t???t c???" color="error" size="small" handleAction={() => resetForm()} />
                        </div>
                        <div>
                            <FCButton
                                text="????ng"
                                variant="text"
                                color="error"
                                size="small"
                                handleAction={() => {
                                    uiLogic(setOpenDialogAddOrUpdateStaff(false));
                                    resetForm()
                                }}
                            />
                            <FCButton type="submit" text="X??c nh???n" color="success" size="small" />
                        </div>
                    </div>
                </form >
            </div>
        )
    }

    return (
        <div>
            {userReducer.loading && <FCLoading />}
            <FCConfirmDelete
                open={uiState.openDialogDeleteStaff}
                handleClose={() => {
                    uiLogic(setOpenDialogDeleteStaff(false))
                    resetForm()
                }}
                title={`nh??n vi??n ${uiState.userInfo?.name}`}
                handleConfirm={handleDeleteStaff}
            />
            <FCDialog
                open={uiState.openDialogAddOrUpdateStaff}
                title={!uiState.userInfo ? "Th??m nh??n vi??n" : `S???a th??ng tin nh??n vi??n ${uiState.userInfo?.name}`}
                size="md"
                handleClose={() => {
                    uiLogic(setOpenDialogAddOrUpdateStaff(false));
                    resetForm()
                }}
                content={renderContentDialogAddOrUpdateStaff()}
            />
            <div className="header_tab">
                <HomeOutlinedIcon />
                <div>{location.pathname}</div>
            </div>
            <div className="header_tab_name">
                <h5 className="tab_name">Nh??n vi??n</h5>
                <FCButton text="Th??m nh??n vi??n" startIcon={<AddOutlinedIcon />} handleAction={() => uiLogic(setOpenDialogAddOrUpdateStaff(true))} />
            </div>

            <div className="body_tab">
                <FCTable headers={["Nh??n vi??n", "M?? m??y ch???m c??ng", "Ng??y sinh", "Gi???i t??nh", "Ki???u nh??n vi??n", "Ph??ng ban", ""]} tableBody={renderBodyTable()} />
            </div>
        </div>
    )
}