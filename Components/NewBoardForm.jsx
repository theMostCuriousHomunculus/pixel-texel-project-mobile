import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Button as RNPButton,
  Dialog as RNPDialog,
  Paragraph as RNPParagraph,
  Portal as RNPPortal,
  TextInput as RNPTextInput
} from 'react-native-paper';

import environmentVariables from '../env';
import theme from '../theme';
import { AuthenticationContext } from '../Contexts/authentication-context';
import { useRequest } from '../Hooks/request-hook';

export default function NewBoardForm(props) {

  const authentication = React.useContext(AuthenticationContext);
  const [name, setName] = React.useState('');

  const { errorMessage, sendRequest, clearError } = useRequest();

  async function createBoard () {
    try {
      const response = await sendRequest(`${environmentVariables.REACT_APP_BACKEND_URL}/board`,
        'POST',
        JSON.stringify({
          name
        }),
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      
      props.hideDialog();
      props.navigate(response._id, name);
    } catch (error) {

    }
  }

  return (
    <View>
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
        <RNPDialog
          visible={props.dialogDisplayed}
          onDismiss={props.hideDialog}
        >
          <RNPDialog.Title>
            Create a New Message Board
          </RNPDialog.Title>
          <RNPDialog.Content>
            <RNPTextInput
              label="New Message Board Name"
              mode="outlined"
              onChangeText={(changedText) => setName(changedText)}
              value={name}
            />
          </RNPDialog.Content>
          <RNPDialog.Actions style={styles.dialogActions}>
            <RNPButton
              color={theme.colors.red}
              mode="contained"
              onPress={props.hideDialog}
            >
              Cancel
            </RNPButton>
            <RNPButton
              color={theme.colors.blue}
              labelStyle={styles.buttonText}
              mode="contained"
              onPress={createBoard}
            >
              Start
            </RNPButton>
          </RNPDialog.Actions>
        </RNPDialog>
      </RNPPortal>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#eee'
  },
  dialogActions: {
    justifyContent: 'space-between'
  }
});
