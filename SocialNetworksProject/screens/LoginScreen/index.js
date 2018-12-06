import React from 'react';
import FbLoginButton from './FbLoginButton';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <FbLoginButton />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingRight: 20,
    paddingLeft: 20,
  }
})
