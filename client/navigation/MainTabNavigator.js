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
    Links: RaceScreen
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
    Loading: LoadingScreen
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
  HomeStack,
  LoadingStack,
  LinksStack
});

tabNavigator.path = "";

export default tabNavigator;
