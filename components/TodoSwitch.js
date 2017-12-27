import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Switch,
} from 'react-native';

class TodoSwitchSwitch extends Component {
  
    propTypes: {
      value: PropTypes.bool.isRequired,
      onValueChange: PropTypes.func,
    }
  
    defaultProps: {
      value: false,
      onValueChange: () => {}
    }
    
    constructor(props) {
      super(props)
  
      this.state = {value: props.value}
    }
  
    render() {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', paddingVertical: 5, paddingRight: 5}}>
          <Switch onValueChange={this.changeSwitch} value={this.state.value} />
        </View>
      );
    }
  
    changeSwitch = (value) => {
      this.setState({value}, () => {this.props.onValueChange(value)})
    }
  }

  export default TodoSwitchSwitch