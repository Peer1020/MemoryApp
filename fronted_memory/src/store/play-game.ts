import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  JoinGameDto,
  joinGameToBackend,
  startGameToBackend,
} from '../utils/backend.utils';
import { RootState } from './store';
import { createSelector } from 'reselect';

export interface PlayerFe {
  tag: string;
  name: string;
  pairs: number;
}

export interface CardFe {
  cardId: string;
  connectId: string;
  switched: boolean;
  temporarilySwitched: boolean;
  word?: string;
}

export interface PlayGameState {
  activePlayer: PlayerFe;
  gameId: string;
  gameState: string;
  cards: CardFe[];
  player1: PlayerFe;
  player2: PlayerFe;
  iAmPlayer: PlayerFe;
  loadingState: string;
}

export interface StartGame {
  name: string;
  cardsetId: string;
}

const initialState: PlayGameState = {
  activePlayer: {} as PlayerFe,
  gameId: '',
  gameState: '',
  cards: [] as CardFe[],
  player1: {} as PlayerFe,
  player2: {} as PlayerFe,
  iAmPlayer: {} as PlayerFe,
  loadingState: 'idle',
};

export const fetchStartGame = createAsyncThunk(
  'game/fetchStartGame',
  async ({ name, cardsetId }: StartGame) => {
    return await startGameToBackend(name, cardsetId);
  }
);

export const fetchJoinGame = createAsyncThunk(
  'game/fetchJoinGame',
  async (joinGameDto: JoinGameDto) => {
    return await joinGameToBackend(joinGameDto);
  }
);

export const playGameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setFromTopic: (state, action: PayloadAction<PlayGameState>) => {
      state.activePlayer = action.payload.activePlayer;
      state.player1 = action.payload.player1;
      state.player2 = action.payload.player2;
      state.gameState = action.payload.gameState;
      state.cards = action.payload.cards;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStartGame.pending, (state) => {
        state.loadingState = 'loading';
      })
      .addCase(
        fetchStartGame.fulfilled,
        (state, action: PayloadAction<PlayGameState>) => {
          state.activePlayer = action.payload.activePlayer;
          state.gameId = action.payload.gameId;
          state.gameState = action.payload.gameState;
          state.cards = action.payload.cards;
          state.player1 = action.payload.player1;
          state.player2 = action.payload.player2;
          state.iAmPlayer = action.payload.player1;
          state.loadingState = 'idle';
        }
      )
      .addCase(fetchJoinGame.pending, (state) => {
        state.loadingState = 'loading';
      })
      .addCase(
        fetchJoinGame.fulfilled,
        (state, action: PayloadAction<PlayGameState>) => {
          state.activePlayer = action.payload.activePlayer;
          state.gameId = action.payload.gameId;
          state.gameState = action.payload.gameState;
          state.cards = action.payload.cards;
          state.player1 = action.payload.player1;
          state.player2 = action.payload.player2;
          state.iAmPlayer = action.payload.player2;
          state.loadingState = 'idle';
        }
      );
  },
});

export const { setFromTopic } = playGameSlice.actions;

export const selectPlayGameState = (state: RootState): PlayGameState =>
  state.playGame;

export const selectIam = createSelector(
  [selectPlayGameState],
  (game): PlayerFe => {
    return game.iAmPlayer;
  }
);

export const selectActivePlayer = createSelector(
  [selectPlayGameState],
  (game): PlayerFe => {
    return game.activePlayer;
  }
);
export const selectGameId = createSelector(
  [selectPlayGameState],
  (game): string => {
    return game.gameId;
  }
);
export const selectCards = createSelector(
  [selectPlayGameState],
  (game): CardFe[] => {
    return game.cards;
  }
);
export const selectGameState = createSelector(
  [selectPlayGameState],
  (game): string => {
    return game.gameState;
  }
);
const selectPlayers = createSelector([selectPlayGameState], (game) => ({
  player1: game.player1,
  player2: game.player2,
  iamPlayer: game.iAmPlayer,
}));
export const selectOtherPlayer = createSelector(
  [selectPlayers],
  ({ player1, player2, iamPlayer }) =>
    iamPlayer.tag === player1.tag ? player2 : player1
);

export const selectWinner = createSelector([selectPlayGameState], (game) => {
  if (game.player1.pairs > game.player2.pairs) {
    return game.player1;
  } else if (game.player1.pairs < game.player2.pairs) {
    return game.player2;
  } else {
    return undefined;
  }
});

export default playGameSlice.reducer;
