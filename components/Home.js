import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Button, FlatList, KeyboardAvoidingView } from 'react-native';
import TodoSwitch from './TodoSwitch';
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

  constructor () {
    super();

    this.data = null;
    this.state = {
      dataSource: [], todoTitle: '', todoDesc: '', isAddTodoVisible: false,
    }
  }

  componentWillMount() {
    this.props.navigation.setParams({
      onLogout: this.onLogout
    })
  }

  componentDidMount() {
    
    let userId = firebase.auth().currentUser.uid;
    firebase.database().ref('todos/' + userId).on('value', (snapshot) => {
      const todos = snapshot.val();
      //console.log("New todo: ", todos);

      !!todos && this.updateDataSource(todos);
    });

  }

  updateDataSource = (data) => {
    this.data = data;
    let objKeys = !!data ? Object.keys(data) : [];
    //let dataSource = [];
    let dataSource = objKeys.map((key) => {
      return data[key];
    });

    this.setState({dataSource})
  }

  // fetchData = () => {
  //   let userId = firebase.auth().currentUser.uid;
  //   firebase.database().ref('todos/' + userId).once("value", function(data) {
  //     // do some stuff once
  //     console.log('data ', data);
  //     this.data = data

  //     this.updateDataSource(data);
  //   });
  // }

  addTodo = () => {
    let userId = firebase.auth().currentUser.uid;
    firebase.database().ref('todos/' + userId).push({
      todoId: Math.random().toString(36).substr(2, 10),
      todoTitle: this.state.todoTitle,
      todoDesc: this.state.todoDesc,
    }, () => {
      console.log('success');
      this.setState({isAddTodoVisible: false, todoTitle: '', todoDesc: ''})
    });

  }

  removeTodo = (item, value) => {
    console.log(this.data);
    let objKeys = !!this.data ? Object.keys(this.data) : [];
    objKeys.forEach(key => {
      let todoItem = this.data[key];
      if (todoItem.todoId == item.todoId) {
        let userId = firebase.auth().currentUser.uid;
        let todoRef = firebase.database().ref('todos/' + userId)
        todoRef.child(key).remove()
        .then(function() {
          console.log("Remove succeeded.")
        })
        .catch(function(error) {
          console.log("Remove failed: " + error.message)
        });
        return;
      }
    })
  }

  render() {
    let {dataSource, isAddTodoVisible} = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.container}>
        <FlatList
          keyExtractor={(item, index) => item.todoId}
          data={dataSource}
          renderItem={this._renderRow}
        />

        {isAddTodoVisible ?
          <View style={{margin: 5}}>
            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 1}}
              onChangeText={(todoTitle) => this.setState({todoTitle})}
              placeholder={'Todo Name'}
              value={this.state.todoTitle}
            />
            <TextInput
              style={{height: 40, borderBottomColor: 'gray', borderBottomWidth: 1}}
              onChangeText={(todoDesc) => this.setState({todoDesc})}
              placeholder={'Todo Description'}
              value={this.state.todoDesc}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Button title={'Cancel'} onPress={() => this.setState({isAddTodoVisible: false})} />
              <Button title={'Save'} onPress={this.addTodo} />
            </View>

          </View>
          :
          <Button title={'Add Todo'} onPress={() => this.setState({isAddTodoVisible: true})}/>
        }

      </KeyboardAvoidingView>
    );
  }

  _renderRow = ({item}) => {
    return (
      <View style={styles.rowStyle}>
        <View style={{flex: 1}}>
          <Text style={styles.todoText}><Text style={{fontWeight: 'bold'}}>Name: </Text>{item.todoTitle}</Text>
          <Text style={styles.todoText}><Text style={{fontWeight: 'bold'}}>Description: </Text>{item.todoDesc}</Text>
        </View>
        <View>
          <TodoSwitch onValueChange={(value) => this.removeTodo(item, value)} />
        </View>
        
      </View>

    )
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    //justifyContent: 'center',
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF7FD', 
    padding: 5, 
    margin: 3, 
    borderRadius: 3
  },
  todoText: {
    fontSize: 16,
    color: '#054F66',
    marginBottom: 3
  },
});