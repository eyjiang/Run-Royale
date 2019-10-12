import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    Alert,
  } from 'react-native';
import SocketContext from '../socket-context'

class User extends Component{
  state = {}; // the state of the App component
  
  
    render() {
      return <View><Text>{JSON.stringify(this.state)}</Text></View>
    }
}

class ScoreBoard extends Component {
    constructor(props) {
        super(props)
        this.state = { };
        //this.socket.on('', this.);
    }

    componentDidMount() {
      this.set
    }

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
            <User/>
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