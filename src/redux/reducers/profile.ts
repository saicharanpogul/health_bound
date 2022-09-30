import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import SimpleToast from 'react-native-simple-toast';

import {RootState} from '../store';

export interface ProfileState {
  fullName: string;
  loading: boolean;
  error: string;
}

const initialState: ProfileState = {
  fullName: 'Unnamed',
  loading: false,
  error: '',
};

export const profile = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    resetProfile: state => {
      state.fullName = initialState.fullName;
    },
    setFullName: (
      state,
      {
        payload,
      }: PayloadAction<{
        fullName: string;
      }>,
    ) => {
      state.fullName = payload.fullName;
      SimpleToast.show('Saved');
    },
  },
  extraReducers: builder => {},
});

export const {setFullName, resetProfile} = profile.actions;

export const getFullName = (state: RootState) => state.profile.fullName;
export const getProfileLoading = (state: RootState) => state.profile.loading;
export const getProfileError = (state: RootState) => state.profile.error;

export default profile.reducer;
