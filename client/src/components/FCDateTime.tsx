import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { TextField } from '@mui/material';

export const FCDateTime = (props: {
    value?: Date | null,
    name?: string,
    register?: any,
    isError?: boolean,
    handleChangeValue: (newValue: Date | null) => void
}) => {
    const { value, name, register, isError, handleChangeValue } = props;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                inputFormat="dd/MM/yyyy"
                value={value}
                onChange={handleChangeValue}
                renderInput={
                    (params) =>
                        <TextField
                            {...params}
                            {...register && register(name)}
                            error={isError}
                            size="small"
                            style={{ width: "100%" }}
                        />
                }
            />
        </LocalizationProvider>
    )
}