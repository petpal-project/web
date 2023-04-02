import React from 'react';
import { test, vi } from 'vitest';

import LoginForm from './LoginForm';
import { renderInMockAuthContext, setupTestUser, waitAsync } from '../../test/utils';

const mockLogin = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

test('doesn\'t submit form if username and password fields not set', async () => {
  const user = setupTestUser();
  const { getByText } = render(<LoginForm />);
  const submitButton = getByText('Log In', { exact: true });

  await user.click(submitButton);

  expect(mockLogin).toBeCalledTimes(0);
});

test('doesn\'t submit form if only username field is set', async () => {
  const user = setupTestUser();
  const { getByText, getByPlaceholderText } = render(<LoginForm />);
  const submitButton = getByText('Log In', { exact: true });
  const usernameInput = getByPlaceholderText('username', { exact: false });

  await user.click(usernameInput);
  await user.keyboard('username');

  await user.click(submitButton);

  expect(mockLogin).toBeCalledTimes(0);
});

test('doesn\'t submit form if only password field is set', async () => {
  const user = setupTestUser();
  const { getByText, getByPlaceholderText } = render(<LoginForm />);
  const submitButton = getByText('Log In', { exact: true });
  const passwordInput = getByPlaceholderText('password', { exact: false });

  await user.click(passwordInput);
  await user.keyboard('password');

  await user.click(submitButton);

  expect(mockLogin).toBeCalledTimes(0);
});


test('submits form if username and password fields set', async () => {
  const user = setupTestUser();
  const { getByText, getByPlaceholderText } = render(<LoginForm />);
  const submitButton = getByText('Log In', { exact: true });
  const usernameInput = getByPlaceholderText('username', { exact: false });
  const passwordInput = getByPlaceholderText('password', { exact: false });

  await user.click(usernameInput);
  await user.keyboard('username');

  await user.click(passwordInput);
  await user.keyboard('password');

  await user.click(submitButton);

  expect(mockLogin).toBeCalledTimes(1);
});

test('shows a warning if username field is empty on submit', async () => {
  const user = setupTestUser();
  const { getByText, queryByText } = render(<LoginForm />);
  const submitButton = getByText('Log In', { exact: true });

  await user.click(submitButton);
  const usernameError = queryByText(/invalid.*username/i);

  expect(usernameError).toBeVisible();
});

test('shows a warning if password field is empty on submit', async () => {
  const user = setupTestUser();
  const { getByText, queryByText, debug } = render(<LoginForm />);
  const submitButton = getByText('Log In', { exact: true });

  await user.click(submitButton);
  console.log(debug());
  const passwordError = queryByText(/invalid.*password/i);

  expect(passwordError).toBeVisible();
});

test.todo('shows a warning if login credentials are incorrect');

test('submit button is disabled while processing request', async () => {
  const user = setupTestUser();
  const { getByText, getByPlaceholderText } = render(<LoginForm />);
  const submitButton = getByText('Log In', { exact: true });
  const usernameInput = getByPlaceholderText('username', { exact: false });
  const passwordInput = getByPlaceholderText('password', { exact: false });
  
  mockLogin.mockImplementation(() => waitAsync(1000));

  await user.click(usernameInput);
  await user.keyboard('username');

  await user.click(passwordInput);
  await user.keyboard('password');

  await user.tripleClick(submitButton);

  expect(mockLogin).toBeCalledTimes(1);
});

function render(component: React.ReactNode) {
  return renderInMockAuthContext(component, {
    user: null,
    token: null,
    loginUser: mockLogin,
    logoutUser: vi.fn(),
    registerUser: vi.fn(),
    isServerError: false,
  });
}
