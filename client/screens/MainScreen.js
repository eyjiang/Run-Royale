import React, { Component, useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  ImageBackground,
  Text,
  Alert,
  Animated,
  Vibration
} from "react-native";
import { Cloud_A, Cloud_B, Cloud_C } from "../assets/images";
import { Button, ThemeProvider } from "react-native-elements";
import SocketContext from "../socket-context";
import * as Permissions from "expo-permissions";
import RaceScreen from "./RaceScreen";

import layoutConstants from "../constants/Layout";
const { statusBarHeight, calcWidth, calcHeight } = layoutConstants;

import colors from "../constants/Colors";
const { white, black, supportGrey, dark_turquoise } = colors;

let cloud_A_velo = 6 * 1000; // speed of cloud A
let cloud_B_velo = 18 * 1000; // speed of cloud B
let cloud_C_velo = 12 * 1000; // speed of cloud B

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      A_Anim: new Animated.Value(-230), // Initial value for cloud_A movement: 0
      B_Anim: new Animated.Value(-80), // Initial value for cloud_B movement: 0
      C_Anim: new Animated.Value(-100), // Initial value for cloud_B movement: 0
      button_state: "Find Match!",
      count: 0,
      username: "",
      password: "",
      button_color: dark_turquoise,
      button_num_joined: 0,
      button_room_size: 0,
      button_disabled: false
    };

    this.pressFindMatch = this.pressFindMatch.bind(this);
    this.saveLogin = this.saveLogin.bind(this);
    this.onReceivedGameConfirmation = this.onReceivedGameConfirmation.bind(
      this
    );
    this.props.socket.on("find-game-event", room_data => {
      this.setState({
        button_num_joined: room_data.num_joined.toString(10)
      });
      this.setState({
        button_room_size: room_data.room_size.toString(10)
      });

      this.setState({
        button_state:
          "Joined: " +
          this.state.button_num_joined +
          "/" +
          this.state.button_room_size
      });
      console.log(
        "button_num_joined: " +
          room_data.num_joined +
          " asdf: " +
          room_data.room_size
      );
    });
    this.props.socket.on("game-found-event", this.onReceivedGameConfirmation);
  }

  _getLocationPermission = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      Alert.alert(
        "Run Royale needs location services to track run progress. Please change permissions in the Settings app."
      );
    }
  };

  componentDidMount() {
    // ask for location services permission
    this._getLocationPermission();
    Animated.sequence([
      Animated.timing(this.state.B_Anim, {
        toValue: 350,
        duration: cloud_B_velo
      }),
      Animated.timing(this.state.B_Anim, {
        toValue: -80,
        duration: 1
      })
    ]).start();
    Animated.sequence([
      Animated.timing(this.state.C_Anim, {
        toValue: 350,
        duration: cloud_C_velo
      }),
      Animated.timing(this.state.C_Anim, {
        toValue: -100,
        duration: 1
      })
    ]).start();
    Animated.sequence([
      Animated.timing(this.state.A_Anim, {
        toValue: 350,
        duration: cloud_A_velo
      }),
      Animated.timing(this.state.A_Anim, {
        toValue: -230,
        duration: 1
      })
    ]).start();
    setInterval(
      //interval for cloud A
      () =>
        Animated.sequence([
          Animated.timing(this.state.A_Anim, {
            toValue: 350,
            duration: cloud_A_velo
          }),
          Animated.timing(this.state.A_Anim, {
            toValue: -230,
            duration: 1
          })
        ]).start(), // start the sequence group
      cloud_A_velo + 50
    );
    setInterval(
      //interval for cloud B
      () =>
        Animated.sequence([
          Animated.timing(this.state.B_Anim, {
            toValue: 350,
            duration: cloud_B_velo
          }),
          Animated.timing(this.state.B_Anim, {
            toValue: -80,
            duration: 1
          })
        ]).start(), // start the sequence group
      cloud_B_velo + 50
    );
    setInterval(
      //interval for cloud C
      () =>
        Animated.sequence([
          Animated.timing(this.state.C_Anim, {
            toValue: 350,
            duration: cloud_C_velo
          }),
          Animated.timing(this.state.C_Anim, {
            toValue: -100,
            duration: 1
          })
        ]).start(), // start the sequence group
      cloud_C_velo + 50
    );
  }

  pressFindMatch() {
    if (this.state.username != "") {
      this.props.socket.emit("find-game-event", this.state.username);
      this.setState({ button_disabled: true });
      this.setState({ button_color: "#1EA81C" });
    }
  }

  saveLogin() {
    if (this.state.username != "") {
      this.setState({ login_button_state: "Logged in!" });
      this.setState({ login_button_disable: true });
    }
  }

  // Game found handler
  onReceivedGameConfirmation() {
    // Alert.alert("Game found!");
    Vibration.vibrate(3000);
    this.props.navigation.navigate("Loading");
  }

  render() {
    let { A_Anim } = this.state;
    let { B_Anim } = this.state;
    let { C_Anim } = this.state;
    return (
      <ImageBackground
        source={require("../assets/images/WinnerPage.png")}
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={styles.container}>
          <Animated.Image
            style={{
              width: 200,
              height: 200,
              resizeMode: "contain",
              opacity: 1,
              position: "absolute",
              bottom: 0,
              right: A_Anim
            }}
            source={Cloud_A}
          />
          <Animated.Image
            style={{
              width: 100,
              height: 100,
              resizeMode: "contain",
              opacity: 1,
              position: "absolute",
              bottom: 90,
              right: C_Anim
            }}
            source={Cloud_C}
          />
          <Animated.Image
            style={{
              opacity: 1,
              position: "absolute",
              left: B_Anim,
              top: 30
            }}
            source={Cloud_B}
          />
          <View style={styles.introTextContainer}>
            <Text style={styles.title}>Run Royale</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              value={this.state.username}
              onChangeText={username => this.setState({ username })}
              placeholder={"Input Username"}
              style={styles.input}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              raised
              disabledStyle={{ backgroundColor: this.state.button_color }}
              disabledTitleStyle={{ color: "white" }}
              disabled={this.state.button_disabled}
              type="solid"
              buttonStyle={{ backgroundColor: this.state.button_color }}
              title={this.state.button_state}
              onPress={() => this.pressFindMatch()}
              fontFamily="KomikaAxis"
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }
}

const MainScreenWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <MainScreen {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const styles = StyleSheet.create({
  left_corner: {
    opacity: 1,
    position: "absolute",
    left: 100, //-80 off screen, 290 right edge, 350 completely off
    top: 30 //30 is top half of title
  },
  // right_corner: {
  //   width: 200,
  //   height: 200,
  //   resizeMode: "contain",
  //   opacity: 1,
  //   position: "absolute",
  //   right: 100,
  //   bottom: 0
  // },
  container: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 16
  },
  // username_display: {
  //   textAlign: "center",
  //   textAlignVertical: "center"
  // },
  // user_tag: {
  //   color: "blue",
  //   fontWeight: "bold",
  //   fontSize: 30,
  //   textAlign: "center",
  //   justifyContent: "center"
  // },
  title: {
    fontSize: 40,
    fontFamily: "KomikaAxis",
    color: white,
    letterSpacing: 1
  },
  // fixToText: {
  //   flexDirection: "row",
  //   justifyContent: "space-between"
  // },
  buttonContainer: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 60
  },
  inputContainer: {
    width: "100%",
    // height: 50,
    // justifyContent: "center",
    // alignItems: "center",
    // position: "absolute",
    // top: 100
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: calcHeight(24)
  },
  // separator: {
  //   marginVertical: 8,
  //   borderBottomColor: "#737373"
  // },
  // signin_form: {
  //   flex: 1,
  //   justifyContent: "center",
  //   width: "80%"
  // },
  input: {
    fontFamily: "KomikaAxis",
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    textAlign: "center",
    color: white,
    letterSpacing: 1,
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: white,
    marginBottom: 10
  },
  introTextContainer: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: calcHeight(30)
  }
});
export default MainScreenWithSocket;
