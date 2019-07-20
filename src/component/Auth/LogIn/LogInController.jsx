import React, { Component } from 'react';
import LogInView from './LogInView';
import FireBase from "../FireBase";

export default class LogInController extends Component {
  state = {
    fireBaseError: null,
    fireBaseLoading: false
  };

  setLoading(value) {
    console.log(value);
    this.setState({fireBaseLoading: value});
  }

  handleSignUp = async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    this.setLoading(true);

    try {
      await FireBase.firebase
        .auth().signInWithEmailAndPassword(email.value, password.value);
      this.props.history.push('/dashboard');
    } catch (error) {
      this.setState({fireBaseError: error.message});
    }
  };

  render() {
    return <LogInView onSubmit={ this.handleSignUp } fireBaseError={ this.state.fireBaseError } loading={ this.state.fireBaseLoading } />;
  }
}
