import React from 'react';
import io from 'socket.io-client';
import { FlatList, StyleSheet } from 'react-native';
import {
  Button as RNPButton,
  Card as RNPCard,
  TextInput as RNPTextInput
} from 'react-native-paper';

import environmentVariables from '../env';
import ExistingMessage from '../Components/ExistingMessage';
import theme from '../theme';
import { AuthenticationContext } from '../Contexts/authentication-context';

const messageBoardReducer = (state, action) => {
  switch (action.type) {
    case 'APPEND':
      return {
        ...state,
        messages: [...state.messages].concat(action.value)
      }
    case 'POPULATE':
      return {
        ...state,
        ...action.value
      }
    default:
      return state;
  }
};

export default function MessageBoard(props) {

  const authentication = React.useContext(AuthenticationContext);
  const boardId = props.navigation.getParam('_id');
  const boardName = props.navigation.getParam('name');
  const founder = props.navigation.getParam('founder');
  const [newMessageText, setNewMessageText] = React.useState('');
  const [messageBoard, dispatch] = React.useReducer(messageBoardReducer, {
    _id: boardId,
    founder: founder,
    messages: [],
    name: boardName
  });
  const [socket, setSocket] = React.useState();

  React.useEffect(function () {
    if (socket) {
      socket.emit('join', boardId);

      socket.on('admitted', function (messageBoardData) {
        dispatch({ type: 'POPULATE', value: messageBoardData });
      });

      socket.on('receiveMessage', function (newMessage) {
        dispatch({ type: 'APPEND', value: newMessage });
      });

      return function () {
        socket.emit('leave', boardId);
        socket.disconnect();
      }
    }
    setSocket(io(environmentVariables.REACT_APP_BACKEND_URL.replace('/api', '')));
  }, [boardId, socket]);

  function sendMessage () {
    socket.emit('sendMessage', boardId, authentication.token, newMessageText);
    setNewMessageText('');
  }

  return (
    <RNPCard style={styles.card}>
      <RNPCard.Title
        title={messageBoard.name}
        subtitle={`Started by: ${messageBoard.founder.name}`}
      />
      <RNPCard.Content style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={messageBoard.messages}
          keyExtractor={(item) => item._id}
          renderItem={(itemData) => (
            <ExistingMessage
              message={itemData.item}
            />
          )}
        />
      </RNPCard.Content>
      <RNPCard.Actions>
        <RNPTextInput
          mode="outlined"
          multiline
          numberOfLines={3}
          onChangeText={(changedText) => setNewMessageText(changedText)}
          style={styles.newMessageInput}
          value={newMessageText}
        />
        <RNPButton
          color={theme.colors.green}
          mode="contained"
          onPress={sendMessage}
          style={styles.submitButton}
        >
          Preach!
        </RNPButton>
      </RNPCard.Actions>
    </RNPCard>
  );
}

MessageBoard.navigationOptions = (navigationData) => {
  const boardName = navigationData.navigation.getParam('name');

  return {
    headerTitle: boardName
  };
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8
  },
  newMessageInput: {
    flexGrow: 1,
    marginRight: 8
  },
  submitButton: {
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'center'
  }
});