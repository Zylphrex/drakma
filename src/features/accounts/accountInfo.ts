import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface Account {
  id: number;
  slug: string;
}

export interface AccountState {
  selected: number | null;
  allAccounts: Record<number, Account>;
}

const initialState: AccountState = {
  selected: null,
  allAccounts: {},
}

export const accountInfo = createSlice({
  name: 'accountInfo',
  initialState,
  reducers: {
    load: (state, action: PayloadAction<AccountState>) => {
      state.selected = action.payload.selected;
      state.allAccounts = action.payload.allAccounts;
    },
    select: (state, action: PayloadAction<number>) => {
      state.selected = action.payload;
    },
  },
});

export const { load, select } = accountInfo.actions;

export const selectAccount = (state: RootState) => state.accountInfo.selected;

export default accountInfo.reducer;
