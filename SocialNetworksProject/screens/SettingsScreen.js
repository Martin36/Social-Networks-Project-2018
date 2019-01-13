import React from 'react';
import { TextInput, Text, View } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  render() {
    <View>
      <Text>Host string:</Text>
      <TextInput />
    </View>
  }
}
