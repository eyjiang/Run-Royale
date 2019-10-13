import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  Dimensions,
  Image,
  Animated
} from 'react-native';
import {Runner,Gold,Silver,Bronze,Empty, Tombstone} from '../assets/images'; // <image source=Runner style=...>
import SocketContext from '../socket-context';
import * as Location from 'expo-location';

class ScoreBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      screenwidth: Math.round(Dimensions.get('window').width),
      location: null,
      status: null,
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
    };
  }

  updateDisplayDistances() {
    var maxDistance = 0;
    for (var i = 0; i < 4; i++) {
      let playerId = this.state.orderedPlayerIds[i];
      let newDistance = this.state.data[playerId].distance
      maxDistance = newDistance > maxDistance ? newDistance : maxDistance;
    }
    var maxWidth = this.state.screenwidth/2;
    var cap = maxDistance < 200 ? 200 : maxDistance;
    let p1displaydistance = maxWidth * (this.state.data[this.state.orderedPlayerIds[0]].distance / cap);
    let p2displaydistance = maxWidth * (this.state.data[this.state.orderedPlayerIds[1]].distance / cap);
    let p3displaydistance = maxWidth * (this.state.data[this.state.orderedPlayerIds[2]].distance / cap);
    let p4displaydistance = maxWidth * (this.state.data[this.state.orderedPlayerIds[3]].distance / cap);
    // convert to animation later
    Animated.timing(this.state.p1displaydistance, {toValue: p1displaydistance, duration: 2000}).start();
    Animated.timing(this.state.p2displaydistance, {toValue: p2displaydistance, duration: 2000}).start();
    Animated.timing(this.state.p3displaydistance, {toValue: p3displaydistance, duration: 2000}).start();
    Animated.timing(this.state.p4displaydistance, {toValue: p4displaydistance, duration: 2000}).start();
  }

  componentDidMount() {
    //setTimeout(() => this.updateDisplayDistances(), 3000);
    //this.updateDisplayDistances(); // remove once done
    this.props.socket.on('game-started-event', async (data) => {
      console.log(data);
      this.setState({data});
      delete data['playerIds'];
      let orderedPlayerIds = Object.keys(data);
      console.log('setting orderedPlayerIds to' + orderedPlayerIds);
      this.setState({orderedPlayerIds});
      // set state orderedPlayerIds
      // start sending updates
      let options = {
        'accuracy': Location.Accuracy.Highest,
        'timeInterval': 50, //msec
        'distanceInterval': 10,
      };
      let locationUpdater = await Location.watchPositionAsync(options, this.updateStatus).catch((error) => console.log(error));
      this.props.socket.on('game-over-event', (rank) => {
        Alert.alert("Your rank was "+rank);
        locationUpdater.remove(this.updateStatus);
      });
    });
    this.props.socket.on('room-data-event', (data) => {
      let status = JSON.stringify(data);
      this.setState({data});
      this.setState({status});
      this.updateDisplayDistances();
    })
  }

  updateStatus = (location) => {
    if (this.state.location == null) {
      this.state.location = location;
      return;
    }
    var R = 6371e3; // metres
    var lat1 = this.state.location.coords.latitude;
    var lat2 = location.coords.latitude;
    var lon1 = this.state.location.coords.longitude;
    var lon2 = location.coords.longitude;
    var φ1 = lat1*Math.PI/180;
    var φ2 = lat2*Math.PI/180;
    var Δφ = (lat2-lat1)*Math.PI/180;
    var Δλ = (lon2-lon1)*Math.PI/180;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c;
    this.state.distance += d;

    // send update status
    this.props.socket.emit('update-status-event', d);


    this.setState({location});
  };

  render() {
    if (this.state.data == null || this.state.orderedPlayerIds == null)
    return(<View></View>);

    let p1displaydistance = this.state.p1displaydistance;
    let p2displaydistance = this.state.p2displaydistance;
    let p3displaydistance = this.state.p3displaydistance;
    let p4displaydistance = this.state.p4displaydistance;
    console.log(this.state.orderedPlayerIds);
    var [p1id, p2id, p3id, p4id] = this.state.orderedPlayerIds;

    getSourceFromRank = (rank) => {
      if (rank == 1) return Gold;
      if (rank == 2) return Silver;
      if (rank == 3) return Bronze;
      if (rank == 4) return Empty;
    }


    return(
      <View>
      <View style={styles.columnContainer}>
      <View style={styles.rowContainer}>
      <Image style={styles.medalStyle} source={getSourceFromRank(this.state.data[p1id].rank)}/>
      <View style={styles.middleAnimationBox}>
      <Animated.Image style={{width: 50, height: 50, transform: [{translateX: this.state.p1displaydistance}, {perspective: 1000}]}} source={this.state.data[p1id].alive ? Runner : Tombstone}/>
      </View>
      <Text style={styles.textTestRight}>{this.state.data[p1id].username + '\n' + Math.round(this.state.data[p1id].distance) + ' m\n' + Math.floor(this.state.data[p1id].health) +'❤️'}</Text>
      </View>
      <View style={styles.rowContainer}>
      <Image style={styles.medalStyle} source={getSourceFromRank(this.state.data[p2id].rank)}/>
      <View style={styles.middleAnimationBox}>
      <Animated.Image style={{width: 50, height: 50, transform: [{translateX: this.state.p2displaydistance}, {perspective: 1000}]}} source={this.state.data[p2id].alive ? Runner : Tombstone}/>
      </View>
      <Text style={styles.textTestRight}>{this.state.data[p2id].username + '\n' + Math.round(this.state.data[p2id].distance) + ' m\n' + Math.floor(this.state.data[p2id].health) +'❤️'}</Text>
      </View>
      <View style={styles.rowContainer}>
      <Image style={styles.medalStyle} source={getSourceFromRank(this.state.data[p3id].rank)}/>
      <View style={styles.middleAnimationBox}>
      <Animated.Image style={{width: 50, height: 50, transform: [{translateX: this.state.p3displaydistance}, {perspective: 1000}]}} source={this.state.data[p3id].alive ? Runner : Tombstone}/>
      </View>
      <Text style={styles.textTestRight}>{this.state.data[p3id].username + '\n' + Math.round(this.state.data[p3id].distance) + ' m\n' + Math.floor(this.state.data[p3id].health) +'❤️'}</Text>
      </View>
      <View style={styles.rowContainer}>
      <Image style={styles.medalStyle} source={getSourceFromRank(this.state.data[p4id].rank)}/>
      <View style={styles.middleAnimationBox}>
      <Animated.Image style={{width: 50, height: 50, transform: [{translateX: this.state.p4displaydistance}, {perspective: 1000}]}} source={this.state.data[p4id].alive ? Runner : Tombstone}/>
      </View>
      <Text style={styles.textTestRight}>{this.state.data[p4id].username + '\n' + Math.round(this.state.data[p4id].distance) + ' m\n' + Math.floor(this.state.data[p4id].health) +'❤️'}</Text>
      </View>
      </View>
      </View>
    );
  }
}

const ScoreBoardWithSocket = (props) => (
  <SocketContext.Consumer>
  {socket => <ScoreBoard {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const styles = StyleSheet.create({
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    borderTopWidth: 1, borderColor: 'rgba(0,0,0,.2)'
  },
  textTestIcon: {
    flex: 1,
    fontFamily: "Helvetica",
    color: 'gray',
    fontSize: 15,
    textAlign: 'center'
  },
  middleAnimationBox: {
    flex: 5,
  },
  textTestRight: {
    flex: 1,
    fontFamily: "Helvetica",
    color: 'gray',
    fontSize: 15,
    textAlign: 'right',
    paddingRight: 8
  },
  medalStyle: {
    width: 30,
    height: 30,
    transform: [{translateY: 10}, {perspective: 1000}]
  }
});

export default ScoreBoardWithSocket
