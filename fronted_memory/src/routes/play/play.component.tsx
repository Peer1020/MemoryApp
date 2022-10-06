import React, { useEffect, useRef, useState } from 'react';
import { Paper, useTheme } from '@mui/material';
import { PlayInformation } from '../../components/views/play/play-information.component';
import { PlayBoard } from '../../components/views/play/play-board.component';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  PlayGameState,
  selectGameId,
  selectGameState,
  selectWinner,
  setFromTopic,
} from '../../store/play-game';
import { Client as StompClient } from '@stomp/stompjs/esm6/client';
import {
  connectToPlayGameSocket,
  postStopGame,
} from '../../utils/backend.utils';

const Play = () => {
  const dispatch = useAppDispatch();
  const gameId = useAppSelector(selectGameId);
  const gameState = useAppSelector(selectGameState);
  const winner = useAppSelector(selectWinner);
  const [stompClient, setStompClient] = useState({} as StompClient);
  const theme = useTheme();
  const gameIdRef = useRef(gameId);
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameIdRef.current = gameId;
  }, [gameId]);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const deactivateStompClient: () => void = () => {
    console.log('deactivate stomp-client');
    stompClient?.deactivate && stompClient.deactivate();
    setStompClient({} as StompClient);
  };

  const callbackAfterChanges = (gameStateNew: PlayGameState) => {
    const hasTmpSwitchedNew = gameStateNew.cards
      .map((card) => card.temporarilySwitched)
      .reduce((prev, curr) => prev || curr, false);
    const delay = hasTmpSwitchedNew ? 0 : 2000;
    setTimeout(() => {
      dispatch(setFromTopic(gameStateNew));
    }, delay);
  };

  useEffect(() => {
    // Is executed on "will unmount" component
    return () => {
      if (
        gameStateRef.current !== 'STOPPED' &&
        gameStateRef.current !== 'FINISHED'
      ) {
        (async () => {
          await postStopGame(gameIdRef.current);
        })();
      }
      deactivateStompClient();
    };
  }, []);

  useEffect(() => {
    if (gameState === 'FINISHED' || gameState === 'STOPPED') {
      deactivateStompClient();
    }
  }, [gameState]);

  useEffect(() => {
    if (gameId) {
      const newStompClient = connectToPlayGameSocket(
        gameId,
        callbackAfterChanges
      );
      setStompClient(newStompClient);
    }
  }, [gameId]);

  return (
    <Paper
      sx={{
        ...theme?.components?.MuiPaper?.defaultProps?.sx,
        height: `calc(100vh - 110px)`,
      }}>
      {gameState === 'NEW' ? (
        <PlayInformation text="Wait until second player has arrived" />
      ) : gameState === 'IN_PROGRESS' ? (
        <PlayBoard />
      ) : gameState === 'STOPPED' ? (
        <PlayInformation text="Game is stopped" />
      ) : (
        <PlayInformation
          text={
            winner
              ? `Game is finished, winner is ${winner.name}`
              : 'Game is finished in a tie'
          }
        />
      )}
    </Paper>
  );
};

export { Play };
