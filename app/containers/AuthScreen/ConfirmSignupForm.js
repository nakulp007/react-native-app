import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native'
import { Text, View } from 'react-native-animatable'

import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'
import metrics from '../../config/metrics'

export default class ConfirmSignupForm extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onConfirmSignupPress: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    onGoHomeLinkPress: PropTypes.func.isRequired,
  }

  state = {
    passcode: '',
    email: this.props.email
  }

  hideForm = async () => {
    if (this.buttonRef && this.formRef && this.linkRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
        this.linkRef.fadeOut(300)
      ])
    }
  }

  render () {
    const { email, passcode } = this.state
    const { isLoading, onConfirmSignupPress, onGoHomeLinkPress } = this.props
    const isValid = email !== '' && passcode !== ''

    let emailInput;
    let goHomeLink;

    //difference between state.email and props.email
    //props come from parent where normal confirmation process is followed
    //state one is used to bind to text field when email is entered manually
    if(this.props.email == ''){
      emailInput = <CustomTextInput
      name={'email'}
      keyboardType={'email-address'}
      ref={(ref) => this.emailInputRef = ref}
      placeholder={'Enter Email Address'}
      editable={!isLoading}
      returnKeyType={'next'}
      secureTextEntry={false}
      withRef={true}
      onChangeText={(value) => this.setState({ email: value })}
      isEnabled={!isLoading}
    />;

    goHomeLink = <Text
    ref={(ref) => this.linkRef = ref}
    style={styles.goHomeLink}
    onPress={onGoHomeLinkPress}
    animation={'fadeIn'}
    duration={600}
    delay={400}
  >
    {'Back to Home'}
  </Text>
    }

    return (
      <View style={styles.container}>        
        <View style={styles.form} ref={(ref) => { this.formRef = ref }}>  
          <Text
                  style={styles.confirmMessage}
                  animation={'fadeIn'}
                  duration={600}
                  delay={400}
              >
                  {'Confirmation code is sent to your email.'}
          </Text>          
          {emailInput}
          <CustomTextInput
            name={'passcode'}
            ref={(ref) => this.passcodeInputRef = ref}
            placeholder={'Enter Confirmation Code'}
            editable={!isLoading}
            returnKeyType={'done'}
            secureTextEntry={false}
            withRef={true}
            onChangeText={(value) => this.setState({ passcode: value })}
            isEnabled={!isLoading}
          />
        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={() => onConfirmSignupPress(email, passcode)}
              isEnabled={isValid}
              isLoading={isLoading}
              buttonStyle={styles.confirmButton}
              textStyle={styles.confirmButtonText}
              text={'Confirm'}
            />
            {goHomeLink}
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 100,
    justifyContent: 'center'
  },
  confirmButton: {
    backgroundColor: 'white'
  },
  confirmButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },
  confirmMessage: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    padding: 15,
  },
  goHomeLink: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    padding: 20,
  }
})