import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const FCDialog = (props: {
    open: boolean,
    title?: string,
    content?: JSX.Element,
    size?: any,
    className?: string,
    style?: any,
    handleClose?: any,
    fullScreen?: boolean
}) => {
    const { open, title, content, handleClose, size, className, style, fullScreen } = props;

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
            maxWidth={size || "sm"}
            fullWidth
            className={className}
            style={style}
            fullScreen={fullScreen}
            disableEnforceFocus={true}
            disableAutoFocus={true}
        >
            <DialogTitle style={{ fontWeight: "bolder" }}>{title}</DialogTitle>
            <DialogContent>
                {content}
            </DialogContent>
        </Dialog>
    );
}