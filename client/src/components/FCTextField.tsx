import { InputAdornment, TextField } from "@mui/material";

export const FCTextField = (props: {
    inputRef?: any,
    type?: string,
    placeholder?: string,
    name?: string,
    register?: any,
    multiline?: boolean,
    rows?: number,
    defaultValue?: string,
    disabled?: boolean,
    isError?: boolean,
    size?: string,
    startAdornment?: JSX.Element,
    endAdornment?: JSX.Element,
    variant?: string,
    label?: any,
    className?: string,
    inputProps?: any,
}) => {
    const { inputRef, type, placeholder, name, register, multiline, rows, defaultValue, disabled, isError, size, startAdornment, endAdornment, variant, label, className, inputProps } =
        props;
    return (
        <>
            <TextField
                type={type}
                error={isError}
                id='outlined-error-helper-text'
                className={className}
                variant={variant || "outlined"}
                size={size || "small"}
                style={{ width: "100%" }}
                inputRef={inputRef}
                placeholder={placeholder}
                {...register && register(name)}
                multiline={multiline}
                rows={rows}
                defaultValue={defaultValue}
                disabled={disabled}
                label={label}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            {startAdornment}
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="start">
                            {endAdornment}
                        </InputAdornment>
                    ),
                }}
                inputProps={inputProps}
            />
        </>
    );
};
