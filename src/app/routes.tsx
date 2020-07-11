import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { useRouteMatch } from "react-router-dom";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface Location {
  path: string | null;
}

const initialState: Location = {
  path: null,
};

const location = createSlice({
  name: 'location',
  initialState,
  reducers: {
    navigate: (state, action: PayloadAction<string>) => {
      state.path = action.payload;
    },
  },
});

const { navigate } = location.actions;

export default location.reducer;

export const storeMatch = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const dispatch = useDispatch();
    const { path } = useRouteMatch();

    useEffect(() => () => {
      dispatch(navigate(path));
    });

    return <Component {...props} />;
  };
}
