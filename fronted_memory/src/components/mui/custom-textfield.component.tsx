import React, { ChangeEvent } from 'react';
import { TextField } from '@mui/material';

interface CustomTextfieldProps {
  id: string;
  name: string;
  label: string;
  changeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  disabled?: boolean;
  dataTestId?: string;
}

const CustomTextfield = ({
  id,
  name,
  label,
  changeHandler,
  value,
  disabled,
  dataTestId,
}: CustomTextfieldProps) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      margin="dense"
      sx={{ maxWidth: 500 }}
      id={id}
      name={name}
      value={value}
      label={label}
      data-testid={dataTestId}
      onChange={changeHandler}
      disabled={disabled}
    />
  );
};

export { CustomTextfield };
