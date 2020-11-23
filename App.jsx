import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Provider as RNPProvider } from 'react-native-paper';

import { AuthenticationContext } from './Contexts/authentication-context';
import environmentVariables from './env';
import MainNavigator from './Navigation/MainNavigator';
import theme from './theme';
import { useRequest } from './Hooks/request-hook';

export default function App() {

  const { sendRequest } = useRequest();

  const [token, setToken] = React.useState();
  const [userId, setUserId] = React.useState();

  async function getToken () {
    const tkn = await AsyncStorage.getItem('authentication_token');
    return tkn;
  }

  async function getUserId () {
    const uid = await AsyncStorage.getItem('user_id');
    return uid;
  }

  async function removeStorage () {
    await AsyncStorage.removeItem('authentication_token');
    await AsyncStorage.removeItem('user_id');
  }

  const login = React.useCallback((tkn, uid) => {
    setToken(tkn.toString());
    AsyncStorage.setItem('authentication_token', tkn.toString());
    setUserId(uid.toString());
    AsyncStorage.setItem('user_id', uid.toString());
  }, []);

  const logout = React.useCallback(() => {
    const tkn = getToken();
    sendRequest(`${environmentVariables.REACT_APP_BACKEND_URL}/user/logout`,
      'PATCH',
      null,
      {
        Authorization: `Bearer ${tkn}`
      }
    );
    setToken(null);
    setUserId(null);
    removeStorage();
  }, [sendRequest]);

  React.useEffect(() => {
    const tkn = getToken();
    const uid = getUserId();
    if (tkn && uid) {
      login(tkn, uid);
    }
  }, [login]);

  return (
    <AuthenticationContext.Provider
      value={{
        isLoggedIn: !!token,
        login,
        logout,
        token,
        userId
      }}
    >
      <RNPProvider theme={theme}>
        <MainNavigator />
      </RNPProvider>
    </AuthenticationContext.Provider>
  );
}