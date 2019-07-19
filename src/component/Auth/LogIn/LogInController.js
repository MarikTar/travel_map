import React, { Component } from 'react';
import LogInView from '../LogIn/LogInView';
import FireBase from "../FireBase";

export default class LogInController extends Component {
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
      this.setLoading(false);
      await FireBase.firebase
        .auth().signInWithEmailAndPassword(email.value, password.value);
      this.props.history.push('/dashboard');
    } catch (error) {
      this.setState({fireBaseError: error.message});
      this.setLoading(false);
    }
  };

  render() {
    return <LogInView onSubmit={ this.handleSignUp } fireBaseError={ this.state.fireBaseError } loading={ this.state.fireBaseLoading } />;
  }
}
