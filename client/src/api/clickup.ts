import EndPoint from "../../../common/endpoints"
import { ApiConfig } from "./config"

export const apiLoadSpace = async (payload : {}) =>{
    return ApiConfig(EndPoint.LOAD_SPACES , payload)
}
export const apiLoadTask = async (payload:{statuses :any , spaceId:string}) =>{
    return ApiConfig(EndPoint.LOAD_TASKS , payload)
} 