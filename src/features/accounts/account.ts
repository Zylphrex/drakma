import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';


export interface Account {
  id: number;
  slug: string;
}

export interface AccountState {
  id: number | null;
  accounts: Record<number, Account>;
}

const initialState: AccountState = {
  id: null,
  accounts: {},
}

export const account = createSlice({
  name: 'account',
  initialState,
  reducers: {
    load: (state, action: PayloadAction<Account[]>) => {
      const accounts: Record<number, Account> = {};
      action.payload.forEach((account: Account) => {
        accounts[account.id] = account;
      });
      state.accounts = accounts;
    },
    select: (state, action: PayloadAction<Account>) => {
      state.id = action.payload.id;
    },
  },
});

export const { load, select } = account.actions;

export const selectAccount = (state: RootState) => state.account;

export default account.reducer;
