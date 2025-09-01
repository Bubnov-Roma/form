import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setupStore } from '../store';
import { App } from '../App';

describe('App entry', () => {
  const store = setupStore();

  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'mocked-url');
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it('renders App component without crashing', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByText('Controlled Form')).toBeInTheDocument();
    expect(screen.getByText('Uncontrolled Form')).toBeInTheDocument();
  });

  it('opens modal when clicking Controlled Form button', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    await user.click(screen.getByText('Controlled Form'));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });
});
