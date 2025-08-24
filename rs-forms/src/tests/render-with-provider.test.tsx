import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProvider, setupStore, AppStore } from '../store';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/form-slice';
import { countriesReducer } from '../store/countries-slice';

const TestComponent = () => {
  return <div>Test Redux</div>;
};

describe('renderWithProvider helper', () => {
  it('renders a component with Redux provider', () => {
    renderWithProvider(<TestComponent />);
    expect(screen.getByText('Test Redux')).toBeInTheDocument();
  });

  it('allows using a custom store', () => {
    const customStore: AppStore = configureStore({
      reducer: {
        form: userReducer,
        countries: countriesReducer,
      },
      preloadedState: {
        form: {},
        countries: { allCountries: [{ value: 'US', label: 'United States' }] },
      },
    });

    renderWithProvider(<TestComponent />, { store: customStore });
    expect(screen.getByText('Test Redux')).toBeInTheDocument();

    const state = customStore.getState();
    expect(state.countries.allCountries).toHaveLength(1);
    expect(state.countries.allCountries[0].value).toBe('US');
  });

  it('setupStore creates a default store with correct reducers', () => {
    const store = setupStore();
    const state = store.getState();
    expect(state).toHaveProperty('form');
    expect(state).toHaveProperty('countries');
  });
});
