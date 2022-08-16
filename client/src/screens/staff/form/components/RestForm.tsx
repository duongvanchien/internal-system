import { yupResolver } from "@hookform/resolvers/yup";
import { useReducer } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FCButton } from "../../../../components/FCButton";
import { FCDateTime } from "../../../../components/FCDateTime";
import { FCTextField } from "../../../../components/FCTextField";
import { TYPE_ERROR } from "../../../../constant/utils";
import { formReducer, initState, setEndDate, setStartDate } from "../logic";

const RestFormSchema = yup.object().shape({
    content: yup.string().required(TYPE_ERROR.isEmpty),
    offDayNum: yup.string().required(TYPE_ERROR.isEmpty),
});

export const RestForm = (props: {
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
        resolver: yupResolver(RestFormSchema),
    });
    const [uiState, uiLogic] = useReducer(formReducer, initState);

    const resetForm = () => {
        reset();
        uiLogic(setStartDate(new Date()));
        uiLogic(setEndDate(new Date()));
    }

    const handleCreateOrUpdateForm = (data: any) => {
        handleCreateForm({ ...data, startDate: uiState.startDate, endDate: uiState.endDate }, resetForm())
    }

    return (
        <>
            <form onSubmit={handleSubmit(handleCreateOrUpdateForm)}>
                <div style={{ margin: "0.7rem 0", display: 'flex' }}>
                    <div style={{ width: '100%', marginRight: '0.5rem' }}>
                        <span style={{ fontSize: "0.8rem", color: 'gray' }}>Từ ngày</span>
                        <span className="text_error">*</span>
                        <FCDateTime value={uiState.startDate} handleChangeValue={(newValue) => uiLogic(setStartDate(newValue))} register={register} name="startDate" />
                    </div>
                    <div style={{ width: '100%' }}>
                        <span style={{ fontSize: "0.8rem", color: 'gray' }}>Đến ngày</span>
                        <span className="text_error">*</span>
                        <FCDateTime value={uiState.endDate} handleChangeValue={(newValue) => uiLogic(setEndDate(newValue))} register={register} name="endDate" />
                    </div>
                </div>

                <div style={{ margin: "1rem 0" }}>
                    <FCTextField
                        type="number"
                        name="offDayNum"
                        register={register}
                        size="small"
                        label={<div>Số ngày nghỉ<span className="text_error">*</span></div>}
                        placeholder="ex: 0.5, 1"
                        inputProps={{
                            step: "0.01"
                        }}
                    />
                    {errors.offDayNum && <p className='text_error'>{errors.offDayNum.message}</p>}
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