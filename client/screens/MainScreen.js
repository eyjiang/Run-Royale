import React, { Component } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  ImageBackground,
  Text,
  Alert,
} from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';
import SocketContext from '../socket-context';
import * as Permissions from 'expo-permissions';
import RaceScreen from './RaceScreen';

class MainScreen extends Component {
  constructor(props) {
    super(props)
    this.state = { button_state: "Find Match!",
    count: 0,
    username: '',
    password: '',
    button_color: '#338EFF',
    button_num_joined: 0,
    button_room_size: 0,
    button_disabled: false};
    
    this.pressFindMatch = this.pressFindMatch.bind(this);
    this.saveLogin = this.saveLogin.bind(this);
    this.onReceivedGameConfirmation = this.onReceivedGameConfirmation.bind(
      this
    );
    this.props.socket.on('find-game-event', (room_data) => {this.setState({
      button_num_joined: room_data.num_joined.toString(10)});
      this.setState({
      button_room_size: room_data.room_size.toString(10)});
      this.setState({button_state: "Joined: " + this.state.button_num_joined + "/" + this.state.button_room_size});
      console.log("button_num_joined: " + room_data.num_joined + " asdf: " + room_data.room_size);
      });
    this.props.socket.on('game-found-event', this.onReceivedGameConfirmation);
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

  pressFindMatch() {
    if (this.state.username != '') {
      this.props.socket.emit('find-game-event', this.state.username);                                                     
      this.setState({button_disabled: true});
      this.setState({button_color: "#1EA81C"});
    }
  }

  saveLogin() {
    if (this.state.username != '') {
      this.setState({login_button_state: "Logged in!"});
      this.setState({login_button_disable: true});
    }
  }

  // Game found handler
  onReceivedGameConfirmation() {
    Alert.alert("Game found!");
    this.props.navigation.navigate("Loading");
  }

  render() {
    return (
      <ImageBackground source={require('../assets/images/WinnerPage.png')} style={{width: '100%', height: '100%'}}>
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.title}>Run Royale</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    value={this.state.username}
                    onChangeText={(username) => this.setState({ username })}
                    placeholder={'Input Username'}
                    style={styles.input}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                raised
                disabledStyle={{backgroundColor: this.state.button_color}}
                disabledTitleStyle={{color: 'white'}}
                disabled={this.state.button_disabled}
                type="solid"
                buttonStyle={{backgroundColor: this.state.button_color}}
                title= {this.state.button_state}
                onPress={() => this.pressFindMatch()}
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
      marginHorizontal: 16,
    },
    username_display: {
      textAlign: 'center',
      textAlignVertical: 'center',
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
    inputContainer: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: 100
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
        alignSelf: 'center',
    },
  });
export default MainScreenWithSocket;
