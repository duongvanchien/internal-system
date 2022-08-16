import FCTable from "../../../components/FCTable";
import { TableCell, TableRow, Tooltip } from "@mui/material";
import { FCIconButton } from "../../../components/FCIconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { FCEmpty } from "../../../components/FCEmpty";
import { useAppDispatch, useAppSelector } from "../../../redux/hook";
import { departmentState, requestCreateDepartment, requestDeleteDepartment, requestUpdateDepartment } from "../../../redux/slices/departmentSlice";
import { useCallback, useEffect, useReducer } from "react";
import { useSnackbar } from "notistack";
import KSInternalConfig from "../../../../../common/config";
import { requestLoadDepartments } from '../../../redux/slices/departmentSlice'
import { unwrapResult } from "@reduxjs/toolkit";
import { FCButton } from "../../../components/FCButton";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { departmentReducer, initState, resetInitialState, setDepartmentInfo, setOpenDialogAddOrUpdateDepartment, setOpenDialogDeleteDepartment } from "./logic";
import { FCLoading } from "../../../components/FCLoading";
import { FCDialog } from "../../../components/FCDialog";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TYPE_ERROR } from "../../../constant/utils";
import { FCTextField } from "../../../components/FCTextField";
import { Department } from "../../../../../models/department";
import { FCConfirmDelete } from "../../../components/FCConfirmDelete";

const DepartmentSchema = yup.object().shape({
    name: yup.string().required(TYPE_ERROR.isEmpty),
    address: yup.string().required(TYPE_ERROR.isEmpty),
    email: yup.string().required(TYPE_ERROR.isEmpty).email(TYPE_ERROR.emailError),
    hotline: yup
        .string()
        .required(TYPE_ERROR.isEmpty)
        .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, TYPE_ERROR.phoneNumberError),
});

export const DepartmentScreen = () => {
    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(DepartmentSchema),
    });
    const [uiState, uiLogic] = useReducer(departmentReducer, initState);
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const departmentSlice = useAppSelector(departmentState);

    useEffect(() => {
        uiLogic(resetInitialState());
        const handleLoadDepartment = async () => {
            try {
                const res = await dispatch(requestLoadDepartments({ status: [KSInternalConfig.STATUS_PUBLIC] }));
                unwrapResult(res)
            } catch (err) {
                enqueueSnackbar("Không thể tải danh sách phòng ban", { variant: "error" });
            }
        };
        handleLoadDepartment();
    }, []);

    const handleAddOrUpdateDepartment = async (data: any) => {
        try {
            if (!uiState.departmentInfo) {
                const actionResult = await dispatch(requestCreateDepartment({
                    departmentInfo: data
                }))
                unwrapResult(actionResult);
                enqueueSnackbar("Thêm phòng ban thành công", { variant: "success" })
            } else {
                const actionResult = await dispatch(requestUpdateDepartment({
                    departmentInfo: {
                        ...data,
                        _id: uiState.departmentInfo?._id
                    }
                }))
                const res = unwrapResult(actionResult);
                enqueueSnackbar(`Cập nhật thành công thông tin phòng ${res?.name}`, { variant: "success" })
            }
            resetForm()
        } catch (error) {
            enqueueSnackbar("Thêm phòng ban thất bại", { variant: "error" })
        }
    }

    const resetForm = useCallback(() => {
        reset();
        uiLogic(resetInitialState())
    }, []);

    const handleUpdateDepartmentInfo = useCallback(
        (departmentInfo: Department) => {
            uiLogic(setOpenDialogAddOrUpdateDepartment(true))
            setValue("name", departmentInfo.name);
            setValue("address", departmentInfo.address);
            setValue("email", departmentInfo.email);
            setValue("hotline", departmentInfo.hotline);
            uiLogic(setDepartmentInfo(departmentInfo));
        }, [])

    const handleDeleteDepartment = useCallback(async () => {
        try {
            const actionResult = await dispatch(requestDeleteDepartment({
                departmentInfo: {
                    status: KSInternalConfig.STATUS_DELETED,
                    _id: uiState.departmentInfo?._id
                }
            }))
            const res = unwrapResult(actionResult);
            enqueueSnackbar(`Xóa phòng ${res?.name} thành công`, { variant: "success" })
            resetForm();
        } catch {
            enqueueSnackbar("Xóa nhân viên thất bại", { variant: "error" })
        }
    }, [uiState.departmentInfo])

    const renderBodyTable = () => {
        return (
            <>
                {departmentSlice.departments?.length ? (
                    departmentSlice.departments.map((value, key) => (
                        <TableRow
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            key={key}
                        >
                            <TableCell align="left">{value?.name}</TableCell>
                            <TableCell align="left">{value?.address}</TableCell>
                            <TableCell align="left">{value?.email}</TableCell>
                            <TableCell align="left">{value?.hotline}</TableCell>
                            <TableCell align="left">
                                <div style={{ display: "flex" }}>
                                    <Tooltip title="Cập nhật thông tin">
                                        <div>
                                            <FCIconButton
                                                icon={
                                                    <EditOutlinedIcon style={{ fontSize: "1.2rem" }} />
                                                }
                                                className="icon_table"
                                                handleAction={() => handleUpdateDepartmentInfo(value)}
                                            />
                                        </div>
                                    </Tooltip>

                                    <Tooltip title="Xóa">
                                        <div>
                                            <FCIconButton
                                                icon={
                                                    <DeleteOutlineOutlinedIcon
                                                        style={{ fontSize: "1.2rem" }}
                                                    />
                                                }
                                                className="icon_table"
                                                handleAction={() => {
                                                    uiLogic(setDepartmentInfo(value));
                                                    uiLogic(setOpenDialogDeleteDepartment(true))
                                                }}
                                            />
                                        </div>
                                    </Tooltip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableCell colSpan={9}>
                        <FCEmpty />
                    </TableCell>
                )}
            </>
        );
    };

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

    const renderContentDialogAddOrUpdateDepartment = () => {
        return (
            <div>
                <form onSubmit={handleSubmit(handleAddOrUpdateDepartment)}>
                    {renderTextFieldTemp("Tên phòng ban", "text", "ex: Kỹ thuật", "name", true)}
                    {renderTextFieldTemp("Địa chỉ", "text", "ex: Tầng 3", "address", true)}
                    {renderTextFieldTemp("email", "text", "ex: example@gmail.com", "email", true)}
                    {renderTextFieldTemp("Số điện thoại liên hệ", "text", "ex: 0948883721", "hotline", true)}
                    <div className="buttons_dialog">
                        <div>
                            <FCButton text="Xóa tất cả" color="error" size="small" handleAction={() => reset()} />
                        </div>
                        <div>
                            <FCButton
                                text="Đóng"
                                variant="text"
                                color="error"
                                size="small"
                                handleAction={() => {
                                    uiLogic(setOpenDialogAddOrUpdateDepartment(false));
                                    resetForm()
                                }}
                            />
                            <FCButton type="submit" text="Xác nhận" color="success" size="small" />
                        </div>
                    </div>
                </form >
            </div>
        )
    }

    return (
        <div>
            {departmentSlice.loading && <FCLoading />}
            <FCConfirmDelete
                open={uiState.openDialogDeleteDepartment}
                handleClose={() => {
                    uiLogic(setOpenDialogDeleteDepartment(false))
                    resetForm()
                }}
                title={`phòng ${uiState.departmentInfo?.name}`}
                handleConfirm={handleDeleteDepartment}
            />
            <FCDialog
                open={uiState.openDialogAddOrUpdateDepartment}
                title={!uiState.departmentInfo ? "Thêm phòng ban" : `Sửa thông tin phòng ${uiState.departmentInfo?.name}`}
                size="sm"
                handleClose={() => {
                    uiLogic(setOpenDialogAddOrUpdateDepartment(false));
                    resetForm()
                }}
                content={renderContentDialogAddOrUpdateDepartment()}
            />
            <div className="header_tab">
                <HomeOutlinedIcon />
                <div>{location.pathname}</div>
            </div>
            <div className="header_tab_name">
                <h5 className="tab_name">Phòng ban</h5>
                <FCButton text="Thêm phòng ban" startIcon={<AddOutlinedIcon />} handleAction={() => uiLogic(setOpenDialogAddOrUpdateDepartment(true))} />
            </div>
            <div className="body_tab">
                <FCTable
                    headers={["Tên phòng ban", "Địa chỉ phòng ban", "Địa chỉ Email", "Số điện thoại liên hệ", ""]}
                    tableBody={renderBodyTable()}
                />
            </div>
        </div>
    );
};
