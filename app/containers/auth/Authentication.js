import React from 'react';
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';
import SignUp from './SignUp';
import SignIn from './SignIn';

class Authentication extends React.Component {
    //set initial state
    state = {
        state: 'SignIn'
    }

    render() {
        if (this.state.state == 'SignUp') {
            return (
                <SignUp />
            );
        } else {
            return (
                <SignIn />
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
});

export default Authentication;