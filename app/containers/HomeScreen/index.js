import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'

import CustomButton from '../../components/CustomButton'

/**
 * Just a centered logout button.
 */
export default class HomeScreen extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
  }

  render () {
    const { logout, user } = this.props;
    console.log(user);

    return (
      <View style={styles.container}>
        <Text
                style={styles.username}
                animation={'fadeIn'}
                duration={600}
                delay={400}
            >
                {user.username}
            </Text>
        <CustomButton
          text={'Logout'}
          onPress={logout}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: '#1976D2',
    margin: 20
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  username: {
    alignSelf: 'center',
    padding: 10
  }
})