import { MenuItem, Select, TextField } from "@mui/material"

export interface Option {
    value: any,
    label: string
}

export const FCSelect = (props: {
    inputRef?: any,
    type?: string,
    placeholder?: string,
    name?: string,
    register?: any,
    defaultValue?: any,
    disabled?: boolean,
    isError?: boolean,
    size?: string,
    startAdornment?: JSX.Element,
    endAdornment?: JSX.Element,
    variant?: string,
    label?: string,
    className?: string,
    options?: Option[],
    handleChange?: any
}) => {
    const { inputRef, placeholder, name, register, defaultValue, disabled, isError, className, options, handleChange } =
        props;

    const onChangeValue = (e: any) => {
        handleChange(e.target.value)
    }

    return (
        <select
            {...register && register(name)}
            defaultValue={defaultValue}
            placeholder={placeholder}
            disabled={disabled}
            isError={isError}
            inputRef={inputRef}
            className={`cus_select ${className}`}
            onChange={onChangeValue}
        >
            {options?.map((option, key) => (
                <option
                    key={key}
                    value={option.value}
                >
                    {option.label}
                </option>
            ))}
        </select >
    )
}