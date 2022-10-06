import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from './store';
import { DropdownItemType } from '../components/mui/custom-dropdown.component';

export interface NewCard {
  wordLng1: string;
  wordLng2: string;
}

export interface NewCardSetState {
  setName: string;
  language1: DropdownItemType;
  language2: DropdownItemType;
  cards: NewCard[];
}

type CardSpecKey = 'language1' | 'language2';
export type CardSpec = {
  [k in CardSpecKey]: DropdownItemType;
};

const initialState: NewCardSetState = {
  setName: '',
  language1: { id: '', value: '' },
  language2: { id: '', value: '' },
  cards: [],
};

export const newCardSetSlice = createSlice({
  name: 'newCardSet',
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<NewCard, any>) => {
      state.cards.push(action.payload);
    },
    updateSpec: (state, action: PayloadAction<CardSpec>) => {
      return { ...state, ...action.payload };
    },
    updateSetName: (state, action: PayloadAction<string>) => {
      state.setName = action.payload;
    },
    clear: () => {
      return { ...initialState };
    },
    clearCard: (state, action: PayloadAction<number>) => {
      state.cards.splice(action.payload, 1);
    },
  },
});

export const { addCard, updateSpec, updateSetName, clear, clearCard } =
  newCardSetSlice.actions;

export const selectNewCardSet = (state: RootState): NewCardSetState =>
  state.newCardSet;
export const selectNewCards = createSelector(
  [selectNewCardSet],
  (newCardSet) => newCardSet.cards
);
export const selectSpec = createSelector([selectNewCardSet], (newCardSet) => {
  const { setName, language1, language2 } = newCardSet;
  return { setName, language1, language2 };
});
export const selectIsCardListEmpty = createSelector(
  [selectNewCards],
  (newCards) => Boolean(newCards.length)
);

export default newCardSetSlice.reducer;
