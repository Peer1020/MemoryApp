import React from 'react';
import { PlayInitialize } from '../../components/views/initialize/initialize-game-form.component';
import { PlayJoinNewGame } from '../../components/views/initialize/join-new-game.component';
import { Paper, useTheme } from '@mui/material';

export const Home = () => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        ...theme?.components?.MuiPaper?.defaultProps?.sx,
        height: `calc(100vh - 110px)`,
      }}>
      <PlayInitialize />
      <PlayJoinNewGame />
    </Paper>
  );
};
