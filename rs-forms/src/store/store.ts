import { configureStore } from '@reduxjs/toolkit';
import userReducer from './form-slice';
import { countriesReducer } from './countries-slice';

export const store = configureStore({
  reducer: {
    form: userReducer,
    countries: countriesReducer,
  },
});
