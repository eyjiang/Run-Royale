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

class MainScreen extends Component {
    constructor(props) {
        super(props)
        this.state = { button_state: "Find Match!",
                       count: 0,
                       username: '',
                       password: '',
                       saved_username: ''};
        this.pressFindMatch = this.pressFindMatch.bind(this);
        this.saveLogin = this.saveLogin.bind(this);
        this.onReceivedGameConfirmation = this.onReceivedGameConfirmation.bind(this);
      }

    pressFindMatch(username) {
        console.log(username);
        this.setState({button_state: "Looking for match..."});
        this.props.socket.emit('find-game-event', username);
        // Should listening be handled here?
        this.props.socket.on('game-found-event', this.onReceivedGameConfirmation);
    }

    saveLogin() {
        this.setState({saved_username: this.state.username});

        //const { saved_username, password } = this.state;
        //Alert.alert('Credentials', `${saved_username} + ${password}`);
    }

    // Game found handler
    onReceivedGameConfirmation() {
        Alert.alert('Game found!');
        // Handle other info...
    }
    
  render() {
    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Run Royale</Text>
            </View>
            <View style={styles.container}>
                <TextInput
                    value={this.state.username}
                    onChangeText={(username) => this.setState({ username })}
                    placeholder={'Username'}
                    style={styles.input}
                />
                <TextInput
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    style={styles.input}
                />
                <Button
                    raised
                    type="solid"
                    title="Login"
                    onPress={this.saveLogin}
                />
            </View>
            <View>
                <Text style={styles.user_tag}>Welcome {this.saved_username}!</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                raised
                type="solid"
                title= {this.state.button_state}
                onPress={() => this.pressFindMatch(this.state.saved_username)}
            />
            </View>
        </SafeAreaView>
    );
  }
}

const MainScreenWithSocket = (props) => (
  <SocketContext.Consumer>
    {socket => <MainScreen {...props} socket={socket} />}
  </SocketContext.Consumer>
)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 5,
      marginHorizontal: 16,
    },
    user_tag: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        justifyContent: 'center',
    },
    title: {
      color: 'blue',
      fontWeight: 'bold',
      fontSize: 30,
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    fixToText: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    buttonContainer: {
        width: '100%', 
        height: 50, 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'absolute',
        bottom: 60
    },
    separator: {
      marginVertical: 8,
      borderBottomColor: '#737373',
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
        borderColor: 'transparent',
        marginBottom: 10,
    },
  });

export default MainScreenWithSocket