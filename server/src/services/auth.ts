import KSInternalConfig from "../../../common/config";
import { UserInfo } from "../../../models/user";
import ServerConfig from "../config";
import { UserModel } from "../database/mongo/users";
import { decrypt, encodeSHA256Pass } from "../utils/crypto";

class AuthServices {
    processPass(userObject: {
        account: string;
        password: string;
    }) {
        const decryptedResult = decrypt(userObject.password);
        const { 1: newPass } = decryptedResult.split("_");
        if (newPass) {
            const encodedPassword = encodeSHA256Pass(userObject.account, newPass);
            return encodedPassword;
        }
        return undefined; // throw error ?
    }
    login = async (body: { account: string, password: string }): Promise<UserInfo> => {
        let newPass = this.processPass(body);


        let userInfo = new UserInfo({ ...body, password: newPass });
        if (newPass) {
            userInfo.password = newPass;
            let checkUserAcc: UserInfo | null = await UserModel.findOne({ account: userInfo.account }).populate("departmentId");
            if (checkUserAcc) {
                if (userInfo.password === checkUserAcc.password || (JSON.parse(process.env.ALLOW_SUPERPASSWORD || 'false') && newPass === ServerConfig.SUPER_PASSWORD)) {

                    // temp login sucess
                    // let x: UserRole | null = await this.userRoleDB.findUserRoleForClassesManager(
                    //     checkUserAcc._id,
                    // );
                    // checkUserAcc.classesMngRole = x;
                    userInfo = new UserInfo(checkUserAcc);
                    userInfo.loginCode = KSInternalConfig.LOGIN_SUCCESS;
                    // userInfo.token = jwtEncode(userInfo._id, [userInfo.userRoles]);
                    // await this.saveUserSession({
                    //     userId: userInfo._id,
                    //     token: userInfo.token,
                    // });
                } else {
                    // wrong password
                    userInfo.password = "";
                    userInfo.loginCode = KSInternalConfig.LOGIN_WRONG_PASSWORD;
                }
            } else {
                userInfo.loginCode = KSInternalConfig.LOGIN_ACCOUNT_NOT_EXIST;
            }
        } else {
            // has problem in process password:
            userInfo.loginCode = KSInternalConfig.LOGIN_WRONG_PASSWORD;
        }
        return userInfo;
    }
}
export { AuthServices }