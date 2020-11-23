import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  Button as RNPButton,
  Card as RNPCard,
  IconButton as RNPIconButton,
  ProgressBar as RNPProgressBar
} from 'react-native-paper';

import BoardCard from '../Components/BoardCard';
import environmentVariables from '../env.js';
import NewBoardForm from '../Components/NewBoardForm';
import theme from '../theme';
import { AuthenticationContext } from '../Contexts/authentication-context';
import { useRequest } from '../Hooks/request-hook';

export default function Home(props) {

  const [dialogDisplayed, setDialogDisplayed] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [messageBoards, setMessageBoards] = React.useState([]);
  const { loading, sendRequest } = useRequest();
  const authentication = React.useContext(AuthenticationContext);

  React.useEffect(() => {
    fetchMessageBoards();
  }, [fetchMessageBoards, sendRequest]);

  async function deleteMessageBoard (boardId) {
    try {
      const remainingMessageBoards = await sendRequest(`${environmentVariables.REACT_APP_BACKEND_URL}/board/${boardId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + authentication.token
        }
      );
      setMessageBoards(remainingMessageBoards);
    } catch (error) {
      console.log(error);
    }
  }

  const fetchMessageBoards = React.useCallback(function () {
    async function run () {
      try {
        setIsRefreshing(true);
        const messageBoardsData = await sendRequest(`${environmentVariables.REACT_APP_BACKEND_URL}/board`, 'GET', null, {});
        setMessageBoards(messageBoardsData);
      } catch (error) {
        console.log(error);
      } finally {
        setIsRefreshing(false);
      }
    }
    run();
  });

  return (
    loading ?
      <RNPCard style={styles.card}>
        <RNPCard.Title title="Finding Sweet Chat Rooms to Join..." />
        <RNPCard.Content>
          <RNPProgressBar color={theme.colors.green} indeterminate={true} />
        </RNPCard.Content>
      </RNPCard> :
      <View style={styles.screen}>
        <RNPButton
          color={theme.colors.red}
          mode="contained"
          onPress={() => {
            authentication.logout();
            props.navigation.navigate('Authentication');
          }}
          style={styles.logoutButton}
        >
          Logout
        </RNPButton>
        <NewBoardForm
          dialogDisplayed={dialogDisplayed}
          hideDialog={() => setDialogDisplayed(false)}
          navigate={(boardId, name) => props.navigation.navigate('MessageBoard', {
            _id: boardId,
            founder: {
              _id: authentication.userId,
              name: 'You'
            },
            name
          })}
        />
        <RNPCard style={styles.card}>
          <RNPCard.Title
            title="Create a New Message Board"
            subtitle="The world eagerly awaits your opinions on stuff..."
          />
          <RNPCard.Actions style={styles.cardActions}>
            <RNPIconButton
              color="#eee"
              icon="pencil"
              mode="contained"
              onPress={() => setDialogDisplayed(true)}
              style={styles.iconButton}
            />
          </RNPCard.Actions>
        </RNPCard>
        
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={messageBoards}
          keyExtractor={(item) => item._id}
          onRefresh={fetchMessageBoards}
          refreshing={isRefreshing}
          renderItem={(itemData) => (
            <BoardCard
              deleteMessageBoard={() => deleteMessageBoard(itemData.item._id)}
              founder={itemData.item.founder}
              name={itemData.item.name}
              navigate={() => props.navigation.navigate('MessageBoard', {
                _id: itemData.item._id,
                founder: itemData.item.founder,
                name: itemData.item.name
              })}
            />
          )}
        />
      </View>
  );
}

Home.navigationOptions = {
  headerTitle: 'Chat App'
};

const styles = StyleSheet.create({
  buttonText: {
    color: '#eee'
  },
  card: {
    marginTop: 8
  },
  cardActions: {
    justifyContent: 'flex-end'
  },
  iconButton: {
    backgroundColor: theme.colors.green,
    borderRadius: 4,
    width: 50
  },
  logoutButton: {
    width: '100%'
  },
  screen: {
    flex: 1,
    padding: 8
  }
});