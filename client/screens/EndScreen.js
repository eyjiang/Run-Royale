import React, { Component } from 'react';
import { 
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    Text,
    Alert,
    ImageBackground,
    Image, } from 'react-native';

    class UserRank extends Component{
        state = { 
            "username": "rohandavidi",
            "rank": 1
      }; // the state of the App component
        
        
          render() {
            if(this.state.rank == 1){
                return <ImageBackground source={require('../assets/images/winnerEndBack.png')} style={styles.backgroundImage}>
                           <View style={styles.winnerContainer}>
                                <Text style={styles.winnername}>{this.state.username}</Text>
                            </View> 
                        </ImageBackground>
            } else{
                return <ImageBackground source={require('../assets/images/endBack.png')} style={styles.backgroundImage}>
                            <View style={styles.userContainer}>
                                <Text style={styles.username}>{this.state.username}</Text>
                                <Text style={styles.rank}>{this.state.rank}</Text>
                            </View>
                        </ImageBackground>
            }
          }
      }

    
      export default class Background extends Component {
        render() {
             return (
                    <UserRank/>
             );
        }
    }

    var styles = StyleSheet.create({
        userContainer: {
            flex: 1,
            marginTop: 60,
            marginHorizontal: 16,
        },
        winnerContainer: {
            flex: 1,
            marginTop: 40,
            marginHorizontal: 16,
        },
        backgroundImage:{ 
            flex: 1,
            // remove width and height to override fixed static size
            width: null,
            height: null,
        },
        username:{
            textAlign: 'center',
            color: 'black',
            fontWeight: 'bold',
        },
        winnername:{
            textAlign: 'center',
            color: 'black',
            fontWeight: 'bold',
            fontSize: 20
        },
        congrats:{
            textAlign: 'center',
            color: 'blue',
            fontWeight: 'bold',

        },
        rank:{
            textAlign: 'center',
            fontSize: 45,
            color: 'black',
            fontWeight: 'bold',
        }
    }
);
