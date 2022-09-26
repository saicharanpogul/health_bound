import {combineReducers} from 'redux';
import walletReducer from './wallet';
import fitnessTrackerReducer from './fitnessTracker';
import profileReducer from './profile';

const allReducers = {
  wallet: walletReducer,
  fitnessTracker: fitnessTrackerReducer,
  profile: profileReducer,
};

export default combineReducers(allReducers);
