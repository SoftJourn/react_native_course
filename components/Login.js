import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Alert } from 'react-native';

import * as firebase from 'firebase';
import { NavigationActions } from 'react-navigation'

export default class Login extends React.Component {

  static navigationOptions = {
    title: 'Welcome'
  };

  constructor(props) {
    super(props);

    this.state={
      email: 'dariy@gmail.com', password: 'softjourn'
    }
  }

  componentWillMount() {
    let config = {
      apiKey: "AIzaSyB1MEyaaj20fPJUx7kv-5UnlLk08yHGwF0",
      authDomain: "react-course-dc3f4.firebaseapp.com",
      databaseURL: "https://react-course-dc3f4.firebaseio.com",
      storageBucket: "react-course-dc3f4.appspot.com"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    

    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("We are authenticated now!");

        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'Home', params: {} })
          ]
        });
        this.props.navigation.dispatch(resetAction);
      }
    
      // Do other things
    });
  }

  render() {
    return (
      <View style={[styles.container]}>
        
        <View style={{height: 100, justifyContent: 'center'}}>
          <Text style={{marginVertical: 10}}>HELLO!</Text>
        </View>
        
        
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>Changes you make will automatically reload.</Text>
          <Text>Shake your phone to open the developer menu.</Text>
          <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(email) => this.setState({email})}
              placeholder="Email"
              autoCapitalize={'none'}
              value={this.state.email}
          />
          <TextInput
              ref={(realRef)=> this.input = realRef}
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(password) => this.setState({password})}
              placeholder="Password"
              secureTextEntry={true}
              value={this.state.password}
          />
          <TouchableHighlight style={styles.loginButton} onPress={this.login} underlayColor={'#ccc'}>
            <Text style={styles.buttonTextStyle}>Sign In</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.loginButton} onPress={this.signUp} underlayColor={'#ccc'}>
            <Text style={styles.buttonTextStyle}>Sign Up</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  login = () => {
    let {email, password} = this.state;

    firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {
      let {code, message} = error;

      Alert.alert(code, message);
    });
    // const resetAction = NavigationActions.reset({
    //   index: 0,
    //   actions: [
    //     NavigationActions.navigate({ routeName: 'Home', params: {} })
    //   ]
    // });
    // this.props.navigation.dispatch(resetAction);

    //this.props.navigation.navigate('Home', {username: ''});
  }

  signUp = () => {
    let {email, password} = this.state;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
      let {code, message} = error;

      Alert.alert(code, message);
    });
  }

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loginButton: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff0000',
    marginVertical: 5,
  },
  buttonTextStyle: {
    color: '#fff',
    fontSize: 17,
  }
});