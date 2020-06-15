import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import accountInfoReducer from '../features/accounts/accountInfo';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    accountInfo: accountInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
