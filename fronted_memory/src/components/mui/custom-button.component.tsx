import React from 'react';
import { Button } from '@mui/material';

// todo: do not use any type
interface CustomButtonProps {
  clickHandler: any;
  buttonText: string;
  secondary?: boolean;
  disabled?: boolean;
  dataTestId?: string;
}

const CustomButton = ({
  clickHandler,
  buttonText,
  secondary,
  disabled,
  dataTestId,
}: CustomButtonProps) => {
  return (
    <Button
      variant={secondary ? 'outlined' : 'contained'}
      disableElevation
      onClick={clickHandler}
      disabled={disabled}
      data-testid={dataTestId}>
      {buttonText}
    </Button>
  );
};

export { CustomButton };
