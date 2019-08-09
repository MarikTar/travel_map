import React, { Component } from 'react';
import SignInView from './SigninView';
import FireBase from "../../../Firebase/FireBase";

export default class SignInController extends Component {
  state = {
    email: null,
    password: null,
    formValidate: false,
    isTypeInput: false,
    customValidation: {
      email: {
        isValid: null,
        message: ''
      },
      password: {
        isValid: null,
        message: ''
      }
    },
    fireBaseError: null,
    fireBaseLoading: false
  };

  processing(value) {
    this.setState({ fireBaseLoading: value });
  }

  handleSubmit = async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    this.processing(true);

    try {
      await FireBase.firebase
        .auth().signInWithEmailAndPassword(email.value, password.value);
      this.props.history.push('/dashboard');
    } catch (error) {
      this.setState({ fireBaseError: error.message });
      this.processing(false);
    }
  };

  handlerChange = evt => {
    const { name, value } = evt.target;
    let { formValidate, customValidation } = this.state;

    switch (name) {
      case 'email':
        customValidation.email.isValid = this.validEmail(value, customValidation.email);
        break;
      case 'password':
        customValidation.password.isValid = this.validPassword(value, customValidation.password);
        break;
      default:
        break;
    }

    if (!value.length) {
      customValidation[name].message = 'Required field';
    }

    formValidate = Object.values(customValidation).every(value => !!value.isValid);

    this.setState({
      [name]: value,
      formValidate,
      customValidation
    });
  };

  validEmail(value, error) {
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regExp.test(String(value).toLowerCase())) {
      error.message = 'Invalid email';
      return false
    }

    return true;
  };

  validPassword(value, error) {

    if (value.length < 6) {
      error.message = 'At least 6 characters';
      return false;
    }

    return true;
  };

  render() {
    const { formValidate, customValidation } = this.state;

    return(
      <SignInView 
        onSubmit={ this.handleSubmit }
        onChange={ this.handlerChange }
        isFormValidate={ formValidate }
        isCustomValidate={ customValidation }
        onToggleType={ this.handlerShowPassword }
        fireBaseError={ this.state.fireBaseError } 
        loading={ this.state.fireBaseLoading }
      />
    )
  }
}
