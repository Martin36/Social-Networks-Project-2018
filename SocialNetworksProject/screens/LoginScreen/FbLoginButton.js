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
  async login() {
    try {
      const {type, token, expires, permissions, declinedPermissions}
        = await Facebook.logInWithReadPermissionsAsync('694006790992504');

      if (type == 'success') {
        alert("Yay!");
      } else {
        alert("Nay!");
      }
    } catch ({message}) {
      alert(`Login failed because: ${message}`);
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