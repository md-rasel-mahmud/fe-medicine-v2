import { Divider, Typography } from '@mui/material';
import * as yup from 'yup';
import useFormHook from '../../../hooks/useFormHook';
import useModal from '../../../hooks/useModal';
import { InputFieldsType } from '../../../types/components/utils/form/InputFieldsType';
import FormComponent from './FormComponent';

const RenderedForm = () => {
  const DEFAULT_VALUES = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email().required('Email is required'),
    phone: yup.number().required('Phone is required'),
    message: yup.string().required('Message is required'),
  });

  const { handleModalClose, handleModalOpen, open } = useModal();

  const { control, handleSubmit, reset } = useFormHook({
    defaultValuesProp: DEFAULT_VALUES,
    validationSchema,
  });

  console.log('hello');

  const formData: InputFieldsType[] = [
    {
      id: 'name',
      type: 'text',
      label: 'Name',
      name: 'name',
      placeholder: 'Enter your name',
      required: true,
      visibility: true,
    },
    {
      id: 'email',
      type: 'email',
      name: 'email',
      label: 'Email',
      required: true,
      visibility: true,
      column: { lg: 6 },
    },
    {
      id: 'phone',
      type: 'number',
      label: 'Phone',
      name: 'phone',
      required: true,
      visibility: true,
    },
    {
      id: 'message',
      type: 'textarea',
      name: 'message',
      label: 'Message',
      required: true,
      visibility: true,
      column: { lg: 12 },
    },
  ];

  const formSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <Typography variant='h4'>Form Page</Typography>
      <FormComponent
        {...{
          open,
          handleModalClose,
          formData,
          control,
          formType: 'PAGE',
          title: 'Form Component Modal',
          formSubmit: handleSubmit(formSubmit),
          isLoading: false,
          subActionHandler: reset,
        }}
      />
      <Divider sx={{ py: 2 }} />

      {/* <Typography variant='h4'>Modal Form</Typography>
      <Button onClick={handleModalOpen} variant='contained'>
        Open Modal form
      </Button>
      <FormComponent
        {...{
          open,
          handleModalClose,
          formData,
          control,
          formType: 'MODAL',
          title: 'Form Component Modal',
          formSubmit: handleSubmit(formSubmit),
          isLoading: false,
          subActionHandler: reset,
        }}
      /> */}
    </>
  );
};

export default RenderedForm;
