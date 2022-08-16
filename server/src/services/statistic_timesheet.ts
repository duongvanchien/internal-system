import { StatisticTimeSheet } from "../../../models/statistic_timesheet";
import { StatisticTimeSheetModel } from "../database/mongo/statistic_timesheet";

export class StatisticTimesheetsService {
    rankingStaff = async (body: { month: string, year: string }): Promise<StatisticTimeSheet[]> => {
        const { month, year } = body;
        const res = await StatisticTimeSheetModel.find({
            date: {
                $regex: `.*${month}/${year}$`
            },
        }).sort({ "score": -1 }).populate({
            path: "userId",
            populate: {
                path: "departmentId"
            }
        });
        return res.map(value => new StatisticTimeSheet(value));
        // const res = await StatisticTimeSheetModel
        //     .aggregate()
        //     .match({
        //         date: {
        //             $regex: `.*${month}/${year}$`
        //         },
        //     })
        //     .lookup({ from: 'users', as: "userInfo", let: { userId: '$userId' }, pipeline: [{ $match: { $expr: { $eq: ["$_id", "$$userId"] } } }] })
        //     .project({
        //         "userInfo.name": 1
        //     })
        // return res;
    }

    loadRankingByStaff = async (body: { month: string, year: string, userId: string }): Promise<StatisticTimeSheet> => {
        const { month, year, userId } = body;
        const res = await StatisticTimeSheetModel.findOne({
            date: {
                $regex: `.*${month}/${year}$`
            },
            userId
        });
        return new StatisticTimeSheet(res);
    }
}