import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Text,
    Alert,
  } from 'react-native';

export default class ScoreBoard extends Component {
  this.state = {

  }

  render() {
    return (
      // Try setting `justifyContent` to `center`.
      // Try setting `flexDirection` to `row`.
      
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
    </View>
    );
  }
}
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
