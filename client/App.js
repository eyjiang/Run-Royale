import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SocketIOClient from "socket.io-client";
import SocketContext from "./socket-context";

import AppNavigator from "./navigation/AppNavigator";

const socket = SocketIOClient('http://35.1.245.242:3000/');

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <SocketContext.Provider value={socket}>
        <View style={styles.container}>
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </SocketContext.Provider>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      KomikaAxis: require("./assets/fonts/KomikaAxis.ttf"),
      "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
      "sf-black": require("./assets/fonts/SF-Pro-Display-Black.otf"),
      "sf-blackitalic": require("./assets/fonts/SF-Pro-Display-BlackItalic.otf"),
      "sf-bold": require("./assets/fonts/SF-Pro-Display-Bold.otf"),
      "sf-bolditalic": require("./assets/fonts/SF-Pro-Display-BoldItalic.otf"),
      "sf-heavy": require("./assets/fonts/SF-Pro-Display-Heavy.otf"),
      "sf-heavyitalic": require("./assets/fonts/SF-Pro-Display-HeavyItalic.otf"),
      "sf-light": require("./assets/fonts/SF-Pro-Display-Light.otf"),
      "sf-lightitalic": require("./assets/fonts/SF-Pro-Display-LightItalic.otf"),
      "sf-medium": require("./assets/fonts/SF-Pro-Display-Medium.otf"),
      "sf-mediumitalic": require("./assets/fonts/SF-Pro-Display-MediumItalic.otf"),
      "sf-regular": require("./assets/fonts/SF-Pro-Display-Regular.otf"),
      "sf-regularitalic": require("./assets/fonts/SF-Pro-Display-RegularItalic.otf"),
      "sf-semibold": require("./assets/fonts/SF-Pro-Display-Semibold.otf"),
      "sf-semibolditalic": require("./assets/fonts/SF-Pro-Display-SemiboldItalic.otf"),
      "sf-thin": require("./assets/fonts/SF-Pro-Display-Thin.otf"),
      "sf-thinitalic": require("./assets/fonts/SF-Pro-Display-ThinItalic.otf"),
      "sf-ultralight": require("./assets/fonts/SF-Pro-Display-Ultralight.otf"),
      "sf-ultralightitalic": require("./assets/fonts/SF-Pro-Display-UltralightItalic.otf")
    })
  ]);
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
