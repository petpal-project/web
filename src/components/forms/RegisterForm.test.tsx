import { render } from '@testing-library/react';
import React from 'react';
import { beforeEach, test, vi } from 'vitest';

import { setupTestUser, waitAsync } from '../../test/utils';
import RegisterForm from './RegisterForm';

const mockRegisterCallback = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
});

const setupTest = () => {
  const user = setupTestUser();
  const { getByText, getByPlaceholderText, getByRole } = render(<RegisterForm handleSubmit={mockRegisterCallback}/>);

  return {
    user,
    component: {
      submitButton: () => getByText('register', { exact: false }),
      usernameInput: () => getByRole('textbox', { name: 'username' }),
      emailInput: () => getByRole('textbox', { name: 'email' }),
      passwordInput: () => getByPlaceholderText('Password', { exact: true }),
      confirmPasswordInput: () => getByPlaceholderText('Confirm Password', { exact: true }),
    }
  };
};

test('only submits form if all required fields are set', async () => {
  const { user, component: { usernameInput, emailInput, passwordInput, confirmPasswordInput, submitButton } } = setupTest();

  await user.click(usernameInput());
  await user.keyboard('username');
  await user.click(submitButton());

  await user.click(emailInput());
  await user.keyboard('test@gmail.com');
  await user.click(submitButton());

  await user.click(passwordInput());
  await user.keyboard('p@ssword1!');
  await user.click(submitButton());

  await user.click(confirmPasswordInput());
  await user.keyboard('p@ssword1!');
  await user.click(submitButton());

  expect(mockRegisterCallback).toBeCalledTimes(1);
});

test('disables form submission if passwords does not match', async () => {
  const { user, component: { usernameInput, emailInput, passwordInput, confirmPasswordInput, submitButton } } = setupTest();

  await user.click(usernameInput());
  await user.keyboard('test_user');

  await user.click(emailInput());
  await user.keyboard('testuser@email.com');
  
  await user.click(passwordInput());
  await user.keyboard('s3cuR3p@$$word');

  await user.click(confirmPasswordInput());
  await user.keyboard('password');

  await user.click(submitButton());
  
  expect(mockRegisterCallback).toBeCalledTimes(0);
});

test('disables submit button while processing request', async () => {
  const { user, component: { usernameInput, passwordInput, emailInput, confirmPasswordInput, submitButton }} = setupTest();
  
  mockRegisterCallback.mockImplementation(() => waitAsync(1000));

  await user.click(usernameInput());
  await user.keyboard('test_user');

  await user.click(emailInput());
  await user.keyboard('testuser@email.com');
  
  await user.click(passwordInput());
  await user.keyboard('password');

  await user.click(confirmPasswordInput());
  await user.keyboard('password');

  await user.tripleClick(submitButton());

  expect(mockRegisterCallback).toBeCalledTimes(1);
});
