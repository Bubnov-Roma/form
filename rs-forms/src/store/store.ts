import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slice';

export const store = configureStore({
  reducer: {
    form: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
