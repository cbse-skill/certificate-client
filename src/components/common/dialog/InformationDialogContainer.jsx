import CloseIcon from '@mui/icons-material/Close';
import { DialogContentText, Tooltip } from '@mui/material';
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

export default function InformationDialogContainer({
  children,
  title,
  maxWidth = "sm",
  dialogModalOpen,
  information,
   handleDialogCloseButtom = () => { },
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));  

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
        <DialogContent dividers>
          <DialogContentText>
            {information}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
}
