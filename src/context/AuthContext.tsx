import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { loginUser, registerUser } from '../api/auth';
import { LoginForm, RegistrationForm, TokenData, User, UserBasic } from '../api/auth/types';

interface AuthContextValue {
  user: UserBasic | null,
  token: string | null,
  loginUser: (loginForm: LoginForm) => Promise<void>,
  logoutUser: () => void,
  registerUser: (registerForm: RegistrationForm) => Promise<void>,
  isServerError: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loginUser: (loginForm: LoginForm) => new Promise(() => null),
  logoutUser: () => null,
  registerUser: (registerForm: RegistrationForm) => new Promise(() => null),
  isServerError: false,
});

export default AuthContext;

function setUserObject(user: TokenData | null) {
  if (!user) {
    return null;
  }
  return {
    username: user.username,
    id: user.user_id,
    first_name: user.first_name,
  } as UserBasic;
}

export const AuthProvider = ({ children }) => {
  const userToken = JSON.parse(localStorage.getItem('token') ?? '') || null;
  const decodedUser: TokenData | null = userToken ? jwtDecode(userToken) : null;
  const [token, setToken] = useState(userToken);
  const [user, setUser] = useState(setUserObject(decodedUser));
  const [isServerError, setIsServerError] = useState(false);
  const navigate = useNavigate();

  const register = async (registerData: RegistrationForm) => {
    try {
      let finalData = {
        username: registerData.username,
        password: registerData.password,
        email: registerData.email,
        first_name: registerData.first_name,
        last_name: registerData.last_name,
      };
      let response = await registerUser(finalData);
      if (response.status === 201) {
        console.log('Successful registration! Log in to access token');
        setIsServerError(false);
        navigate('/login');
      } else {
        navigate('/register');
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const login = async (loginData: LoginForm) => {
    try {
      let response = await loginUser(loginData)
      if (response.status === 200) {
        localStorage.setItem('token', JSON.stringify(response.data.access));
        setToken(JSON.parse(response.data.access));
        let loggedInUser = jwtDecode<TokenData>(response.data.access)
        setUser(setUserObject(loggedInUser));
        setIsServerError(false);
        navigate('/dashboard');
      } else {
        navigate('/register');
      }
    } catch (error) {
      console.log(error.response.data);
      setIsServerError(true);
      navigate('/register');
    }
  };

  const logoutUser = () => {
    if (user) {
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
      navigate('/');
    }
  };

  const contextData = {
    user,
    token,
    loginUser: login,
    logoutUser,
    registerUser: register,
    isServerError,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};