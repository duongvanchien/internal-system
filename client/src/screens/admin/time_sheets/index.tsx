import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { Avatar, Grid, TableCell, TableRow } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import axios from 'axios';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect, useReducer, useState } from 'react';
import KSInternalConfig from '../../../../../common/config';
import EndPoint from '../../../../../common/endpoints';
import { ENDPOINT_LOCAL, PREFIX_API } from '../../../api/config';
import { FCButton } from '../../../components/FCButton';
import { FCConfirmDelete } from '../../../components/FCConfirmDelete';
import { FCDialog } from '../../../components/FCDialog';
import { FCEmpty } from '../../../components/FCEmpty';
import { FCLoading } from '../../../components/FCLoading';
import { FCPagination } from '../../../components/FCPagination';
import { FCSelect } from '../../../components/FCSelect';
import FCTable from '../../../components/FCTable';
import { FCUploadFile } from '../../../components/FCUploadFile';
import { MONTHS, TIME_KEEPING_STATUS, YEARS } from '../../../constant/utils';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { requestDeleteTimeSheets, requestImportTimeSheet, requestLoadTimeSheets, timesheetState } from '../../../redux/slices/timesheetSlice';
import { requestLoadUsers, userState } from '../../../redux/slices/userSlice';
import { changeFileUpload, changeMonth, changeUploadStatusDialog, changeYear, initState, setChangeStaffId, setOpenDialogDeleteTimeSheets, timeSheetsReducer } from './logic';

const AdminTimeSheetScreen = () => {
    const [uiState, uiLogic] = useReducer(timeSheetsReducer, initState);
    const { enqueueSnackbar } = useSnackbar();
    const timesheetReducer = useAppSelector(timesheetState);
    const userReducer = useAppSelector(userState);
    const dispatch = useAppDispatch();
    // Chuyển sang dùng state cho ngắn =))
    const [openConfirmExportExcel, setOpenConfirmExportExcel] = useState(false)

    const handleLoadTimeSheets = useCallback(async (month: number, year: number, page: number, userId?: string) => {
        try {
            const actionResult = await dispatch(requestLoadTimeSheets({ month, year, userId, page }));
            unwrapResult(actionResult);
        } catch (err) {
            enqueueSnackbar("Không thể tải danh sách chấm công", { variant: "error" })
        }
    }, [uiState.month, uiState.year])

    /**
     * ?????????
     */
    useEffect(() => {
        uiLogic(changeUploadStatusDialog(false));
        handleLoadTimeSheets(uiState.month!, uiState.year!, 1)

        const handleLoadStaff = async () => {
            try {
                const actionResult = await dispatch(requestLoadUsers({ status: [KSInternalConfig.STATUS_PUBLIC] }))
                unwrapResult(actionResult);
            } catch (err) {
                enqueueSnackbar("Không thể tải danh sách nhân viên", { variant: "error" })
            }
        }
        handleLoadStaff();
    }, [])

    const handleDropFile = useCallback(
        (files: File[]) => {
            uiLogic(changeFileUpload(files[0]))
        },
        [uiState.fileUpload],
    )

    const handleUploadFile = useCallback(async () => {
        if (uiState.fileUpload) {
            try {
                const formData = new FormData();
                formData.append("file", uiState.fileUpload);
                const actionResult = await dispatch(requestImportTimeSheet({ file: formData }))
                const res = unwrapResult(actionResult);
                enqueueSnackbar(res, { variant: _.includes(res, KSInternalConfig.UPLOAD_FILE_EXCEL_SUCCESS) ? "success" : "warning" });
                uiLogic(changeUploadStatusDialog(false));
                uiLogic(changeFileUpload(null));
            } catch (error) {
                enqueueSnackbar("Tải file thất bại, vui lòng thử lại", { variant: "error" })
            }
        } else {
            enqueueSnackbar("Vui lòng chọn file muốn tải lên", { variant: "warning" })
        }
    }, [uiState.fileUpload])

    const handleChangeMonth = (value: number) => {
        uiLogic(changeMonth(value));
        handleLoadTimeSheets(Number(value), Number(uiState.year!), 1, uiState.staffId)
    }

    const handleChangeYear = (value: number) => {
        uiLogic(changeYear(value));
        handleLoadTimeSheets(Number(uiState.month!), Number(value), 1, uiState.staffId)
    }

    const handleChangeStaff = (value: string) => {
        uiLogic(setChangeStaffId(value));
        handleLoadTimeSheets(Number(uiState.month!), Number(uiState.year!), 1, value)
    }

    const handleChangePage = (page: number) => {
        handleLoadTimeSheets(Number(uiState.month!), Number(uiState.year!), page, uiState.staffId)
    }

    const handleDeleteTimeSheet = async () => {
        try {
            const actionResult = await dispatch(requestDeleteTimeSheets({ month: Number(uiState.month!), year: Number(uiState.year!) }))
            unwrapResult(actionResult);
            enqueueSnackbar("Xóa thành công", { variant: "success" });
            uiLogic(setOpenDialogDeleteTimeSheets(false));
        } catch (err) {
            enqueueSnackbar("Thao tác thất bại, vui lòng thử lại", { variant: "warning" })
        }
    }

    const parseListStaff = () => {
        const listStaff: any = [{ value: "", label: "Tất cả nhân viên" }]
        _.sortBy(userReducer.users, user => user.name).forEach(user => {
            listStaff.push({
                value: user?._id,
                label: user.name
            })
        })
        return listStaff;
    }

    const handleDownloadFileTimeSheet = async () => {
        try {
            axios({
                url: `${ENDPOINT_LOCAL}/${PREFIX_API}${EndPoint.DOWNLOAD_FILE_TIMESHEETS}`,
                method: 'POST',
                responseType: 'blob', // Important
                data: {
                    month: uiState.month,
                    year: uiState.year
                }
            }).then((response) => {
                fileDownload(response.data, `Thang${uiState.month}/${uiState.year}.xlsx`);
                setOpenConfirmExportExcel(false)
            });
        } catch (err) {
            enqueueSnackbar("Thao tác thất bại, vui lòng thử lại", { variant: "error" })
        }
    }

    const renderUploadFile = () => {
        return (
            <>
                <strong>Lưu ý: </strong>
                <i>Chỉ được upload file với định dạng .xlsx hoặc .xls</i>
                <FCUploadFile acceptTypes={[".xlsx", ".xls", "text/xml"]} handleDropFile={handleDropFile} fileSelected={uiState.fileUpload} />
                <div className="buttons_dialog" style={{ justifyContent: 'flex-end' }}>
                    <div>
                        <FCButton
                            text="Đóng"
                            variant="text"
                            color="error"
                            size="small"
                            handleAction={() => uiLogic(changeUploadStatusDialog(false))}
                        />
                        <FCButton type="submit" text="Xác nhận" color="success" size="small" handleAction={handleUploadFile} />
                    </div>
                </div>
            </>
        )
    }


    const renderDownloadExcel = () => {
        return (
            <>
                <strong>{`Export file chấm công tháng ${uiState.month} năm ${uiState.year}`}</strong>
                <div className="buttons_dialog" style={{ justifyContent: 'flex-end' }}>
                    <div>
                        <FCButton
                            text="Đóng"
                            variant="text"
                            color="error"
                            size="small"
                            handleAction={() => setOpenConfirmExportExcel(false)}
                        />
                        <FCButton type="submit" text="Xác nhận" color="success" size="small" handleAction={handleDownloadFileTimeSheet} />
                    </div>
                </div>
            </>
        )
    }


    const renderBodyTable = () => {
        return (
            <>
                {
                    timesheetReducer.timeSheets?.length ? timesheetReducer.timeSheets.map((value, key) => (
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            key={key}
                        >
                            <TableCell align="left">{value?.date}</TableCell>
                            <TableCell>
                                <div style={{ display: 'flex', alignItems: "center" }}>
                                    <Avatar src={value.user?.avatar} />
                                    <div style={{ marginLeft: '0.5rem' }}>{value.user?.name || "Chưa cập nhật"}</div>
                                </div>
                            </TableCell>

                            <TableCell align="left">{value?.user?.machineId || "Chưa cập nhật"}</TableCell>
                            <TableCell align="left">{value?.checkin}</TableCell>
                            <TableCell align="left">{value?.checkout}</TableCell>
                            <TableCell align="left">
                                <i
                                    style={{
                                        color: TIME_KEEPING_STATUS.find(status => status.value === value.type)?.color,
                                        fontWeight: 700
                                    }}
                                >
                                    {TIME_KEEPING_STATUS.find(status => status.value === value.type)?.label}
                                </i>
                            </TableCell>
                            <TableCell align="left">{value?.workingType === KSInternalConfig.WORK_TYPE_OFFLINE ? "OFFLINE" : "ONLINE"}</TableCell>
                        </TableRow>
                    )) : <TableCell colSpan={9}><FCEmpty /></TableCell>
                }
            </>
        )
    }

    return (
        <>
            {timesheetReducer.loading && <FCLoading />}

            <FCDialog
                open={openConfirmExportExcel}
                title={`Xác nhận`}
                content={renderDownloadExcel()}
                handleClose={() => setOpenConfirmExportExcel(false)}

            />

            <FCConfirmDelete
                open={uiState.openDialogDeleteTimeSheets}
                handleClose={() => {
                    uiLogic(setOpenDialogDeleteTimeSheets(false))
                }}
                title={`bảng chấm công tháng ${uiState.month} năm ${uiState.year}`}
                warningText='Cảnh báo: sau khi xóa, dữ liệu sẽ không thể khôi phục, cân nhắc kỹ trước khi thực hiện'
                handleConfirm={handleDeleteTimeSheet}
            />

            {uiState.openUploadFile &&
                <FCDialog
                    open={uiState.openUploadFile}
                    title='Upload file chấm công'
                    content={renderUploadFile()}
                    handleClose={() => { uiLogic(changeUploadStatusDialog(false)) }}
                />
            }
            <div className="header_tab">
                <HomeOutlinedIcon />
                <div>{location.pathname}</div>
            </div>
            <div className="header_tab_name">
                <h5 className="tab_name">Bảng chấm công</h5>
                <FCButton variant="contained" text="Upload file chấm công" handleAction={() => uiLogic(changeUploadStatusDialog(true))} startIcon={<CloudUploadIcon />} />
            </div>

            <Grid container spacing={2} style={{ alignItems: 'center' }}>
                <Grid item md={2} xs={6}>
                    <FCSelect
                        size="small"
                        options={parseListStaff()}
                        placeholder="Chọn nhân viên"
                        defaultValue={uiState.staffId}
                        handleChange={handleChangeStaff}
                    />
                </Grid>

                <Grid item md={2} xs={6}>
                    <FCSelect size="small" options={MONTHS} placeholder="Chọn tháng" defaultValue={uiState.month} handleChange={handleChangeMonth} />
                </Grid>

                <Grid item md={2} xs={6}>
                    <FCSelect size="small" options={YEARS} placeholder="Chọn năm" defaultValue={uiState.year} handleChange={handleChangeYear} />
                </Grid>

                <Grid item md={4} xs={6}>
                    <FCButton
                        text="Xuất Excel"
                        color="success"
                        handleAction={() => setOpenConfirmExportExcel(true)}
                        style={{ marginRight: '0.5rem' }}
                    />
                    <FCButton
                        text="Xóa dữ liệu"
                        color="error"
                        handleAction={() => uiLogic(setOpenDialogDeleteTimeSheets(true))}

                    />
                </Grid>
            </Grid>

            <div className="body_tab">
                <FCTable headers={["Ngày", "Tên nhân viên", "Mã máy chấm công", "Giờ vào", "Giờ ra", "Trạng thái", "Hình thức làm việc"]} tableBody={renderBodyTable()} />
                {!!timesheetReducer.count &&
                    <FCPagination
                        totalPage={Math.ceil(timesheetReducer.count / KSInternalConfig.LIMIT)}
                        handleAction={handleChangePage}
                    />
                }
            </div>
        </>
    )
}

export { AdminTimeSheetScreen };

