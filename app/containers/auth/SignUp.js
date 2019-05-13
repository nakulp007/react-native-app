import React from 'react';
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';

import { Auth } from 'aws-amplify';

class SignUp extends React.Component {
  //set initial state
  state = {
    password: '',
    email: '',
    confirmationCode: ''
  }

  onChangeText(key, value){
    this.setState({
      [key]: value
    })
  }

  signUp(){
    Auth.signUp({
      username: this.state.email.replace('@', '_'),
      password: this.state.password,
      attributes: {
        email: this.state.email
      }
    })
    .then(() => console.log('successful sign up!'))
    .catch(err => console.log('error signing up!: ', err));
  }

  confirmSignUp(){
    //takes in username and confirmation code
    Auth.confirmSignUp(this.state.email.replace('@', '_'), this.state.confirmationCode)
    .then(() => console.log('successful confirm sign up!'))
    .catch(err => console.log('error confirming signing up!: ', err));
  }
  
  render() {
    //console.log("---------props---------");
    //console.log(this.props);
    //console.log("---------props---------");

    return (
      <View style={styles.container}>
        <TextInput
          onChangeText={ value => this.onChangeText('email', value)}
          style={styles.input}
          placeholder='email'
        />
        <TextInput
          onChangeText={ value => this.onChangeText('password', value)}
          style={styles.input}
          secureTextEntry={true}
          placeholder='password'
        />
        
        <Button title="Sign Up" onPress={this.signUp.bind(this)} />


        <TextInput
          onChangeText={ value => this.onChangeText('confirmationCode', value)}
          style={styles.input}
          placeholder='Confirmation Code'
        />
        <Button title="Confirm Sign Up" onPress={this.confirmSignUp.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',
    margin: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default SignUp;