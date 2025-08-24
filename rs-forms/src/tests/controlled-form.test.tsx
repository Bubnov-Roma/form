import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { ControlledForm } from '../form/controlled';
import { store } from '../store/store';

const mockOnSubmit = vi.fn();

const renderWithProvider = (ui: React.ReactElement) =>
  render(<Provider store={store}>{ui}</Provider>);

vi.stubGlobal('URL', {
  ...URL,
  createObjectURL: vi.fn(() => 'mocked-url'),
});

describe('ControlledForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('calls onSubmit with correct data when valid', async () => {
    renderWithProvider(<ControlledForm onSubmit={mockOnSubmit} />);

    const user = userEvent.setup();

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    await user.type(screen.getByLabelText(/Name/i), 'John');
    await user.type(screen.getByLabelText(/Age/i), '25');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/^Password$/i), '1234Abcd@');
    await user.type(screen.getByLabelText(/Confirm Password/i), '1234Abcd@');

    await user.selectOptions(screen.getByLabelText(/Gender/i), 'Male');
    await user.type(screen.getByLabelText(/Country/i), 'US');

    await user.click(
      screen.getByLabelText(/Accept Terms and Conditions Agreement/i)
    );

    await user.upload(screen.getByLabelText(/Avatar/i), file);

    const submitButton = screen.getByRole('button', { name: /Submit/i });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        password: '1234Abcd@',
        confPassword: '1234Abcd@',
        gender: 'Male',
        country: 'US',
        agreement: true,
        avatar: file,
      });
    });
  });
});
