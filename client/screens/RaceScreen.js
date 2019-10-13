import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
import SocketContext from '../socket-context';
import * as Location from 'expo-location';

class ScoreBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      location: null,
      status: null
    };
  }

  componentDidMount() {
    this.props.socket.on('game-started-event', async () => {
      // start sending updates
      let options = {
        'accuracy': Location.Accuracy.Highest,
        'timeInterval': 50, //msec
        'distanceInterval': 10,
      };
      let locationUpdater = await Location.watchPositionAsync(options, this.updateStatus).catch((error) => console.log(error));
      // when game over, call locationUpdater.remove(this.updateStatus)
      this.props.socket.on('game-over-event', (rank) => {
        Alert.alert("Your rank was "+rank);
        locationUpdater.remove(this.updateStatus);
      });
    });
    this.props.socket.on('room-data-event', (data) => {
      let status = JSON.stringify(data);
      this.setState({status});
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
    return(
      <View style={{
        flex: 1,
        marginTop: 25,
        marginHorizontal: 30,
      }}>
      <View>
      <Text style={styles.title}>Game Stats</Text>
      </View>
      <View
      style={{
        borderBottomColor: 'white',
        borderBottomWidth: 15,
      }}
      />
      <View style = {{flexDirection: 'row', justifyContent: 'space-between'}}>
      <View style={styles.distanceStats}>
      <Text style = {{color: 'blue', fontWeight: 'bold', textAlign: 'center', fontSize: 13}}>Storm Speed</Text>
      </View>

      <View style={styles.distanceStats}>
      <Text style = {{color: 'blue', fontWeight: 'bold', textAlign: 'center', fontSize: 13}}>Storm Dist</Text>
      </View>
      </View>
      <Text>{this.state.status}</Text>
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
  matchButton: {
    color: "#f194ff",
  },
  container: {
    flex: 1,
    marginTop: 5,
    marginHorizontal: 16,
  },
  title: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  distanceStats: {
    width: 80,
    height: 80,
    backgroundColor: 'purple',
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    margin: 20
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
  },
});

export default ScoreBoardWithSocket
