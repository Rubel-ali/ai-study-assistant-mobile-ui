import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PreferencesState {
  selectedCategory: string | null;
  selectedStream: string | null;
  hasSelectedCategory: boolean;
}

const initialState: PreferencesState = {
  selectedCategory: null,
  selectedStream: null,
  hasSelectedCategory: false,
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setPreferences: (
      state,
      action: PayloadAction<{ category: string; stream: string | null }>
    ) => {
      state.selectedCategory = action.payload.category;
      state.selectedStream = action.payload.stream;
      state.hasSelectedCategory = true;
    },
    clearPreferences: (state) => {
      state.selectedCategory = null;
      state.selectedStream = null;
      state.hasSelectedCategory = false;
    },
  },
});

export const { setPreferences, clearPreferences } = preferencesSlice.actions;

export default preferencesSlice.reducer;
