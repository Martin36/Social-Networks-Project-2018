import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Facebook } from 'expo';

const styles = StyleSheet.create({
  fbLoginContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fbLoginButton: {
    marginTop: "100px",
    width: "80%",
    height: "10%",
  }
});

export default class FBLoginButton extends Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);
  }

  async login() {
    try {
      const {type, token}
        = await Facebook.logInWithReadPermissionsAsync('694006790992504');

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
      <View style={styles.fbLoginContainer}>
        <View style={{ height: 60 }} />
        <Button style={styles.fbLoginButton} title="Login" onPress={this.login}>Login</Button>
      </View>
    );
  }
};

module.exports = FBLoginButton;