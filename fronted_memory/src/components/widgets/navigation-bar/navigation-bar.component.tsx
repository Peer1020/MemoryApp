import React from 'react';
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Toolbar,
  useTheme,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import {
  selectActivePlayer,
  selectGameState,
  selectIam,
  selectOtherPlayer,
} from '../../../store/play-game';
import { selectNickName } from '../../../store/initialize-game';

const NavigationBar = () => {
  const navigate = useNavigate();
  const nickName = useAppSelector(selectNickName);
  const iAm = useAppSelector(selectIam);
  const otherPlayer = useAppSelector(selectOtherPlayer);
  const activePlayer = useAppSelector(selectActivePlayer);
  const gameState = useAppSelector(selectGameState);
  const theme = useTheme();
  const location = useLocation();

  const navigateTo = (reference: string): void => {
    navigate(reference);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar disableGutters>
        <IconButton
          sx={{ color: 'white', mr: 2 }}
          onClick={() => navigateTo('/')}
          data-testid="menu-item">
          <HomeIcon
            sx={{
              color:
                location.pathname !== '/record-cards'
                  ? 'secondary.main'
                  : 'primary.contrastText',
            }}
          />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: { xs: 'flex' } }}>
          <Button
            sx={{
              mr: 2,
              display: 'block',
              fontSize: 16,
              color:
                location.pathname === '/record-cards'
                  ? 'secondary.main'
                  : 'primary.contrastText',
            }}
            onClick={() => navigateTo('record-cards')}
            data-testid="menu-item">
            Record Cards
          </Button>
        </Box>
        {nickName && (
          <Chip
            sx={{
              color: 'primary.main',
              bgcolor:
                gameState === 'IN_PROGRESS' && activePlayer.tag === iAm.tag
                  ? 'secondary.main'
                  : 'primary.light',
              typography: 'h4',
              maxWidth: 1 / 4,
            }}
            label={nickName}
          />
        )}
        {otherPlayer.name && gameState === 'IN_PROGRESS' && (
          <Chip
            sx={{
              color:
                gameState === 'IN_PROGRESS' && activePlayer.tag === iAm.tag
                  ? theme.palette.primary.contrastText
                  : 'secondary.main',
              typography: 'body2',
              maxWidth: 1 / 6,
            }}
            variant="outlined"
            label={otherPlayer.name}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export { NavigationBar };
