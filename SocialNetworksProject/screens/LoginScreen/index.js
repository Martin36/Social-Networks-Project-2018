import React from 'react';
import FbLoginButton from './FbLoginButton';

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
    this.setState({
      isLoggedIn: wasSuccess
    });
  }

  render() {
    if (this.state.isLoggedIn) {
      return this.props.children;
    } else {
      return (
        <FbLoginButton onLogin={this.onLogin} />
      )
    }
  }
}