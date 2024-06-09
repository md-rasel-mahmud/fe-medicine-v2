import { SaveOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { ModalFormPropType } from '../../../types/components/utils/modal/ModalFormPropType';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const ModalForm: React.FC<ModalFormPropType> = ({
  handleModalClose,
  open,
  title,
  children,
  actionIcon,
  actionText,
  isLoading,
  subActionIcon,
  subActionText,
  subActionHandler,
  subActionType,
  formSubmit,
}) => {
  return (
    <React.Fragment>
      <BootstrapDialog
        onSubmit={formSubmit}
        component='form'
        onClose={handleModalClose}
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          {title}
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleModalClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <Button
            startIcon={subActionIcon}
            onClick={subActionHandler}
            type={subActionType || 'reset'}
            variant='outlined'
            color='secondary'
          >
            {subActionText || 'Reset'}
          </Button>
          <LoadingButton
            endIcon={actionIcon || <SaveOutlined />}
            autoFocus
            type='submit'
            loading={isLoading}
            variant='contained'
          >
            {actionText || 'Save'}
          </LoadingButton>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default ModalForm;
