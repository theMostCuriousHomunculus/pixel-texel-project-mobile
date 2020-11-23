import React from 'react';
import { StyleSheet } from 'react-native';
import {
  Button as RNPButton,
  Card as RNPCard
} from 'react-native-paper';

import theme from '../theme';
import { AuthenticationContext } from '../Contexts/authentication-context';

export default function BoardCard (props) {

  const authentication = React.useContext(AuthenticationContext);

  return (
    <RNPCard style={styles.card}>
      <RNPCard.Title
        title={props.name}
        subtitle={`Started by: ${props.founder.name}`}
      />
      <RNPCard.Actions
        style={props.founder._id === authentication.userId ? styles.cardActionsSpaceBetween : styles.cardActionsFlexEnd}
      >
        {props.founder._id === authentication.userId &&
          <RNPButton
            color={theme.colors.red}
            mode="contained"
            onPress={props.deleteMessageBoard}
          >
            Delete
          </RNPButton>
        }
        <RNPButton
          color={theme.colors.blue}
          labelStyle={styles.buttonText}
          mode="contained"
          onPress={props.navigate}
        >
          Join
        </RNPButton>
      </RNPCard.Actions>
    </RNPCard>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#eee'
  },
  card: {
    marginTop: 8
  },
  cardActionsFlexEnd: {
    justifyContent: 'flex-end'
  },
  cardActionsSpaceBetween: {
    justifyContent: 'space-between'
  }
});