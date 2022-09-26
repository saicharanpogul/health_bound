import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {RootState} from '../store';

export interface FitnessTrackerState {
  isAuthorized: boolean;
}

const initialState: FitnessTrackerState = {
  isAuthorized: false,
};

export const fitnessTracker = createSlice({
  name: 'fitnessTracker',
  initialState,
  reducers: {
    setIsAuthorize: (
      state,
      {
        payload,
      }: PayloadAction<{
        isAuthorized: boolean;
      }>,
    ) => {
      state.isAuthorized = payload.isAuthorized;
    },
  },
});

export const {setIsAuthorize} = fitnessTracker.actions;

export const getIsAuthorized = (state: RootState) =>
  state.fitnessTracker.isAuthorized;

export default fitnessTracker.reducer;
