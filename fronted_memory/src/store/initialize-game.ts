import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchCardsetListFromBackend,
  fetchNewGamesFromBackend,
} from '../utils/backend.utils';
import { createSelector } from 'reselect';
import { RootState } from './store';
import { DropdownItemType } from '../components/mui/custom-dropdown.component';

interface InitializeGameState {
  sets: DropdownItemType[];
  newGames: NewGame[];
  nickName: string;
  setStatus: string;
  newGameStatus: string;
}

export interface NewGame {
  gameId: string;
  nickName: string;
  cardsetName: string;
  languages: string;
}

const initialState: InitializeGameState = {
  sets: [],
  newGames: [],
  nickName: '',
  setStatus: 'idle',
  newGameStatus: 'idle',
};

export const fetchCardSetListAsync = createAsyncThunk(
  'availableCardSets/fetchCardSetList',
  async () => {
    return await fetchCardsetListFromBackend();
  }
);

export const fetchNewGamesAsync = createAsyncThunk(
  'availableCardSets/fetchNewGames',
  async () => {
    return await fetchNewGamesFromBackend();
  }
);

export const initializeGameSlice = createSlice({
  name: 'availableCardSets',
  initialState,
  reducers: {
    setNickName: (state, action: PayloadAction<string>) => {
      state.nickName = action.payload;
    },
    setNewGames: (state, action: PayloadAction<NewGame[]>) => {
      state.newGames = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardSetListAsync.pending, (state) => {
        state.setStatus = 'loading';
      })
      .addCase(
        fetchCardSetListAsync.fulfilled,
        (state, action: PayloadAction<DropdownItemType[]>) => {
          state.sets = action.payload;
          state.setStatus = 'idle';
        }
      )
      .addCase(fetchNewGamesAsync.pending, (state) => {
        state.setStatus = 'loading';
      })
      .addCase(
        fetchNewGamesAsync.fulfilled,
        (state, action: PayloadAction<NewGame[]>) => {
          state.newGames = action.payload;
          state.setStatus = 'idle';
        }
      );
  },
});

export const { setNickName, setNewGames } = initializeGameSlice.actions;

export const selectInitializeGameState = (state: RootState) =>
  state.initializeGame;

export const selectCardsetList = createSelector(
  [selectInitializeGameState],
  (availableCardsets): DropdownItemType[] => availableCardsets.sets
);

export const selectNewGames = createSelector(
  [selectInitializeGameState],
  (availableCardSets): NewGame[] => availableCardSets.newGames
);

export const selectNickName = createSelector(
  [selectInitializeGameState],
  (availableCardSets) => availableCardSets.nickName
);

export default initializeGameSlice.reducer;
