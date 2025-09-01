import { describe, it, expect, vi, beforeAll } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UniversalForm } from '../form/form';
import { renderWithProvider } from '../store';

beforeAll(() => {
  global.URL.createObjectURL = vi.fn(() => 'mocked-url');
});

describe('UniversalForm (integration)', () => {
  it('renders ControlledForm by default', () => {
    renderWithProvider(<UniversalForm defaultValues={{}} onSubmit={vi.fn()} />);
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('renders UncontrolledForm when mode="uncontrolled"', () => {
    renderWithProvider(
      <UniversalForm
        defaultValues={{}}
        onSubmit={vi.fn()}
        mode="uncontrolled"
      />
    );
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('submits ControlledForm with valid data', async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(
      <UniversalForm defaultValues={{}} onSubmit={handleSubmit} />
    );

    await user.type(screen.getByLabelText(/Name/i), 'Alice');
    await user.type(screen.getByLabelText(/Age/i), '25');
    await user.type(screen.getByLabelText(/Email/i), 'alice@mail.com');
    await user.type(screen.getByLabelText('Password'), 'Password1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password1!');
    await user.selectOptions(screen.getByLabelText(/Gender/i), 'Female');
    await user.type(screen.getByLabelText(/Country/i), 'US');
    await user.click(
      screen.getByLabelText(/Accept Terms and Conditions Agreement/i)
    );

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText(/Avatar/i), file);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Alice',
        age: 25,
        email: 'alice@mail.com',
        gender: 'Female',
        country: 'US',
        avatar: expect.any(File),
        password: 'Password1!',
        confPassword: 'Password1!',
        agreement: true,
      })
    );
  });
});
