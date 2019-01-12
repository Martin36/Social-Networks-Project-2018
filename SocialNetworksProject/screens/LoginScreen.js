import React from 'react';
import FbLoginButton from '../components/FbLoginButton';

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
    //TODO: Here we would need to get the user from our database or
    //Create new user if they don't exist
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
