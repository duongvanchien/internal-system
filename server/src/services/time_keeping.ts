import * as XLSX from 'xlsx';
import { TimeKeepingModel } from "../database/mongo/time_keeping";
import { UserModel } from "../database/mongo/users";
import { UserInfo } from "../../../models/user";
import { TimeKeeping } from '../../../models/time_keeping';
import KSInternalConfig from '../../../common/config';
import _ from 'lodash';
import moment from "moment";
import { StatisticTimeSheetModel } from '../database/mongo/statistic_timesheet';
import mongoose from 'mongoose';
import { sendNotiUploadFileExcel } from '../sockets';
import nodeXlsx from 'node-xlsx';

const { cloudinary } = require('../utils/cloudinary')

enum TimeCategory {
    dawn,
    morning,
    noon,
    light
}
export interface StatisticTimeSheetItf {
    [key: string]: {
        successDaysNumber: number,
        lateDaysNumber: number,
        forgetDaysNumber: number,
        restDaysNumber: number,
        notEnoughtDaysNumber: number,
        notPassDaysNumber: number,
        workingNumber: number,
        date: string,
        score: number
    }
}
export interface TimeSheetImportInf {
    date: string,
    userId: string,
    checkin: string,
    checkout: string,
    type: number,
    workingNumber: number,
}

const getWorkShift = (_checkinTime: string): TimeCategory => {
    const checkinTime = moment(_checkinTime, "HH:mm");
    const startOfNoonShfit = moment("12:30", "HH:mm");
    if (checkinTime.isAfter(startOfNoonShfit)) {
        return TimeCategory.noon;
    } else {
        return TimeCategory.morning;
    }
}

const getTimeRule = (isFullOfWorkDay: boolean): number => {
    if (isFullOfWorkDay) {
        return 7;
    } else {
        return 3.5;
    }

}

export const compareTime = (startTime: string, endTime: string, userInfo: UserInfo) => {
    //Thời gian vào làm của nhân viên
    const checkinWorkShift = getWorkShift(startTime);
    //Kiểm tra xem nhân viên đi làm sáng hay chiều
    if (!startTime && !endTime) { //Nghỉ
        return {
            type: KSInternalConfig.TIME_KEPPING_REST,
            workingNumber: KSInternalConfig.WORKING_NUMBER_NONE
        };
    } else if (!startTime || !endTime) { //Quên chấm công
        return {
            type: KSInternalConfig.TIME_KEPPING_FORGET,
            workingNumber: checkinWorkShift === TimeCategory.noon ? KSInternalConfig.WORKING_NUMBER_PART : KSInternalConfig.WORKING_NUMBER_FULL
        };
    } else { //Có chấm công
        /**
        * Thời gian làm việc = Thời gian kết thúc - Thời gian bắt đầu - 1h30 nghỉ trưa
        */
        const endTimeMoment = moment(endTime, "HH:mm");
        const startTimeMoment = moment(startTime, "HH:mm");
        const workingTime = moment.duration(endTimeMoment.diff(startTimeMoment));
        const isFullOfWorkDay = workingTime.asHours() >= 6 ? true : false;
        const totalWorkTime = (isFullOfWorkDay ? workingTime.subtract(1.5, "hours") : workingTime.asHours())

        //Mốc thời gian vào làm: Sáng là theo mốc thời gian đăng ký của nhân viên, chiều là 13h30
        const workShiftStart = moment(checkinWorkShift === TimeCategory.morning ? userInfo.workShift : "13:30", "HH:mm").add(20, "minutes");
        const isPunctuality: boolean = startTimeMoment.isBefore(workShiftStart);

        // Kiểm tra có đi làm đúng giờ không?
        if (isPunctuality) {
            //Kiểm tra tổng thời gian làm việc: Full là 7h, Part là 3.5h
            if (totalWorkTime >= (getTimeRule(isFullOfWorkDay))) {
                // console.log("Đi làm đúng giờ và đủ thời gian");
                return {
                    type: KSInternalConfig.TIME_KEPPING_OK,
                    workingNumber: isFullOfWorkDay ? KSInternalConfig.WORKING_NUMBER_FULL : KSInternalConfig.WORKING_NUMBER_PART
                }
            } else {
                // console.log("Đi làm đúng giờ và không đủ thời gian");
                return {
                    type: KSInternalConfig.TIME_KEEPING_NOT_ENOUGHT,
                    workingNumber: isFullOfWorkDay ? KSInternalConfig.WORKING_NUMBER_FULL : KSInternalConfig.WORKING_NUMBER_PART
                }
            }
        } else {
            //Kiểm tra tổng thời gian làm việc: Full là 7h, Part là 3.5h
            if (totalWorkTime >= (getTimeRule(isFullOfWorkDay))) {
                // console.log("Đi làm không đúng giờ và đủ thời gian");
                return {
                    type: KSInternalConfig.TIME_KEPPING_LATE,
                    workingNumber: isFullOfWorkDay ? KSInternalConfig.WORKING_NUMBER_FULL : KSInternalConfig.WORKING_NUMBER_PART
                }
            } else {
                // console.log("Đi làm không đúng giờ và không đủ thời gian");
                return {
                    type: KSInternalConfig.TIME_KEEPING_NOT_PASS,
                    workingNumber: isFullOfWorkDay ? KSInternalConfig.WORKING_NUMBER_FULL : KSInternalConfig.WORKING_NUMBER_PART
                }
            }
        }
    }
}

const statisticForUser = async (data: TimeSheetImportInf[]) => {
    let statisticTimeSheets: StatisticTimeSheetItf = {};
    const date = data[0].date.split("/")[1] + "/" + data[0].date.split("/")[2];
    data.forEach((value: TimeSheetImportInf) => {
        if (!statisticTimeSheets[`${value.userId}`]) {
            statisticTimeSheets[`${value.userId}`] = {
                successDaysNumber: 0,
                lateDaysNumber: 0,
                forgetDaysNumber: 0,
                restDaysNumber: 0,
                notEnoughtDaysNumber: 0,
                notPassDaysNumber: 0,
                workingNumber: 0,
                date,
                score: 100
            }
        }
    });

    /**
     * Mỗi nhân viên trong tháng sẽ có 100 điểm:
     * - Đi muộn -1 điểm
     * - Quên chấm công -1 điểm
     * - Nghỉ làm -1 điểm
     * - Không đủ thời gian -1 điểm
     * - Không đạt yêu cầu -2 điểm
     */

    data.forEach((value: TimeSheetImportInf) => {
        statisticTimeSheets[`${value.userId}`].workingNumber += value.workingNumber;
        if (value.type === KSInternalConfig.TIME_KEPPING_OK) {
            statisticTimeSheets[`${value.userId}`].successDaysNumber += 1
        } else if (value.type === KSInternalConfig.TIME_KEPPING_LATE) {
            statisticTimeSheets[`${value.userId}`].lateDaysNumber += 1;
            statisticTimeSheets[`${value.userId}`].score -= 1;
        } else if (value.type === KSInternalConfig.TIME_KEPPING_FORGET) {
            statisticTimeSheets[`${value.userId}`].forgetDaysNumber += 1;
            statisticTimeSheets[`${value.userId}`].score -= 1;
        } else if (value.type === KSInternalConfig.TIME_KEPPING_REST) {
            statisticTimeSheets[`${value.userId}`].restDaysNumber += 1;
            statisticTimeSheets[`${value.userId}`].score -= 1;
        } else if (value.type === KSInternalConfig.TIME_KEEPING_NOT_ENOUGHT) {
            statisticTimeSheets[`${value.userId}`].notEnoughtDaysNumber += 1;
            statisticTimeSheets[`${value.userId}`].score -= 1;
        } else if (value.type === KSInternalConfig.TIME_KEEPING_NOT_PASS) {
            statisticTimeSheets[`${value.userId}`].notPassDaysNumber += 1
            statisticTimeSheets[`${value.userId}`].score -= 2;
        }
    });
    const res = await Promise.all(Object.keys(statisticTimeSheets).map(async (userId: string) => {
        return await new StatisticTimeSheetModel({
            ...statisticTimeSheets[userId],
            userId
        }).save();
    }))
}

class TimeKeepingService {
    importTimeSheets = async (file: any): Promise<any> => {
        let dataFromSheet = [];
        let readedData = XLSX.read(file.buffer, { type: "buffer" });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];
        dataFromSheet = XLSX.utils.sheet_to_json(ws, { header: 0, raw: false });

        const colsFile = Object.keys(dataFromSheet[0]);
        if (!_.findIndex(colsFile, "Ngày" || "ID" || "Họ và Tên" || "Giờ Vào" || "Giờ Ra")) {
            return KSInternalConfig.COLS_FILE_EXCEL_FAIL;
        }
        const getMonthFileExcel = moment(dataFromSheet[0]["Ngày"], "MM/D/YY").format("MM");
        const getYearFileExcel = moment(dataFromSheet[0]["Ngày"], "MM/D/YY").format("YYYY");

        if (await TimeKeepingModel.exists({
            date: {
                $regex: `.*/${getMonthFileExcel}/${getYearFileExcel}$`
            },
            workingType: KSInternalConfig.WORK_TYPE_OFFLINE
        })) {
            return `Vui lòng xóa hết dữ liệu trong tháng ${getMonthFileExcel} năm ${getYearFileExcel} trước khi upload file mới`;
        }

        const dataParse: any[] = await Promise.all(dataFromSheet.map(async (value: any) => {
            const userInfo = new UserInfo(await UserModel.findOne({ machineId: value["ID"] }));
            const checkin = value["Giờ Vào"] ? moment(value["Giờ Vào"], "HH:mm:ss").format("HH:mm") : "";
            const checkout = value["Giờ Ra"] ? moment(value["Giờ Ra"], "HH:mm:ss").format("HH:mm") : "";
            const workingType = compareTime(checkin, checkout, userInfo);

            return {
                date: moment(value["Ngày"], "MM/D/YY").format("D/M/YYYY"),
                userId: userInfo._id,
                checkin,
                checkout,
                type: workingType.type,
                workingNumber: workingType.workingNumber
            }
        })).then(value => value);

        statisticForUser(dataParse);

        await Promise.all(dataParse.map(async value => {
            /**
             * Nếu nhân viên đó chưa có bản ghi chấm công online thì mới thêm bản ghi chấm công trên máy 
             */
            const checkTimeKeepingExist = await TimeKeepingModel.findOne({
                date: value.date,
                userId: value.userId
            })
            if (!checkTimeKeepingExist) {
                return await (new TimeKeepingModel(value).save());
            }
        })).then(value => value);

        sendNotiUploadFileExcel({ msg: `File chấm công tháng ${getMonthFileExcel} năm ${getYearFileExcel} đã được tải lên` })

        return `${KSInternalConfig.UPLOAD_FILE_EXCEL_SUCCESS} tháng ${getMonthFileExcel} năm ${getYearFileExcel}`;
    }

    loadTimeSheets = async (body: { month: number, year: number, userId?: string, page: number }): Promise<any> => {
        const { month, year, userId, page } = body;
        try {
            const res = await TimeKeepingModel.find(!userId ? {
                status: KSInternalConfig.STATUS_PUBLIC,
                date: {
                    $regex: `.*/${month}/${year}$`
                }
            } : {
                status: KSInternalConfig.STATUS_PUBLIC,
                date: {
                    $regex: `.*/${month}/${year}$`
                },
                userId
            }).populate("userId").skip(KSInternalConfig.LIMIT * (page - 1)).limit(KSInternalConfig.LIMIT);
            const count = await TimeKeepingModel.countDocuments(!userId ? {
                status: KSInternalConfig.STATUS_PUBLIC,
                date: {
                    $regex: `.*/${month}/${year}$`
                }
            } : {
                status: KSInternalConfig.STATUS_PUBLIC,
                date: {
                    $regex: `.*/${month}/${year}$`
                },
                userId
            })
            return {
                data: _.sortBy(res.map(value => new TimeKeeping(value)), (item) => Number(item.date.split("/")[0])),
                count
            };
        } catch (err) {
            return 'err'
        }
    }

    deleteTimeSheets = async (body: { month: number, year: number }): Promise<any> => {
        const { month, year } = body;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const resDeleteTimeSheets = await TimeKeepingModel.deleteMany({ date: { $regex: `.*/${month}/${year}$` } }).session(session);
            await StatisticTimeSheetModel.deleteMany({ date: { $regex: `.*${month}/${year}$` } }).session(session);
            await session.commitTransaction();
            return resDeleteTimeSheets;
        } catch (err) {
            session.abortTransaction();
            return 'err'
        } finally {
            session.endSession();
        }
    }

    loadTimeSheetsForStaff = async (body: { month: number, year: number, userId: string }): Promise<any> => {
        const { month, year, userId } = body;
        try {
            const res = await TimeKeepingModel.find({
                status: KSInternalConfig.STATUS_PUBLIC,
                date: {
                    $regex: `.*/${month}/${year}$`
                },
                userId
            });
            return res;
        } catch (err) {
            return 'err'
        }
    }

    downloadTimeSheets = async (payload: { res: any, body: { month: number, year: number } }): Promise<any> => {
        const { res, body } = payload;
        const result = await TimeKeepingModel.find({
            status: KSInternalConfig.STATUS_PUBLIC,
            date: {
                $regex: `.*/${body.month}/${body.year}$`
            },
        }).populate("userId");

        const data: Array<Array<any>> = [
            ["Ngày", "ID", "Họ và Tên", "Giờ Vào", "Giờ Ra"]
        ];

        result.forEach((timeSheet: any) => {
            const dateSplit = timeSheet?.date.split("/");
            data.push([
                new Date(Number(dateSplit[2]), Number(dateSplit[1]) - 1, Number(dateSplit[0]) + 1), timeSheet?.userId?.machineId, timeSheet?.userId?.name, timeSheet?.checkin, timeSheet?.checkout
            ])
        })
        const sheetOptions = { '!cols': [{ wch: 15 }, { wch: 5 }, { wch: 20 }, { wch: 10 }, { wch: 10 }] };
        const buffer = nodeXlsx.build([{ name: "Bảng chấm công", data: data }], sheetOptions);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + `thang${body.month}.xlsx`);
        res.end(buffer, 'buffer');
        return res
    }

    loadTableTimeSheetsForStaff = async (body: { userId: string }): Promise<any> => {
        const { userId } = body;
        try {
            const response = await TimeKeepingModel.findOne({
                date: moment(new Date()).format("D/M/YYYY"),
                userId
            })
            return response;
        } catch (error) {
            return 'err'
        }
    }
}

export { TimeKeepingService }