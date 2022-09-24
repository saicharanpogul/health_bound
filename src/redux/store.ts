// import { createStore, applyMiddleware } from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import ReduxThunk, {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import reducers from './reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [ReduxThunk],
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof reducers>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
