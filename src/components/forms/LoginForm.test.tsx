import React from 'react';
import { beforeEach, test, vi } from 'vitest';

import LoginForm from './LoginForm';
import { immediatelyRejectPromise, renderInMockAuthContext, setupTestUser, waitAsync } from '../../test/utils';

const mockLogin = vi.fn();

const setupTest = () => {
  const user = setupTestUser();
  const { getByText, getByRole, getByPlaceholderText, debug } = renderInMockAuthContext(<LoginForm />, {
    user: null,
    token: null,
    loginUser: mockLogin,
    logoutUser: vi.fn(),
    registerUser: vi.fn(),
    isServerError: false,
  });

  return {
    user,
    component: {
      submitButton: () => getByText('Log In', { exact: true }),
      usernameInput: () => getByRole('textbox', { name: 'username' }),
      passwordInput: () => getByPlaceholderText('password', { exact: false }),
      usernameError: () => getByText(/invalid.*username/i),
      passwordError: () => getByText(/invalid.*password/i),
      loginError: () => getByText(/incorrect.*username.*password/i)
    },
    debug
  };
};

beforeEach(() => {
  vi.clearAllMocks();
});

test('only submits form if all required fields are set',  async () => {
  const { user, component: { usernameInput, passwordInput, submitButton } } = setupTest();

  await user.click(usernameInput());
  await user.keyboard('username');
  await user.click(submitButton());

  expect(mockLogin).toBeCalledTimes(0);

  await user.click(passwordInput());
  await user.keyboard('password');
  await user.click(submitButton());

  expect(mockLogin).toBeCalledTimes(1);
});

test('disables form submission while processing request', async () => {
  const { user, component: { usernameInput, passwordInput, submitButton }} = setupTest();
  
  mockLogin.mockImplementation(() => waitAsync(1000));

  await user.click(usernameInput());
  await user.keyboard('username');

  await user.click(passwordInput());
  await user.keyboard('password');

  await user.tripleClick(submitButton());

  expect(mockLogin).toBeCalledTimes(1);
});

test('shows a warning for invalid username (empty) on submit', async () => {
  const { user, component: { submitButton, usernameError } } = setupTest();

  await user.click(submitButton());

  expect(usernameError()).toBeTruthy();
  expect(usernameError()).toBeVisible();
});

test('shows a warning for invalid password (empty) on submit', async () => {
  const { user, component: { submitButton, passwordError } } = setupTest();

  await user.click(submitButton());

  expect(passwordError()).toBeTruthy();
  expect(passwordError()).toBeVisible();});

test('shows a warning for login request error', async () => {
  const { user, component: { usernameInput, passwordInput, submitButton, loginError }} = setupTest();
  mockLogin.mockImplementation(() => immediatelyRejectPromise());

  await user.click(usernameInput());
  await user.keyboard('username');

  await user.click(passwordInput());
  await user.keyboard('password');

  await user.click(submitButton());
  
  expect(loginError()).toBeVisible();
});
