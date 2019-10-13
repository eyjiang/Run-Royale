import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Text,
  Alert
} from "react-native";
import { Button } from "react-native-elements";
import SocketContext from "../socket-context";
import * as Permissions from "expo-permissions";

// const { statusBarHeight, calcWidth, calcHeight } = layoutConstants;

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
    Alert.alert("Open the Game!");
    this.props.navigation.navigate("Links");
  }

  render() {
    //delete 'coutdown' later
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.username_display}>
            <Text
              style={{
                fontSize: 32,
                letterSpacing: 1
              }}
            >
              {this.state.timer}
            </Text>
          </View>
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
  container: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 16
  },
  username_display: {
    textAlign: "center",
    textAlignVertical: "center"
  },
  user_tag: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    justifyContent: "center"
  },
  title: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    textDecorationLine: "underline"
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonContainer: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 60
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373"
  },
  signin_form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: 10
  }
});

export default LoadingScreenWithSocket;
