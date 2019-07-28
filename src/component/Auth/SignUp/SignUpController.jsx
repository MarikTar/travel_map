import React, { Component } from 'react';
import SingUpView from './SignUpView';
import FireBase from "../../../Firebase/FireBase";

export default class SignUpController extends Component {
  state = {
    fireBaseError: null,
    fireBaseLoading: false
  };

  setLoading(value) {
    this.setState({fireBaseLoading: value});
  }

  handleSignUp = async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    this.setLoading(true);

    try {
      await FireBase.firebase
        .auth().createUserWithEmailAndPassword(email.value, password.value);
      this.props.history.push('/dashboard');
    } catch (error) {
      this.setState({fireBaseError: error.message});
      this.setLoading(false);
    }
  };

  render() {
    return <SingUpView onSubmit={ this.handleSignUp } fireBaseError={ this.state.fireBaseError } loading={ this.state.fireBaseLoading } />;
  }
}
