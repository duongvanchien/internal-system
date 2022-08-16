import { IconButton } from "@mui/material";
import { styled } from '@mui/material/styles';

const CustomIconButton = styled(IconButton)(({ theme }) => ({
    color: "#5e35b1",
    backgroundColor: "#ede7f6",
    borderRadius: "14px",
    "&:hover": {
        backgroundColor: "#673ab7",
        color: "#fff"
    }
}));

export const FCIconButton = (props: {
    handleAction?: any,
    icon?: JSX.Element,
    className?: string,
    style?: any
}) => {
    const { handleAction, icon, className, style } = props
    return (
        <CustomIconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleAction}
            edge="start"
            className={className}
            style={style}
        >
            {icon}
        </CustomIconButton>
    )
}