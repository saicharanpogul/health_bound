import {combineReducers} from 'redux';
import walletReducer from './wallet';

const allReducers = {
  wallet: walletReducer,
};

export default combineReducers(allReducers);
