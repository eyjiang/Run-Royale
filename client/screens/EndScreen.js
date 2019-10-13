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
  Animated
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

class UserRank extends Component {
  state = {
    A_Anim: new Animated.Value(-230), // Initial value for cloud_A movement: 0
    B_Anim: new Animated.Value(-80), // Initial value for cloud_B movement: 0
    C_Anim: new Animated.Value(-100), // Initial value for cloud_B movement: 0
    username: "",
    rank: "",
    distance: "",
    avgspeed: ""
  }; // the state of the App component

  componentDidMount() {
    this.props.socket.on(
      "game-over-event",
      (socketId, rank, username, distance, avgspeed) => {
        if (this.props.socket.id == socketId) {
          this.setState({ rank });
          this.setState({ username });
          this.setState({ distance });
          this.setState({ avgspeed });
        }
      }
    );
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

  render() {
    let { A_Anim } = this.state;
    let { B_Anim } = this.state;
    let { C_Anim } = this.state;

    if (this.state.rank == 1) {
      return (
        <ImageBackground
          source={require("../assets/images/winnerEndBack.png")}
          style={styles.backgroundImage}
        >
          <View style={styles.winnerContainer}>
            <Text style={styles.winnername}>{this.state.username}</Text>
          </View>
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
        </ImageBackground>
      );
    } else {
      return (
        <ImageBackground
          source={require("../assets/images/endBack.png")}
          style={styles.backgroundImage}
        >
          <View style={styles.userContainer}>
            <Text style={styles.username}>{this.state.username}</Text>
            <Text style={styles.rank}>{this.state.rank}</Text>
          </View>
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
        </ImageBackground>
      );
    }
  }
}

const UserRankWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <UserRank {...props} socket={socket} />}
  </SocketContext.Consumer>
);

var styles = StyleSheet.create({
  userContainer: {
    flex: 1,
    marginTop: 60,
    marginHorizontal: 16
  },
  winnerContainer: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: 16
  },
  backgroundImage: {
    flex: 1,
    // remove width and height to override fixed static size
    width: null,
    height: null
  },
  username: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold"
  },
  winnername: {
    textAlign: "center",
    color: "black",
    fontWeight: "bold",
    fontSize: 20
  },
  congrats: {
    textAlign: "center",
    color: "blue",
    fontWeight: "bold"
  },
  rank: {
    textAlign: "center",
    fontSize: 45,
    color: "black",
    fontWeight: "bold"
  }
});

export default class Background extends Component {
  render() {
    return <UserRankWithSocket />;
  }
}
