import { createSlice } from '@reduxjs/toolkit';
import { countries, type CountryType } from '../form/countries';

interface CountriesState {
  allCountries: CountryType[];
}

const initialState: CountriesState = {
  allCountries: countries,
};

export const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {},
});

export const countriesReducer = countriesSlice.reducer;
