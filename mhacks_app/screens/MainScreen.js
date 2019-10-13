import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    Text,
    Alert,
    ImageBackground,
  } from 'react-native';
import { Button } from 'react-native-elements';
import SocketContext from '../socket-context'
import RaceScreen from './RaceScreen'

class MainScreen extends Component {
    constructor(props) {
        super(props)
        this.state = { button_state: "Find Match!",
                       login_button_state: "Login",
                       login_button_disable: false,
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
        if (this.state.login_button_disable) {
          this.setState({button_state: "Looking for match..."});
          this.props.socket.emit('find-game-event', username);
          this.props.socket.on('game-found-event', this.onReceivedGameConfirmation);
        }
    }

    saveLogin() {
        if (this.state.username != '') {
          this.setState({saved_username: this.state.username});
          this.setState({login_button_state: "Logged in!"});
          this.setState({login_button_disable: true});
        }
    }

    // Game found handler
    onReceivedGameConfirmation() {
        Alert.alert('Game found!');
        this.props.navigation.navigate('Links')
    }
    
  render() {
    const login_message = <Text style={styles.user_tag}>Please login.</Text>
    const hello_message = <Text style={styles.user_tag}>Hello, {this.state.saved_username}!</Text>
    return (
        <SafeAreaView style={styles.container}>
          <ImageBackground source={...} style={{width: '100%', height: '100%'}}>
            <View>
                <Text style={styles.title}>Runner Royale</Text>
            </View>
            <View style={styles.container}>
                <TextInput
                    value={this.state.username}
                    onChangeText={(username) => this.setState({ username })}
                    placeholder={'Username'}
                    style={styles.input}
                />
                <Button
                    raised
                    disabled={this.state.login_button_disable}
                    type="solid"
                    title={this.state.login_button_state}
                    onPress={this.saveLogin}
                />
            </View>
            <View style={styles.username_display}>
                {this.state.saved_username == '' ? login_message : hello_message}
            </View>
            <View style={styles.buttonContainer}>
                <Button
                raised
                type="solid"
                title= {this.state.button_state}
                onPress={() => this.pressFindMatch(this.state.saved_username)}
            />
            </View>
            </ImageBackground>
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
    username_display: {
      textAlign: 'center',
      textAlignVertical: 'center',
    },
    user_tag: {
        fontFamily: "Helvetica",
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        justifyContent: 'center',
    },
    title: {
      fontFamily: "Helvetica-Bold",
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