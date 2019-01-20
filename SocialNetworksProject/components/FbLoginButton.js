import React, { Component } from 'react';
import {
  View, Button, StyleSheet,
  TouchableOpacity, Text } from 'react-native';
import { Facebook } from 'expo';

import Colors from '../constants/Colors';

export default class FBLoginButton extends Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
  }

  async login() {
    try {
      const {type, token}
        = await Facebook.logInWithReadPermissionsAsync('694006790992504', {
          permissions: [
            'public_profile',
            'email',
            'user_likes',
          ]
        });

      if (type == 'success') {
        this.props.onLogin(true, token);
      } else {
        this.props.onLogin(false);
      }
    }
    catch (err) {
      this.props.onLogin(false, null, err);
    }
  }

  render() {
    return (
      <TouchableOpacity
        style={styles.fbLoginButton}
        onPress={this.login}>
        <Text style={styles.loginText}>Login with Facebook</Text>
      </TouchableOpacity>
    );
  }
};

const styles = StyleSheet.create({
  fbLoginButton: {
    width: '80%',
    height: '10%',
    backgroundColor: Colors.fbBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 5,
  },
  loginText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }
});

module.exports = FBLoginButton;
