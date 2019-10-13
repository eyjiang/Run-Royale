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
    Home: MainScreen
  },
  config
);

HomeStack.navigationOptions = {tabBarVisible: false,
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
    Links: RaceScreen
  },
  config
);

LinksStack.navigationOptions = {
  tabBarVisible: false,
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
    Loading: LoadingScreen
  },
  config
);

LoadingStack.navigationOptions = {
  tabBarVisible: false,
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
