import { SaveOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Stack,
} from '@mui/material';
import { FC } from 'react';
import { FormComponentProps } from '../../../types/components/utils/form/FormComponentPropType';
import ModalForm from '../modal/ModalForm';
import InputFields from './InputFields';

const FormComponent: FC<FormComponentProps> = ({
  formType = 'PAGE',
  formData,
  column = { xs: 12, sm: 12, md: 6, lg: 3, xl: 3 },
  control,
  subActionIcon,
  subActionHandler,
  subActionType,
  subActionText,
  actionIcon,
  isLoading,
  actionText,
  title,
  ...rest
}) => {
  if (formType === 'MODAL') {
    return (
      <ModalForm
        {...{
          ...rest,
          title,
          subActionIcon,
          subActionHandler,
          subActionType,
          subActionText,
          actionIcon,
          isLoading,
          actionText,
        }}
      >
        <Grid container spacing={2}>
          <InputFields {...{ formData, column, control }} />
        </Grid>
      </ModalForm>
    );
  } else {
    return (
      <Card>
        <CardHeader title={title}></CardHeader>
        <CardContent>
          <Grid container spacing={2}>
            <InputFields {...{ formData, column, control }} />
            <Grid item xs={10}></Grid>
            <Grid item xs={2}>
              <Stack direction='row' alignItems='end' spacing={2}>
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
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
};

export default FormComponent;
