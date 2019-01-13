import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';
import FbLoginButton from '../components/FbLoginButton';
import { LinearGradient } from 'expo';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import AppNavigator from '../navigation/AppNavigator';


export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false
    };

    this.onLogin = this.onLogin.bind(this);
  }

  onLogin(wasSuccess, token, err) {

    console.log(`Login result: ${wasSuccess} - user token is: ${token}`);

    this.setState({
      isLoggedIn: wasSuccess,
      userToken: token,
    });

    AsyncStorage.setItem('userToken', token)
      .then(() => {
        console.log('Saved user token to async storage');
      });

    AsyncStorage.setItem('hostString', 'mock')
      .then(() => console.log('Set default host string'));
  }

  render() {
    if (this.state.isLoggedIn) {

      return <AppNavigator />;

    } else {
      return (
        <LinearGradient
          colors={Colors.gradientColors}
          style={styles.bgGradient}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Movie Finder</Text>
            <Text style={styles.subHeaderText}>We find the perfect movie for you, Log in with Facebook to start the experience</Text>
          </View>
          <FbLoginButton onLogin={this.onLogin} />
        </LinearGradient>
      )
    }
  }
}

const styles = StyleSheet.create({
  bgGradient: {
    height: '100%',
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textContainer: {
    width: '80%',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  subHeaderText: {
    fontSize: 16,
    color: 'white',
  },
})
