import { Grid, TextField } from '@mui/material';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  InputFieldsPropType,
  InputFieldsType,
} from '../../../types/components/utils/form/InputFieldsType';

const InputFields: FC<InputFieldsPropType> = ({
  formData,
  column = { xs: 12, sm: 12, md: 6, lg: 4, xl: 3 },
  control,
}) => {
  const commonInputTypes = ['text', 'email', 'number', 'textarea'];

  const visibleFormData = formData.filter(input => input.visibility);

  return (
    <>
      {visibleFormData.reduce(
        (acc: JSX.Element[], input: InputFieldsType, index: number) => {
          const itemColumn = input.column || column;

          console.log('...itemColumn', itemColumn);
          if (commonInputTypes.includes(input.type)) {
            acc.push(
              <Grid key={index} item {...(itemColumn as object)}>
                <Controller
                  key={index}
                  name={input.id}
                  control={control as Control<any>}
                  render={({ field }) => (
                    <TextField
                      key={index}
                      label={input.label}
                      required={input.required}
                      disabled={input.disabled}
                      type={input.type}
                      placeholder={input.placeholder}
                      value={input.value || field.value}
                      onChange={input.onChange || field.onChange}
                    />
                  )}
                />
              </Grid>
            );
          }

          return acc;
        },
        [] as JSX.Element[]
      )}
    </>
  );
};

export default InputFields;
