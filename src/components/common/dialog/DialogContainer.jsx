import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function DialogContainer({
  children,
  title,
  maxWidth = "sm",
  dialogModalOpen,
   handleDialogCloseButtom = () => { },
  handleDialogSubmitButtom = () => { },
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        fullScreen={fullScreen}
        maxWidth={maxWidth}
        fullWidth
        onClose={handleDialogCloseButtom}
        aria-labelledby="customized-dialog-title"
        open={dialogModalOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {title}
        </DialogTitle>
        <Tooltip title={'close'}>
        <IconButton
          aria-label="close"
          onClick={handleDialogCloseButtom}
          color='error'
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            // color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
          </IconButton>
        </Tooltip>
        <DialogContent dividers >
          {children}
        </DialogContent>
        <DialogActions>
          <Button
        variant="outlined"
        color="error"
            endIcon={<CloseIcon />}
        onClick={handleDialogCloseButtom}
        >
        Cancle
      </Button>
       <Button
        variant="outlined"
        color="success"
        endIcon={<SendIcon />}
        onClick={handleDialogSubmitButtom}
       >
        Submit
          </Button> 
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
