import { createContext } from 'react';

export const AuthenticationContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  token: null,
  userId: null
});