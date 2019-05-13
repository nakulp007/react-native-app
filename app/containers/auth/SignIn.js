import React from 'react';
import { TextInput, Button, Image, StyleSheet, Text, View } from 'react-native';

import { Auth } from 'aws-amplify';

class SignIn extends React.Component {
  //set initial state
  state = {
    password: '',
    email: '',
    confirmationCode: '',
    user: {}
  }

  onChangeText(key, value){
    this.setState({
      [key]: value
    })
  }

  signIn(){
    const { email, password } = this.state
    Auth.signIn(email, password)
    .then(user => {
        this.setState({ user });
        this.props.screenProps.authenticate(true);
        console.log('successful sign in!');
    })
    .catch(err => console.log('error signing in!: ', err));
  }

  confirmSignIn(){
    //takes in email and confirmation code
    Auth.confirmSignIn(this.state.email, this.state.confirmationCode)
    .then(() => console.log('successful confirm sign in!'))
    .catch(err => console.log('error confirming signing in!: ', err));
  }
  
  render() {
    //console.log("---------props---------");
    //console.log(this.props);
    //console.log("---------props---------");

    return (
      <View style={styles.container}>
        <View style={styles.iconView} >
          <Image source={require('../../assets/Icon-App.png')} style={styles.icon} />
        </View>
        
        <View style={styles.inputView} >
          <TextInput
            onChangeText={ value => this.onChangeText('email', value)}
            style={styles.input}
            autoCorrect={false}
            keyboardType='email-address'
            placeholder='Email Address'
          />
          <TextInput
            onChangeText={ value => this.onChangeText('password', value)}
            style={styles.input}
            autoCorrect={false}
            secureTextEntry={true}
            placeholder='Password'
          />
        </View>
        
        <View style={styles.buttonsView}>
          <Button title="Sign Up" onPress={this.signIn.bind(this)} style={styles.button} />
          <Button title="Sign In" onPress={this.signIn.bind(this)} style={styles.button} />
        </View>        

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#FAFAFF',
  },

  iconView: {
    alignItems:'center',
    margin: 10
  },
  
  inputView: {
    margin: 15,
    maxWidth: 500
  },

  buttonsView: {
    justifyContent: 'center',
    flexDirection: 'row'
  },

  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#2196F3',    
  },
  
  
  icon: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
   
  button: {
    height: 40,
    width: 290
  },
});

export default SignIn;