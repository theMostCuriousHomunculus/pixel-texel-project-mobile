import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Authentication from '../Screens/Authentication';
import Home from '../Screens/Home';
import MessageBoard from '../Screens/MessageBoard';
import theme from '../theme';

const AuthenticationNavigator = createStackNavigator({
  Authentication
}, {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: theme.colors.blue,
      
    },
    headerTintColor: theme.colors.red
  }
});

const ChatNavigator = createStackNavigator({
  Home,
  MessageBoard
}, {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: theme.colors.blue,
      
    },
    headerTintColor: theme.colors.red
  }
});

const MainNavigator = createSwitchNavigator({
  Authentication: AuthenticationNavigator,
  Chat: ChatNavigator
});

export default createAppContainer(MainNavigator);