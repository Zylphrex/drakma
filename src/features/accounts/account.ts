import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';


export interface Account {
  id: number;
  slug: string;
}

export interface AccountState {
  accounts: Record<number, Account>;
}

const initialState: AccountState = {
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
  },
});

export const { load } = account.actions;

export const selectAccount = (state: RootState) => state.account;

export default account.reducer;
