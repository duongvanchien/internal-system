import { Department } from "../../../models/department";
import { UserInfo } from "../../../models/user";
import { DepartmentModel } from "../database/mongo/departments";
import { UserDepartmentModel } from "../database/mongo/user_department";
export default class DepartmentService {
    loadStaffInDepartment = async (body: { departmentId: string; }): Promise<UserInfo[]> => {
        const recoredDb = await UserDepartmentModel.aggregate()
            .match({
                departmentId: body.departmentId
            })
            .lookup({
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
            }).unwind("user")
            .project({
                "user._id": 1,
                "user.name": 1
            });
        return recoredDb;

    }
    saveNewDepartment = async (body: { departmentInfo: Department }): Promise<Department> => {
        const recoredDb = new DepartmentModel(body.departmentInfo);
        await recoredDb.save();
        return new Department(recoredDb);
    }

    loadDepartments = async (body: { status: number[] }): Promise<Department[]> => {
        const departments = await DepartmentModel.find({
            status: { $in: body.status }
        })

        return departments.map(department => new Department(department));
    }

    updateDepartment = async (body: { departmentInfo: Object; }): Promise<Department | null> => {
        const recoredDb = await DepartmentModel.findOneAndUpdate({ _id: body.departmentInfo['_id'] }, { $set: { ...body.departmentInfo } }, { new: true });
        if (recoredDb) {
            return new Department(recoredDb);
        } else {
            return null;
        }
    }
}