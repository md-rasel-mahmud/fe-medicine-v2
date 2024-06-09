import { Grid, InputAdornment, TextField } from '@mui/material';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  InputFieldsPropType,
  InputFieldsType,
} from '../../../types/components/utils/form/InputFieldsType';

const InputFields: FC<InputFieldsPropType> = ({
  formData,
  column = { xs: 12, sm: 12, md: 6, lg: 3, xl: 3 },
  control,
}) => {
  const commonInputTypes = ['text', 'email', 'number', 'textarea'];

  const visibleFormData = formData.filter(input => input.visibility);

  return (
    <>
      {visibleFormData.reduce(
        (acc: JSX.Element[], input: InputFieldsType, index: number) => {
          const itemColumn = input.column || column;

          if (commonInputTypes.includes(input.type)) {
            acc.push(
              <Grid key={index} item {...(itemColumn as object)}>
                <Controller
                  key={index}
                  name={input.id}
                  control={control as Control<any>}
                  render={({ field, fieldState }) => (
                    <TextField
                      size={input.size || 'small'}
                      key={index}
                      fullWidth
                      label={input.label}
                      disabled={input.disabled}
                      type={input.type}
                      placeholder={input.placeholder}
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      value={input.value || field.value}
                      onChange={input.onChange || field.onChange}
                      {...(input.type === 'textarea' && {
                        multiline: true,
                        rows: 4,
                      })}
                      inputProps={{
                        ...(input.type === 'number' && {
                          onWheel: e => e.currentTarget.blur(),
                        }),
                      }}
                      InputProps={{
                        startAdornment: input.startAdornment && (
                          <InputAdornment position='start'>
                            {input.startAdornmentIcon}
                          </InputAdornment>
                        ),
                        endAdornment: input.endAdornment && (
                          <InputAdornment position='end'>
                            {input.endAdornmentIcon}
                          </InputAdornment>
                        ),
                      }}
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
