import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    Text,
    Alert,
  } from 'react-native';
import { Button } from 'react-native-elements';
import SocketContext from '../socket-context'

class LobbyScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {};
      }

    
  render() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
            </View>
        </SafeAreaView>
    );
  }
}

const LobbyScreenWithSocket = (props) => (
  <SocketContext.Consumer>
    {socket => <LobbyScreen {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 5,
      marginHorizontal: 16,
    },
  });

export default LobbyScreenWithSocket