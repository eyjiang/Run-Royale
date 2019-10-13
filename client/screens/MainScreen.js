import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  ImageBackground,
  Text,
  Alert
} from "react-native";
import { Button, ThemeProvider } from "react-native-elements";
import SocketContext from "../socket-context";
import * as Permissions from "expo-permissions";
import RaceScreen from "./RaceScreen";

import layoutConstants from "../constants/Layout";
const { statusBarHeight, calcWidth, calcHeight } = layoutConstants;

import colors from "../constants/Colors";
const { white, black, supportGrey, dark_turquoise } = colors;

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      button_state: "Find Match!",
      count: 0,
      username: "",
      password: "",
      button_color: dark_turquoise,
      button_num_joined: 0,
      button_room_size: 0
    };

    this.pressFindMatch = this.pressFindMatch.bind(this);
    this.saveLogin = this.saveLogin.bind(this);
    this.onReceivedGameConfirmation = this.onReceivedGameConfirmation.bind(
      this
    );
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
  }

  pressFindMatch(username) {
    if (this.state.username != "") {
      this.props.socket.emit("find-game-event", username);
      this.props.socket.on("find-game-event", room_data => {
        this.setState({
          button_state: room_data.num_joined.toString(10)
        });
        this.setState({
          button_room_size: room_data.room_size.toString(10)
        });
      });

      this.setState({
        button_state:
          "Joined: " +
          this.state.button_num_joined +
          "/" +
          this.state.button_room_size
      });
      this.setState({ button_color: "#1EA81C" });
      this.props.socket.on("game-found-event", this.onReceivedGameConfirmation);
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
    Alert.alert("Game found!");
    this.props.navigation.navigate("Loading");
  }

  render() {
    return (
      <ImageBackground
        source={require("../assets/images/WinnerPage.png")}
        style={{ width: "100%", height: "100%" }}
      >
        <SafeAreaView style={styles.container}>
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
              type="solid"
              buttonStyle={{ backgroundColor: this.state.button_color }}
              title={this.state.button_state}
              onPress={() => this.pressFindMatch(this.state.username)}
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
