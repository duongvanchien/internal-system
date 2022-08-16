import { Button } from "@mui/material"

export const FCButton = (props: {
    variant?: 'contained' | 'outlined' | 'text',
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
    text?: string,
    type?: any,
    startIcon?: JSX.Element,
    endIcon?: JSX.Element,
    className?: string,
    style?: any,
    size?: 'small' | 'medium' | 'large'
    handleAction?: () => void
}) => {
    const { variant, color, text, type, className, startIcon, endIcon, handleAction, size, style } = props;
    return (
        <Button
            variant={variant || "contained"}
            color={color || "primary"}
            type={type}
            className={className}
            startIcon={startIcon}
            endIcon={endIcon}
            onClick={handleAction}
            size={size || "medium"}
            style={{ ...style, textTransform: 'none' }}
        >
            {text}
        </Button>
    )
}