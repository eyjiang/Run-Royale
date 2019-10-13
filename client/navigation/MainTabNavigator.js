import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";

import MainScreen from "../screens/MainScreen";
import RaceScreen from "../screens/RaceScreen";
import LoadingScreen from "../screens/LoadingScreen";
import EndScreen from "../screens/EndScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const HomeStack = createStackNavigator(
  {
    Home: { screen: MainScreen, navigationOptions: { tabBarVisible: false } }
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: "Menu",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? `ios-information-circle${focused ? "" : "-outline"}`
          : "md-information-circle"
      }
    />
  )
};

HomeStack.path = "";

const LinksStack = createStackNavigator(
  {
    Links: { screen: RaceScreen, navigationOptions: { tabBarVisible: false } }
  },
  config
);

LinksStack.navigationOptions = {
  tabBarLabel: "Race",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

const LoadingStack = createStackNavigator(
  {
    Loading: {
      screen: LoadingScreen,
      navigationOptions: { tabBarVisible: false }
    }
  },
  config
);

LoadingStack.navigationOptions = {
  tabBarLabel: "Loading",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-link" : "md-link"}
    />
  )
};

LoadingStack.path = "";

const tabNavigator = createBottomTabNavigator({
  HomeStack: { screen: HomeStack, navigationOptions: { tabBarVisible: false } },
  LoadingStack: {
    screen: LoadingStack,
    navigationOptions: { tabBarVisible: false }
  },
  LinksStack: {
    screen: LinksStack,
    navigationOptions: { tabBarVisible: false }
  },
  EndScreen: { screen: EndScreen, navigationOptions: { tabBarVisible: false } }
});

tabNavigator.path = "";

export default tabNavigator;
