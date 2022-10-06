import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchLanguagesFromBackend } from '../utils/backend.utils';
import { RootState } from './store';
import { DropdownItemType } from '../components/mui/custom-dropdown.component';
import { createSelector } from 'reselect';

interface LanguagesState {
  languages: DropdownItemType[];
  status: string;
}

const initialState: LanguagesState = {
  languages: [],
  status: 'idle',
};

export const fetchLanguages = createAsyncThunk(
  'languages/fetchLanguages',
  async () => {
    return await fetchLanguagesFromBackend();
  }
);

export const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        fetchLanguages.fulfilled,
        (state, action: PayloadAction<DropdownItemType[]>) => {
          state.languages = action.payload;
          state.status = 'idle';
        }
      );
  },
});

export const selectLanguagesTotal = (state: RootState) => state.languages;

export const selectLanguages = createSelector(
  [selectLanguagesTotal],
  (lang): DropdownItemType[] => lang.languages
);

export default languagesSlice.reducer;
