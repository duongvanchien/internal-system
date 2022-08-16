import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DialogActions, TextField } from '@mui/material';
import { FCButton } from './FCButton';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const FCConfirmDelete = (props: {
    open: boolean,
    title?: string,
    handleClose?: any,
    handleConfirm?: any,
    warningText?: string
}) => {
    const { open, title, handleClose, handleConfirm, warningText } = props;
    const [valueConfirm, setValueConfirm] = React.useState('');

    const handleCloseDialog = () => {
        handleClose();
        setValueConfirm('')
    }

    const handleConfirmDelete = () => {
        if (valueConfirm.trim().toUpperCase() === "OK") {
            handleConfirm()
        }
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleCloseDialog}
            aria-describedby="alert-dialog-slide-description"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle style={{ fontWeight: "bolder" }}>Bạn có chắc chắn muốn xóa {title} ?</DialogTitle>
            <DialogContent>
                <small style={{ color: 'red' }}><i>{warningText}</i></small>
                <div>Nhập <strong>OK</strong> để xác nhận xóa</div>
                <TextField
                    error={!(valueConfirm.trim().toUpperCase() === "OK")}
                    autoFocus
                    margin="dense"
                    id="name"
                    size='small'
                    fullWidth
                    value={valueConfirm}
                    onChange={e => setValueConfirm(e.target.value)}
                    helperText={!(valueConfirm.trim().toUpperCase() === "OK") ? "Nhập OK để xóa" : ''}
                />
            </DialogContent>
            <DialogActions>
                <FCButton
                    variant='text'
                    color="error"
                    size="small"
                    text="Đóng"
                    handleAction={handleCloseDialog}
                />
                <FCButton variant='contained' color="success" size="small" text="Xác nhận" handleAction={handleConfirmDelete} />
            </DialogActions>
        </Dialog>
    );
}