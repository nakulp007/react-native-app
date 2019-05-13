import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, KeyboardAvoidingView, LayoutAnimation, Platform, StyleSheet, UIManager } from 'react-native'
import { Image, View } from 'react-native-animatable'

import imgLogo from '../../assets/Icon-Transparent.png'
import metrics from '../../config/metrics'

import Opening from './Opening'
import SignupForm from './SignupForm'
import ConfirmSignupForm from './ConfirmSignupForm'
import LoginForm from './LoginForm'

import Amplify, { Auth } from 'aws-amplify'

const IMAGE_WIDTH = metrics.DEVICE_WIDTH * 0.8

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental(true)

/**
 * The authentication screen.
 * It shows three different sub-screens:
 * - The opening screen, with the two buttons that redirect to the login/signup forms (if this.state.visibleForm === null)
 * - The signup form (if this.state.visibleForm === 'SIGNUP')
 * - The login form (if this.state.visibleForm === 'LOGIN')
 *
 * The app state (isLoggedIn, isLoading) and the login/signup functions are received as props from src.app.js
 *
 * The animations are delegated to:
 * - react-native-animatable: for the simpler animations of the components (in e.g. bounceIn animation of the logo)
 * - react-native's LayoutAnimation: for the form show/hide animation
 * - react-native's KeyboardAvoidingView: for applying a bottom padding when a keyboard show-up is detected
 *
 * An example of this screen animation flow is the following:
 * - The user opens the app.
 * - The logo shows up using the bounceIn animation of react-native-animatable, while the "Opening" subscreen animates the button
 *   using the fadeIn animation of react-native-animatable.
 * - The user taps on the "Create account" button.
 * - _setVisibleForm gets called with the 'SIGNUP' parameter. It configures the next animation and sets this.state.visibleForm to 'SIGNUP'.
 *   The state change triggers a render and the change of formStyle gets animated (thanks to the animation configuration previously
 *   applied by _setVisibleForm).
 * - Just after the signup form has become visible it animates the form button using the bounceIn animation of react-native-animatable.
 * - The user fills up its info and signup succesfully.
 * - componentWillUpdate checks the isLoggedIn props and after realizing that the user has just authenticated it calls _hideAuthScreen.
 *   _hideAuthScreen then 1. calls the SignupForm.hideForm(), that hides the form buttons (zoomOut) and the form itself (fadeOut),
 *   2. fadeOut the logo, 3. tells the container that the login animation has completed and that the app is ready to show the next screen (HomeScreen).
 */
export default class AuthScreen extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    onLoginSuccessful: PropTypes.func.isRequired,
    onLoginAnimationCompleted: PropTypes.func.isRequired // Called at the end of a succesfull login/signup animation
  }

  state = {
    isLoading: false, // Is the user loggingIn/signinUp?
    tempEmail: '', // Used in confirmation screen for email
    tempPassword: '', // Used along with tempEmail after confirming code to log in automatically
    visibleForm: null, // Can be: null | SIGNUP | LOGIN | CONFIRM_SIGNUP
  }

  componentWillUpdate (nextProps) {
    // If the user has logged/signed up succesfully start the hide animation
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      this._hideAuthScreen()
    }
  }

  _hideAuthScreen = async () => {
    // 1. Slide out the form container
    await this._setVisibleForm(null)
    // 2. Fade out the logo
    await this.logoImgRef.fadeOut(800)
    // 3. Tell the container (app.js) that the animation has completed
    this.props.onLoginAnimationCompleted()
  }

  _setVisibleForm = async (visibleForm) => {
    // 1. Hide the current form (if any)
    if (this.state.visibleForm && this.formRef && this.formRef.hideForm) {
      await this.formRef.hideForm()
    }
    // 2. Configure a spring animation for the next step
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    // 3. Set the new visible form
    this.setState({ visibleForm })
  }

  /**
   * Two login function that waits 1000 ms and then authenticates the user succesfully.
   * In your real app they should be replaced with an API call to you backend.
   */
  Login = (email, password) => {
    this.setState({ isLoading: true });

    Auth.signIn(email, password)
    .then(user => {
        this.props.onLoginSuccessful(user);
        this.setState({ isLoading: false });
    })
    .catch(err => {
      console.log('error signing in!: ', err);
      this.setState({ isLoading: false });
      Alert.alert(   'Error',     err.message,     [{text: 'OK'}]     );
      //this._setVisibleForm('LOGIN'); //not working. should be used when error occurs from signing in after confirmation directly. them forward to login page
    });
    
  }

  Signup = (email, password, fullName) => {
    this.setState({ isLoading: true });

    Auth.signUp({
      username: email.replace('@', '_'),
      password: password,
      attributes: {
        email: email,
        name: fullName
      }
    })
    .then(() => {
      console.log('successful sign up!')
      this._setVisibleForm('CONFIRM_SIGNUP');
      this.setState({ isLoading: false , tempEmail: email, tempPassword: password });
    })
    .catch(err => {
      console.log('error signing up!: ', err);
      this.setState({ isLoading: false });
      Alert.alert(   'Error',     err.message,     [{text: 'OK'}]     );
    });
  }

  ConfirmSignup = (email, confirmationCode) => {
    this.setState({ isLoading: true });

    //takes in username and confirmation code
    Auth.confirmSignUp(email.replace('@', '_'), confirmationCode)
    .then(() => {
      console.log('successful confirm sign up!');
      this.setState({ isLoading: false });
      if(this.state.tempPassword != ''){
        this.Login(email, this.state.tempPassword);
      }else{
        //used when user went to confirmation screen manually
        //since we don't have password we just go back to login screen
        Alert.alert(   'Error',     'Successfully confirmed email address!',     [{text: 'OK'}]     );
        this._setVisibleForm('LOGIN');
      }      
    })
    .catch(err => {
      console.log('error confirming signing up!: ', err);
      this.setState({ isLoading: false });
      Alert.alert(   'Error',     err.message,     [{text: 'OK'}]     );
    });
    
  }

  render () {
    const { isLoggedIn } = this.props
    const { visibleForm, isLoading, tempEmail, tempPassword } = this.state
    //const visibleForm = 'CONFIRM_SIGNUP'
    
    // The following style is responsible of the "bounce-up from bottom" animation of the form
    const formStyle = (!visibleForm) ? { height: 0 } : { marginTop: 40 }
    return (
      <View style={styles.container}>
        <Image
          animation={'bounceIn'}
          duration={1200}
          delay={200}
          ref={(ref) => this.logoImgRef = ref}
          style={styles.logoImg}
          source={imgLogo}
        />
        {(!visibleForm && !isLoggedIn) && (
          <Opening
            onCreateAccountPress={() => this._setVisibleForm('SIGNUP')}
            onSignInPress={() => this._setVisibleForm('LOGIN')}
          />
        )}
        <KeyboardAvoidingView
          keyboardVerticalOffset={-100}
          behavior={'padding'}
          style={[formStyle, styles.bottom]}
        >
          {(visibleForm === 'SIGNUP') && (
            <SignupForm
              ref={(ref) => this.formRef = ref}
              onLoginLinkPress={() => this._setVisibleForm('LOGIN')}
              onConfirmSignupLinkPress={() => this._setVisibleForm('CONFIRM_SIGNUP')}
              onSignupPress={this.Signup}
              isLoading={isLoading}
            />
          )}
          {(visibleForm === 'CONFIRM_SIGNUP') && (
            <ConfirmSignupForm
              ref={(ref) => this.formRef = ref}
              email={tempEmail}
              onGoHomeLinkPress={() => this._setVisibleForm(null)}
              onConfirmSignupPress={this.ConfirmSignup}
              isLoading={isLoading}
            />
          )}
          {(visibleForm === 'LOGIN') && (
            <LoginForm
              ref={(ref) => this.formRef = ref}
              onSignupLinkPress={() => this._setVisibleForm('SIGNUP')}
              onLoginPress={this.Login}
              isLoading={isLoading}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    width: metrics.DEVICE_WIDTH,
    height: metrics.DEVICE_HEIGHT,
    paddingTop: 24,
    backgroundColor: 'white'
  },
  logoImg: {
    flex: 1,
    height: null,
    width: IMAGE_WIDTH,
    alignSelf: 'center',
    resizeMode: 'contain',
    //marginVertical: 15
  },
  bottom: {
    //backgroundColor: '#1976D2'
    backgroundColor: '#692e34'
  }
})