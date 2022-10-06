import React from 'react';
import { Paper, useTheme } from '@mui/material';
import { RecordCardsDisplay } from '../../components/views/record-cards/record-cards-display.component';
import { RecordCardsForm } from '../../components/views/record-cards/record-cards-form.component';

const Record = () => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        ...theme?.components?.MuiPaper?.defaultProps?.sx,
        height: `calc(100vh - 110px)`,
        display: 'flex',
        [theme.breakpoints.down('sm')]: { flexDirection: 'column' },
      }}
      data-testid="record-container">
      <RecordCardsForm />
      <RecordCardsDisplay />
    </Paper>
  );
};

export { Record };
