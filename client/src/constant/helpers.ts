
import CryptoJS from "crypto-js";
const secret_key = 'TbEQb0TDG9D64Xt544xLFofSBmxtJ7l6';

export const encodePassword = (userName: string, password: string): string => {
    let passEncrypted = CryptoJS.AES.encrypt(
        userName + "_" + password,
        secret_key
    ).toString();
    return passEncrypted;
};

export function encodeSHA256Pass(userName: string, password: string) {
    try {
        const encode = CryptoJS.SHA256(`${password}_${userName}_${password}`).toString();
        return encode;
    } catch (error) {
        console.log('error ', error);
        return null;
    }
}
