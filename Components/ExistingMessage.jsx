import React from 'react';
import { StyleSheet} from 'react-native';
import {
  Card as RNPCard,
  Paragraph as RNPParagraph
} from 'react-native-paper';

import theme from '../theme';
import { AuthenticationContext } from '../Contexts/authentication-context';

export default function ExistingMessage(props) {

  const authentication = React.useContext(AuthenticationContext);

  return (
    <RNPCard style={props.message.author._id === authentication.userId ? styles.fromMe : styles.fromOther}>
      <RNPCard.Title
        title={props.message.author.name}
        subtitle={new Date(props.message.createdAt).toLocaleString()}
      />
      <RNPCard.Content>
        <RNPParagraph>
          {props.message.body}
        </RNPParagraph>
      </RNPCard.Content>
    </RNPCard>
  );
}

const styles = StyleSheet.create({
  fromMe: {
    backgroundColor: theme.colors.blue,
    marginTop: 8,
    marginLeft: '5%',
    textAlign: 'right'
  },
  fromOther: {
    backgroundColor: theme.colors.gray,
    marginTop: 8,
    marginRight: '5%'
  }
});