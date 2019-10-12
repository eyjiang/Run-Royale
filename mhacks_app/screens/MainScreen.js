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
import SocketIOClient from 'socket.io-client';

export default class MainScreen extends Component {
    constructor(props) {
        super(props)
        this.state = { button_state: "Find Match!",
                       count: 0,
                       username: '',
                       password: '',
                       saved_username: ''};
        this.socket = SocketIOClient('http://35.1.194.39:3000/');
      }

    pressFindMatch = () => {
        this.setState({button_state: "Looking for match..."});
        socket.emit('channel-name', 'Hello world!');
    }

    saveLogin = () => {
        this.setState({saved_username: this.state.username});

        //const { saved_username, password } = this.state;
        //Alert.alert('Credentials', `${saved_username} + ${password}`);
    }
    
    onSend(messages=[]) {
        this.socket.emit('find-game-event', messages[0]);
        this._storeMessages(messages);
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
                onPress={this.pressFindMatch}
            />
            </View>
        </SafeAreaView>
    );
  }
}

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