import moment from "moment";
import { getApi } from "../clickup/fetchapi";
class ClickUpService {
    loadSpaces = async (): Promise<any> => {
        const res = await getApi({ url: "https://api.clickup.com/api/v1/team/25534334/space" });
        return res;
    }

    loadTasks = async (body: { statuses: string[], spaceId: string ,  }): Promise<any> => {
        const { statuses, spaceId } = body
        const list_task = await getApi({ url: "https://api.clickup.com/api/v2/team/25534334/task", params: { statuses, subtasks: true, space_ids: [spaceId], order_by:'due_date'} });
        return list_task;
    }

    loadTasksByUser = async (body: { statuses: any, clickupId: string }): Promise<any> => {
        const { statuses, clickupId } = body
        const list_task = await getApi({ url: "https://api.clickup.com/api/v2/team/25534334/task", params: { subtasks: true, order_by: 'due_date', reverse: true, assignees: [clickupId], statuses } });
        return list_task;
    }
}

export { ClickUpService }