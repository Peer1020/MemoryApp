import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchNewGamesAsync,
  NewGame,
  selectNewGames,
  selectNickName,
  setNewGames,
} from '../../../store/initialize-game';
import { fetchJoinGame } from '../../../store/play-game';
import { useNavigate } from 'react-router-dom';
import { connectToNewGameSocket } from '../../../utils/backend.utils';

const PlayJoinNewGame = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const newGames = useAppSelector(selectNewGames);
  const nickName = useAppSelector(selectNickName);
  const theme = useTheme();

  const selectNewGame = (newGame: NewGame) => {
    if (nickName && newGame.gameId) {
      dispatch(fetchJoinGame({ player: nickName, gameId: newGame.gameId }));
      navigate('play');
    }
  };

  const setNewGamesFromTopic = (newGames: NewGame[]) => {
    dispatch(setNewGames(newGames));
  };

  useEffect(() => {
    connectToNewGameSocket(setNewGamesFromTopic);
    dispatch(fetchNewGamesAsync());
  }, []);

  return (
    <Box
      sx={{
        height: `calc(100vh - 110px - 145px)`,
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'flex-start',
        flexWrap: 'wrap',
        overflowY: 'auto',
      }}>
      {newGames.map((newGame) => (
        <Card
          key={newGame.gameId}
          sx={{
            mb: 2,
            mr: 2,
            bgcolor: theme.palette.primary.light,
            width: 160,
            maxHeight: 'fit-content',
          }}
          data-testid="select-new-game-card">
          <CardActionArea
            data-testid="select-new-game-card-button"
            onClick={() => selectNewGame(newGame)}
            disabled={!Boolean(nickName)}>
            <CardContent>
              <Typography variant="body2">
                <b>{newGame.nickName}</b> want's to play{' '}
                <b>{newGame.cardsetName}</b>
              </Typography>
              <Typography variant="caption">{newGame.languages}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

export { PlayJoinNewGame };
