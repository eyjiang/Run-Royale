import React, { Component } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Text,
  Alert
} from "react-native";
import { Race_Background } from "../assets/images";
import { Button } from "react-native-elements";
import SocketContext from "../socket-context";
import * as Permissions from "expo-permissions";

import layoutConstants from "../constants/Layout";
const { statusBarHeight, calcWidth, calcHeight } = layoutConstants;

import colors from "../constants/Colors";
const { white, black, supportGrey, dark_turquoise, sky_blue } = colors;

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { timer: 5 };
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    //use decrementClock function every 1000ms to decrease timer
    this.clockCall = setInterval(() => {
      this.decrementClock();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.clockCall);
  }

  decrementClock = () => {
    this.setState(
      prevstate => ({
        timer: prevstate.timer - 1
      }),
      () => {
        if (this.state.timer === 0) {
          clearInterval(this.clockCall);
          this.startGame();
        }
      }
    );
  };

  startGame() {
    // Alert.alert("Open the Game!");
    this.props.navigation.navigate("Links");
    // this.props.navigation.navigate("EndScreen"); //works
  }

  render() {
    //delete 'coutdown' later
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>{this.state.timer}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const LoadingScreenWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <LoadingScreen {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 320,
    fontFamily: "KomikaAxis",
    fontWeight: "bold",
    color: dark_turquoise,
    backgroundColor: white,
    textAlign: "center"
  },
  container: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: calcHeight(24)
  }
});

export default LoadingScreenWithSocket;
