import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button as RNPButton,
  Card as RNPCard,
  Dialog as RNPDialog,
  Paragraph as RNPParagraph,
  Portal as RNPPortal,
  ProgressBar as RNPProgressBar,
  TextInput as RNPTextInput
} from 'react-native-paper';

import environmentVariables from '../env';
import theme from '../theme';
import { AuthenticationContext } from '../Contexts/authentication-context';
import { useRequest } from '../Hooks/request-hook';

export default function Authentication(props) {

  const authentication = React.useContext(AuthenticationContext);
  const [email, setEmail] = React.useState('');
  const [mode, setMode] = React.useState('Login');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  async function login () {
    try {
      const response = await sendRequest(`${environmentVariables.REACT_APP_BACKEND_URL}/user/login`,
        'PATCH',
        JSON.stringify({
          email,
          password
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      authentication.login(response.token, response.userId);
      props.navigation.navigate('Chat');
    } catch (error) {

    }
  }

  async function register () {
    try {
      const response = await sendRequest(`${environmentVariables.REACT_APP_BACKEND_URL}/user`,
        'POST',
        JSON.stringify({
          email,
          name,
          password
        }),
        {
          'Content-Type': 'application/json'
        }
      );
        
      authentication.login(response.token, response.userId);
      props.navigation.navigate('Chat');
    } catch (error) {

    }
  }

  function toggleMode (prevState) {
    if (prevState === 'Login') {
      setMode('Register');
    } else {
      setMode('Login');
    }
  }

  return (
    <View style={styles.screen}>
      <RNPPortal>
        <RNPDialog
          visible={!!errorMessage}
          onDismiss={clearError}
        >
          <RNPDialog.Title>Error</RNPDialog.Title>
          <RNPDialog.Content>
            <RNPParagraph>{errorMessage}</RNPParagraph>
          </RNPDialog.Content>
          <RNPDialog.Actions>
            <RNPButton
              color={theme.colors.blue}
              labelStyle={styles.buttonText}
              mode="contained"
              onPress={clearError}
            >
              Try Again
            </RNPButton>
          </RNPDialog.Actions>
        </RNPDialog>
      </RNPPortal>

      <RNPPortal>
        <RNPDialog visible={loading}>
          <RNPDialog.Title>Checking your credentials...</RNPDialog.Title>
          <RNPDialog.Content>
            <RNPProgressBar color={theme.colors.green} indeterminate={true} />
          </RNPDialog.Content>
        </RNPDialog>
      </RNPPortal>

      <RNPCard style={styles.card}>
        <RNPCard.Title title={mode} />
        <RNPCard.Content>
          <RNPTextInput
            label="Email Address"
            mode="outlined"
            onChangeText={(changedText) => setEmail(changedText)}
            value={email}
          />
          {mode === 'Register' &&
            <RNPTextInput
              label="Account Name"
              mode="outlined"
              onChangeText={(changedText) => setName(changedText)}
              value={name}
            />
          }
          <RNPTextInput
            label="Password"
            mode="outlined"
            onChangeText={(changedText) => setPassword(changedText)}
            secureTextEntry={true}
            value={password}
          />
        </RNPCard.Content>
        <RNPCard.Actions style={styles.cardActions}>
          <RNPButton
            color={theme.colors.red}
            mode="contained"
            onPress={() => toggleMode(mode)}
          >
            {mode === 'Login' ? "Don't have an account?" : 'Have an account?'}
          </RNPButton>
          <RNPButton
            color={theme.colors.blue}
            labelStyle={styles.buttonText}
            mode="contained"
            onPress={mode === 'Login' ? login : register}
          >
            {mode}!
          </RNPButton>
        </RNPCard.Actions>
      </RNPCard>
    </View>
  );
}

Authentication.navigationOptions = {
  headerTitle: 'Please Authenticate'
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#eee'
  },
  card: {
    width: '100%'
  },
  cardActions: {
    justifyContent: 'space-between'
  },
  screen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 8
  }
});
