import React from 'react';

import {
  StackNavigator,
} from 'react-navigation';

import Login from './components/Login';
import Home from './components/Home';

export default StackNavigator({
  Login: {screen: Login},
  Home: {screen: Home}
});


