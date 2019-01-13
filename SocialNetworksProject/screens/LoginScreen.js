import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FbLoginButton from '../components/FbLoginButton';
import { LinearGradient } from 'expo';

import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

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
  }

  render() {
    if (this.state.isLoggedIn) {
      const { children } = this.props;

      const childrenWithProps = React.Children.map(children, child =>
        React.cloneElement(child, { token: this.state.userToken })
      );

      return <div>{childrenWithProps}</div>
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
