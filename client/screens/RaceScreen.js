import React, { Component } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Alert,
  Button,
  Text,
  Dimensions,
  Image,
  Vibration,
  Animated
} from "react-native";
import {
  Runner,
  Gold,
  Silver,
  Bronze,
  Empty,
  Tombstone,
  Race_Background,
  Blue_Shell
} from "../assets/images"; // <image source=Runner style=...>
import SocketContext from "../socket-context";
import * as Location from "expo-location";

const popUp = ({}) => {
  let scaleValue = new Animated.Value(0);
};

class ScoreBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenwidth: Math.round(Dimensions.get("window").width),
      location: null,
      status: null,
      used_item: false,
      hit_notifier: null,
      data: null,
      //data: {"playerIds": ["Sr1hcqgXU-uTjLU0AAAB","pSXW3tdI2RlCAAAzAAAC",'3','4'],
      //'3': {"username":"justin","distance":250,"health":65,"averagespeed":85,"alive":true,"rank":2},
      // "4":{"username":"rohan","distance":100,"health":0,"averagespeed":60,"alive":false,"rank":4},
      // "Sr1hcqgXU-uTjLU0AAAB":{"username":"Evan","distance":371.1961730487075,"health":99.99922993338879,"averagespeed":4.6414606378161345,"alive":true,"rank":1},
      // "pSXW3tdI2RlCAAAzAAAC":{"username":"Chittssh","distance":125.4386668904675,"health":79.2370819281441,"averagespeed":1.5684930963871695,"alive":true,"rank":3}},
      //hard coded^
      p1displaydistance: new Animated.Value(0),
      p2displaydistance: new Animated.Value(0),
      p3displaydistance: new Animated.Value(0),
      p4displaydistance: new Animated.Value(0),
      // orderedPlayerIds: ['4','3',"pSXW3tdI2RlCAAAzAAAC", "Sr1hcqgXU-uTjLU0AAAB"],
      orderedPlayerIds: null,
      //hard coded^
      shell1distance: new Animated.Value(0),
      shell2distance: new Animated.Value(0),
      shell3distance: new Animated.Value(0),
      shell4distance: new Animated.Value(0),
      shell1opacity: new Animated.Value(0),
      shell2opacity: new Animated.Value(0),
      shell3opacity: new Animated.Value(0),
      shell4opacity: new Animated.Value(0),
    };
    this.state.p1displaydistance.addListener(({value}) => this._value = value);
    this.state.p2displaydistance.addListener(({value}) => this._value = value);
    this.state.p3displaydistance.addListener(({value}) => this._value = value);
    this.state.p4displaydistance.addListener(({value}) => this._value = value);
    // Handler for client when someone was hit
    // TODO: Return name of player
    //this.props.socket.on("use-item", () => {
    //  this.setState({ hit_notifier: "(user) was hit!" });
    //});
  }

  updateDisplayDistances() {
    var maxDistance = 0;
    for (var i = 0; i < 4; i++) {
      let playerId = this.state.orderedPlayerIds[i];
      let newDistance = this.state.data[playerId].distance;
      maxDistance = newDistance > maxDistance ? newDistance : maxDistance;
    }
    var maxWidth = this.state.screenwidth / 2;
    var cap = maxDistance < 200 ? 200 : maxDistance;
    let p1displaydistance =
      maxWidth *
      (this.state.data[this.state.orderedPlayerIds[0]].distance / cap);
    let p2displaydistance =
      maxWidth *
      (this.state.data[this.state.orderedPlayerIds[1]].distance / cap);
    let p3displaydistance =
      maxWidth *
      (this.state.data[this.state.orderedPlayerIds[2]].distance / cap);
    let p4displaydistance =
      maxWidth *
      (this.state.data[this.state.orderedPlayerIds[3]].distance / cap);
    // convert to animation later
    Animated.timing(this.state.p1displaydistance, {
      toValue: p1displaydistance,
      duration: 2000
    }).start();
    Animated.timing(this.state.p2displaydistance, {
      toValue: p2displaydistance,
      duration: 2000
    }).start();
    Animated.timing(this.state.p3displaydistance, {
      toValue: p3displaydistance,
      duration: 2000
    }).start();
    Animated.timing(this.state.p4displaydistance, {
      toValue: p4displaydistance,
      duration: 2000
    }).start();
  }

  componentDidMount() {
    //setTimeout(() => this.updateDisplayDistances(), 3000);
    //this.updateDisplayDistances(); // remove once done
    this.props.socket.on("blue-turtle-shell", (user, leader) => {
      Vibration.vibrate(2000);
      // release turtle shell animation
      if (user == this.state.orderedPlayerIds[0]) {
        this.state.shell1distance.setValue(this.state.p1displaydistance._value);
        this.state.shell1opacity.setValue(1);
        Animated.timing(this.state.shell1distance, {
          toValue: this.state.screenwidth+20,
          duration: 2000
        }).start();
      } else if (user == this.state.orderedPlayerIds[1]) {
        this.state.shell2distance.setValue(this.state.p1displaydistance._value);
        this.state.shell2opacity.setValue(1);
        Animated.timing(this.state.shell2distance, {
          toValue: this.state.screenwidth+20,
          duration: 2000
        }).start();
      } else if (user == this.state.orderedPlayerIds[2]) {
        this.state.shell3distance.setValue(this.state.p1displaydistance._value);
        this.state.shell3opacity.setValue(1);
        Animated.timing(this.state.shell3distance, {
          toValue: this.state.screenwidth+20,
          duration: 2000
        }).start();
      } else if (user == this.state.orderedPlayerIds[3]) {
        this.state.shell4distance.setValue(this.state.p1displaydistance._value);
        this.state.shell4opacity.setValue(1);
        Animated.timing(this.state.shell4distance, {
          toValue: this.state.screenwidth+20,
          duration: 2000
        }).start();
      }
      setTimeout(() => {
        // hit leader animation
        if (leader == this.state.orderedPlayerIds[0]) {
          this.state.shell1distance.setValue(-20);
          this.state.shell1opacity.setValue(1);
          Animated.timing(this.state.shell1distance, {
            toValue: this.state.p1displaydistance._value,
            duration: 2000
          }).start();
        } else if (leader == this.state.orderedPlayerIds[1]) {
          this.state.shell2distance.setValue(-20);
          this.state.shell2opacity.setValue(1);
          Animated.timing(this.state.shell2distance, {
            toValue: this.state.p2displaydistance._value,
            duration: 2000
          }).start();
        } else if (leader == this.state.orderedPlayerIds[2]) {
          this.state.shell3distance.setValue(-20);
          this.state.shell3opacity.setValue(1);
          Animated.timing(this.state.shell3distance, {
            toValue: this.state.p3displaydistance._value,
            duration: 2000
          }).start();
        } else if (leader == this.state.orderedPlayerIds[3]) {
          this.state.shell4distance.setValue(-20);
          this.state.shell4opacity.setValue(1);
          Animated.timing(this.state.shell4distance, {
            toValue: this.state.p4displaydistance._value,
            duration: 2000
          }).start();
        }
        setTimeout(() => {
          this.state.shell1opacity.setValue(0);
          this.state.shell2opacity.setValue(0);
          this.state.shell3opacity.setValue(0);
          this.state.shell4opacity.setValue(0);
        }, 3000);
      }, 2000);
    })
    this.props.socket.on("game-started-event", async data => {
      console.log(data);
      this.setState({ data });
      delete data["playerIds"];
      let orderedPlayerIds = Object.keys(data);
      console.log("setting orderedPlayerIds to" + orderedPlayerIds);
      this.setState({ orderedPlayerIds });
      // set state orderedPlayerIds
      // start sending updates
      let options = {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 10, //msec
        distanceInterval: 5 //m
      };
      let locationUpdater = await Location.watchPositionAsync(
        options,
        this.updateStatus
      ).catch(error => console.log(error));
      this.props.socket.on(
        "game-over-event",
        (socketId, rank, username, distance, avgspeed) => {
          if (this.props.socket.id == socketId) {
            locationUpdater.remove(this.updateStatus);
            Vibration.vibrate(3000);
            this.props.navigation.navigate("EndScreen");
          }
        }
      );
    });
    this.props.socket.on("room-data-event", data => {
      let status = JSON.stringify(data);
      this.setState({ data });
      this.setState({ status });
      this.updateDisplayDistances();
    });
    setTimeout(this.calibrations, 7000);
  }

  updateStatus = location => {
    if (this.state.location == null) {
      this.state.location = location;
      return;
    }
    var R = 6371e3; // metres
    var lat1 = this.state.location.coords.latitude;
    var lat2 = location.coords.latitude;
    var lon1 = this.state.location.coords.longitude;
    var lon2 = location.coords.longitude;
    var φ1 = (lat1 * Math.PI) / 180;
    var φ2 = (lat2 * Math.PI) / 180;
    var Δφ = ((lat2 - lat1) * Math.PI) / 180;
    var Δλ = ((lon2 - lon1) * Math.PI) / 180;

    var a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    this.state.distance += d;

    // send update status
    this.props.socket.emit("update-status-event", d);

    this.setState({ location });
  };

  useItem = () => {
    this.setState({ used_item: true });
    this.props.socket.emit("use-item");
    //Alert.alert("The lead player was just hit!");
  };
    //'calibrate-zero'
  calibrations = () => {
    this.props.socket.emit("calibrate-zero");
    // Alert.alert("Initial Values reset");
  };

  render() {
    if (this.state.data == null || this.state.orderedPlayerIds == null)
      return <View></View>;

    let p1displaydistance = this.state.p1displaydistance;
    let p2displaydistance = this.state.p2displaydistance;
    let p3displaydistance = this.state.p3displaydistance;
    let p4displaydistance = this.state.p4displaydistance;
    console.log(this.state.orderedPlayerIds);
    var [p1id, p2id, p3id, p4id] = this.state.orderedPlayerIds;

    getSourceFromRank = rank => {
      if (rank == 1) return Gold;
      if (rank == 2) return Silver;
      if (rank == 3) return Bronze;
      if (rank == 4) return Empty;
    };

    return (
      <ImageBackground
        source={Race_Background}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={styles.buttonContainer}>
          <Button
            containerStyle={{
              padding: 45,
              height: 45,
              width: 45,
              overflow: "hidden",
              position: "absolute",
              bottom: 0,
              left: 0,
              borderRadius: 15,
              backgroundColor: "pink"
            }}
            title="Use Item!"
            disabled={this.state.used_item}
            disabledContainerStyle={{ backgroundColor: 'grey' }}
            onPress={() => this.useItem()}>
          </Button>
          </View>
        <View>
          <View style={styles.container}>
            <View>
              <Text style={styles.title}>{this.state.hit_notifier}</Text>
            </View>
          </View>
          <View>
            <View style={styles.columnContainer}>
              <View style={styles.rowContainer}>
                <Image
                  style={styles.medalStyle}
                  source={getSourceFromRank(this.state.data[p1id].rank)}
                />
                <View style={styles.middleAnimationBox}>
                  <Animated.Image
                    style={{
                      width: 50,
                      height: 50,
                      transform: [
                        { translateX: this.state.p1displaydistance },
                        { perspective: 1000 }
                      ]
                    }}
                    source={this.state.data[p1id].alive ? Runner : Tombstone}
                  />
                  <Animated.Image
                    style={{
                      width: 50,
                      height: 50,
                      opacity: this.state.shell1opacity,
                      transform: [
                        {translateX: this.state.shell1distance},
                        {perspective: 1000}
                      ]
                    }}
                    source={Blue_Shell}
                    />
                </View>
                <Text style={styles.textTestRight}>
                  {this.state.data[p1id].username +
                    "\n" +
                    Math.round(this.state.data[p1id].distance) +
                    " m\n" +
                    Math.floor(this.state.data[p1id].health) +
                    "❤️"}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Image
                  style={styles.medalStyle}
                  source={getSourceFromRank(this.state.data[p2id].rank)}
                />
                <View style={styles.middleAnimationBox}>
                  <Animated.Image
                    style={{
                      width: 50,
                      height: 50,
                      transform: [
                        { translateX: this.state.p2displaydistance },
                        { perspective: 1000 }
                      ]
                    }}
                    source={this.state.data[p2id].alive ? Runner : Tombstone}
                  />
                  <Animated.Image
                    style={{
                      width: 50,
                      height: 50,
                      opacity: this.state.shell2opacity,
                      transform: [
                        {translateX: this.state.shell2distance},
                        {perspective: 1000}
                      ]
                    }}
                    source={Blue_Shell}
                    />
                </View>
                <Text style={styles.textTestRight}>
                  {this.state.data[p2id].username +
                    "\n" +
                    Math.round(this.state.data[p2id].distance) +
                    " m\n" +
                    Math.floor(this.state.data[p2id].health) +
                    "❤️"}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Image
                  style={styles.medalStyle}
                  source={getSourceFromRank(this.state.data[p3id].rank)}
                />
                <View style={styles.middleAnimationBox}>
                  <Animated.Image
                    style={{
                      width: 50,
                      height: 50,
                      transform: [
                        { translateX: this.state.p3displaydistance },
                        { perspective: 1000 }
                      ]
                    }}
                    source={this.state.data[p3id].alive ? Runner : Tombstone}
                  />
                  <Animated.Image
                    style={{
                      width: 50,
                      height: 50,
                      opacity: this.state.shell3opacity,
                      transform: [
                        {translateX: this.state.shell3distance},
                        {perspective: 1000}
                      ]
                    }}
                    source={Blue_Shell}
                    />
                </View>
                <Text style={styles.textTestRight}>
                  {this.state.data[p3id].username +
                    "\n" +
                    Math.round(this.state.data[p3id].distance) +
                    " m\n" +
                    Math.floor(this.state.data[p3id].health) +
                    "❤️"}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Image
                  style={styles.medalStyle}
                  source={getSourceFromRank(this.state.data[p4id].rank)}
                />
                <View style={styles.middleAnimationBox}>
                  <Animated.Image
                    style={{
                      width: 50,
                      height: 50,
                      transform: [
                        { translateX: this.state.p4displaydistance },
                        { perspective: 1000 }
                      ]
                    }}
                    source={this.state.data[p4id].alive ? Runner : Tombstone}
                  />
                  <Animated.Image
                    style={{
                      width: 50,
                      height: 50,
                      opacity: this.state.shell4opacity,
                      transform: [
                        {translateX: this.state.shell4distance},
                        {perspective: 1000}
                      ]
                    }}
                    source={Blue_Shell}
                    />
                </View>
                <Text style={styles.textTestRight}>
                  {this.state.data[p4id].username +
                    "\n" +
                    Math.round(this.state.data[p4id].distance) +
                    " m\n" +
                    Math.floor(this.state.data[p4id].health) +
                    "❤️"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const ScoreBoardWithSocket = props => (
  <SocketContext.Consumer>
    {socket => <ScoreBoard {...props} socket={socket} />}
  </SocketContext.Consumer>
);

const styles = StyleSheet.create({
  buttonContainer: {
    width: 100,
    height: 50,
    position: "absolute",
    left: 10,
    bottom: 10
  },
  columnContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch"
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,.2)"
  },
  textTestIcon: {
    flex: 1,
    fontFamily: "KomikaAxis",
    color: "gray",
    fontSize: 15,
    textAlign: "center"
  },
  middleAnimationBox: {
    flex: 5
  },
  textTestRight: {
    flex: 1,
    fontFamily: "KomikaAxis",
    color: "gray",
    fontSize: 15,
    textAlign: "right",
    paddingRight: 8
  },
  medalStyle: {
    width: 30,
    height: 30,
    transform: [{ translateY: 10 }, { perspective: 1000 }]
  }
});

export default ScoreBoardWithSocket;
