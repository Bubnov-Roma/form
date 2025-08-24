import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProvider } from '../store';
import { UncontrolledForm } from '../form/uncontrolled';
import type { FormValues } from '../interfaces';

describe('UncontrolledForm', () => {
  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'mocked-url');
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const defaultValues: Partial<FormValues> = {
    name: '',
    age: undefined,
    email: '',
    password: '',
    confPassword: '',
    gender: '',
    country: '',
    agreement: false,
    avatar: undefined,
  };

  it('renders all fields', () => {
    renderWithProvider(
      <UncontrolledForm defaultValues={defaultValues} onSubmit={vi.fn()} />
    );

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(`Password`)).toBeInTheDocument();
    expect(screen.getByLabelText(`Confirm Password`)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Accept Terms/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Avatar/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup();
    renderWithProvider(
      <UncontrolledForm defaultValues={defaultValues} onSubmit={vi.fn()} />
    );
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Age must be positive/i)).toBeInTheDocument();
      expect(screen.getByText(/Required email/i)).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(
        screen.getByText('Confirm password is required')
      ).toBeInTheDocument();
      expect(screen.getByText(/Gender is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Please select a valid country/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/You must accept the agreement/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Unsupported file format/i)).toBeInTheDocument();
    });
  });
});
