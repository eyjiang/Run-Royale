import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import MainScreen from '../screens/MainScreen';
import RaceScreen from '../screens/RaceScreen';
import LobbyScreen from '../screens/LobbyScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: MainScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Menu',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const LinksStack = createStackNavigator(
  {
    Links: RaceScreen,
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: 'Race',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

LinksStack.path = '';

const LobbyStack = createStackNavigator(
  {
    Lobby: LobbyScreen,
  },
  config
);

LobbyStack.navigationOptions = {
  tabBarLabel: 'Lobby',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

LobbyStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  LobbyStack,
  LinksStack,
});

tabNavigator.path = '';

export default tabNavigator;
