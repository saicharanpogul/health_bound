import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {RootState} from '../store';

export interface ProfileState {
  fullName: string;
}

const initialState: ProfileState = {
  fullName: 'Unnamed',
};

export const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setFullName: (
      state,
      {
        payload,
      }: PayloadAction<{
        fullName: string;
      }>,
    ) => {
      state.fullName = payload.fullName;
    },
  },
});

export const {setFullName} = profile.actions;

export const getFullName = (state: RootState) => state.profile.fullName;

export default profile.reducer;
