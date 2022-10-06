import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Record } from '../routes/record/record.component';
import { Play } from '../routes/play/play.component';
import { Box, createTheme, ThemeOptions, ThemeProvider } from '@mui/material';
import Navigation from '../routes/navigation/navigation.component';
import { Home } from '../routes/home/home.component';

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#6e2dec',
      light: '#e9ddff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#18D2F0',
      light: '#18D2F0',
      contrastText: '#ffffff',
    },
    text: {
      disabled: '#49454e',
      primary: '#22005c',
      secondary: '#340042',
    },
    background: {
      default: '#fffbff',
      paper: '#f8f8f9',
    },
    error: {
      main: '#ED3A39',
      light: '#ED3A39',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ED9045',
      light: '#ED9045',
      contrastText: '#ffffff',
    },
    success: {
      main: '#3AF070',
      light: '#3AF070',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
  components: {
    MuiPaper: {
      defaultProps: {
        sx: {
          px: 2,
          py: 1,
        },
        elevation: 3,
      },
    },
  },
};

const theme = createTheme(themeOptions);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 900, minWidth: 350 }}>
        <Routes>
          <Route path="/" element={<Navigation />}>
            <Route index element={<Home />} />
            <Route path="record-cards" element={<Record />} />
            <Route path="play" element={<Play />} />
          </Route>
        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export { App };
