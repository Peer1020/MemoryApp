import React from 'react';
import { Typography } from '@mui/material';

interface Props {
  text: string;
}

const PlayInformation = ({ text }: Props) => {
  return (
    <Typography variant="h4" align="center" mt={2}>
      {text}
    </Typography>
  );
};

export { PlayInformation };
