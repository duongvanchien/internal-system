import { FormControlLabel, Radio, RadioGroup } from "@mui/material";

export interface RadioE {
    value: string | number,
    label: string
}

export const FCRadioGroup = (props: {
    radioList: RadioE[],
    value: string | number,
    row?: boolean,
    handleChange?: any
}) => {
    const { radioList, value, row, handleChange } = props;

    const handleChangeValue = (e: any) => {
        handleChange(e.target.value)
    }

    return (
        <RadioGroup row={row} name="row-radio-buttons-group" value={value} onChange={handleChangeValue}>
            {radioList.map((radio, key) => (
                <FormControlLabel key={key} value={radio.value} control={<Radio />} label={radio.label} />
            ))}
        </RadioGroup>
    )
}