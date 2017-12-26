import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Button } from 'react-native';
import * as firebase from 'firebase';
import { NavigationActions } from 'react-navigation'

export default class Home extends React.Component {
  // static navigationOptions = {
  //   title: 'Home'
  // };

  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "Home",
    headerRight: <Button title="Log Out" onPress={
      () => navigation.state.params.onLogout && navigation.state.params.onLogout()
    } />,
  });

  render() {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>HomeScreen!</Text>
      </View>
    )
  }

  componentWillMount() {
    this.props.navigation.setParams({
      onLogout: this.onLogout
    })
  }

  onLogout = () => {
    firebase.auth().signOut().then(()=>{
      //Sign Out successful
      console.log('Sign Out successful');
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Login', params: {} })
        ]
      });
      this.props.navigation.dispatch(resetAction);
    }).catch(()=>{

    })
  }

}