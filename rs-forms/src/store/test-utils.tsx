import { configureStore } from '@reduxjs/toolkit';
import userReducer from './form-slice';
import { countriesReducer } from './countries-slice';
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  store?: AppStore;
}

export function renderWithProvider(
  ui: ReactElement,
  { store = setupStore(), ...renderOptions }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export const setupStore = () => {
  return configureStore({
    reducer: {
      form: userReducer,
      countries: countriesReducer,
    },
  });
};

export type AppStore = ReturnType<typeof setupStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
