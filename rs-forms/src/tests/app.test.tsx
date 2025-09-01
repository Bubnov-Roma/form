import { beforeAll, afterAll, describe, it, vi, expect } from 'vitest';
import { renderWithProvider } from '../store';
import { App } from '../App';
import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import * as fileUtils from '../utils/file-to-base-64';

describe('App component', () => {
  let createObjectURLMock: typeof URL.createObjectURL;

  beforeAll(() => {
    createObjectURLMock = URL.createObjectURL;
    URL.createObjectURL = vi.fn(() => 'mocked-url');
  });

  afterAll(() => {
    URL.createObjectURL = createObjectURLMock;
  });

  it('opens modal, submits form, and displays saved user', async () => {
    const user = userEvent.setup();
    const fileToBase64Mock = vi
      .spyOn(fileUtils, 'fileToBase64')
      .mockResolvedValue('data:image/png;base64,mock');

    renderWithProvider(<App />);

    await user.click(screen.getByText('Controlled Form'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Name/i), 'Alice');
    await user.type(screen.getByLabelText(/Age/i), '25');
    await user.type(screen.getByLabelText(/Email/i), 'alice@mail.com');
    await user.type(screen.getByLabelText('Password'), 'Password1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password1!');
    await user.selectOptions(screen.getByLabelText(/Gender/i), 'Female');
    await user.type(screen.getByLabelText(/Country/i), 'US');
    await user.click(screen.getByLabelText(/Accept Terms and Conditions/i));

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText(/Avatar/i), file);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/Saved User Data:/i)).toBeInTheDocument();
      expect(screen.getByText(/Alice/)).toBeInTheDocument();
      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'data:image/png;base64,mock'
      );
    });

    fileToBase64Mock.mockRestore();
  });
});
