import React from 'react';
import { AsyncStorage, TextInput, Button,  Text, View } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  constructor(props) {
    super(props);

    this.state = {
      hostString: null,
      hostStringNew: ''
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.reload();
  }

  reload() {
    AsyncStorage.getItem('hostString')
      .then((hostString) => this.setState({ ...this.state, hostString }));
  }

  onSubmit() {
    this.setState({
      ...this.state,
      hostString: null
    });

    AsyncStorage.setItem('hostString', this.state.hostStringNew)
      .then(this.reload());
  }

  render() {
    if (!this.state.hostString) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    return (<View>
      <Text>Current host is: {this.state.hostString}</Text>
      <Text>Type a different host string below and submit to confirm.</Text>
      <TextInput onChangeText={(hostStringNew) => this.setState({ ...this.state, hostStringNew })} />
      <Button title="confirm-button" onPress={this.onSubmit} />
    </View>);
  }
}
