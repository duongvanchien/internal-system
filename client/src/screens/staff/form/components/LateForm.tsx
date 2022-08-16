import { yupResolver } from "@hookform/resolvers/yup";
import { useReducer } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FCButton } from "../../../../components/FCButton";
import { FCDateTime } from "../../../../components/FCDateTime";
import { FCTextField } from "../../../../components/FCTextField";
import { TYPE_ERROR } from "../../../../constant/utils";
import { formReducer, initState, setDate } from "../logic";

const LateFormSchema = yup.object().shape({
    content: yup.string().required(TYPE_ERROR.isEmpty),
    offTimeNum: yup.string().required(TYPE_ERROR.isEmpty),
});

export const LateForm = (props: {
    handleCreateForm?: any
}) => {
    const { handleCreateForm } = props;
    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(LateFormSchema),
    });
    const [uiState, uiLogic] = useReducer(formReducer, initState);

    const resetForm = () => {
        reset();
        uiLogic(setDate(new Date()));
    }

    const handleCreateOrUpdateForm = (data: any) => {
        handleCreateForm({ ...data, date: uiState.date }, resetForm())
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleCreateOrUpdateForm)}>
                <div>
                    <span style={{ fontSize: "0.8rem", color: 'gray' }}>Ngày</span>
                    <span className="text_error">*</span>
                    <FCDateTime value={uiState.date} handleChangeValue={(newValue) => uiLogic(setDate(newValue))} register={register} name="date" />
                </div>

                <div style={{ margin: "1rem 0" }}>
                    <FCTextField
                        type="number"
                        name="offTimeNum"
                        register={register}
                        size="small"
                        label={<div>Thời gian đi muộn(giờ)<span className="text_error">*</span></div>}
                        placeholder="ex: 0.5, 1"
                        inputProps={{
                            step: "0.01"
                        }}
                    />
                    {errors.offTimeNum && <p className='text_error'>{errors.offTimeNum.message}</p>}
                </div>
                <div style={{ margin: "1rem 0" }}>
                    <FCTextField
                        type="text"
                        name="content"
                        register={register}
                        size="small"
                        label={<div>Lý do xin nghỉ<span className="text_error">*</span></div>}
                        multiline
                        rows={8}
                    />
                    {errors.content && <p className='text_error'>{errors.content.message}</p>}
                </div>

                <div style={{ textAlign: 'center' }}>
                    <FCButton text="Xóa tất cả" color="inherit" size="small" variant="outlined" style={{ borderColor: '#D0D0D0', margin: '0 0.3rem' }} />
                    <FCButton type="submit" text="Gửi đơn" color="success" size="small" style={{ backgroundColor: '#1890FF', margin: '0 0.3rem' }} />
                </div>
            </form >
        </>
    )
}