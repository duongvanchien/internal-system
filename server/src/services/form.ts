import { Form } from "../../../models/form";
import { FormModel } from "../database/mongo/form";
import { sendNotiConfirmForm, sendNotiPrivateRoom } from "../sockets";

class FormService {
    saveNewForm = async (body: { form: Form }): Promise<Form> => {
        const res = await (await new FormModel(body.form).save()).populate("userId");
        sendNotiPrivateRoom({ form: new Form(res) })
        return new Form(res);
    }

    loadForms = async (body: { userId?: string }): Promise<Form[]> => {
        const { userId } = body;
        if (userId) {
            const res = await FormModel.find({
                userId
            }).populate("userId").populate("approverId");
            return await res.map(form => new Form(form));
        } else {
            const res = await FormModel.find().populate("userId").populate("approverId");
            return await res.map(form => new Form(form));
        }
    }

    updateForm = async (body: { form: Form }): Promise<Form> => {
        const formUpdate = await FormModel.findOneAndUpdate({ _id: body.form['_id'] }, { $set: { ...body.form } }, { new: true }).populate("userId").populate("approverId");
        sendNotiConfirmForm({ form: new Form(formUpdate) })
        return new Form(formUpdate);
    }

    deleteForm = async (body: { _id: string }): Promise<string> => {
        const formDeleted = await FormModel.deleteOne({ _id: body._id });
        return body._id;
    }
}

export { FormService }