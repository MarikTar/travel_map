import React, { Component } from 'react';
import SingUpView from './SignUpView';
import FireBase from "../../../Firebase/FireBase";

export default class SignUpController extends Component {
  state = {
    email: null,
    password: null,
    're-password': null,
    formValidate: false,
    customValidation: {
      email: {
        isValid: null,
        message: ''
      },
      password: {
        isValid: null,
        message: ''
      },
      're-password': {
        isValid: null,
        message: ''
      }
    },
    fireBaseError: null,
    fireBaseLoading: false
  };

  processing(value) {
    this.setState({fireBaseLoading: value});
  }

  handleSubmit = async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    this.processing(true);

    try {
      await FireBase.firebase
        .auth().createUserWithEmailAndPassword(email.value, password.value);
      this.props.history.push('/dashboard');
    } catch (error) {
      this.setState({fireBaseError: error.message});
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
        customValidation.password.isValid = this.validPasword(value, customValidation.password);
        if (formValidate) {
          this.validRePassowrd(value, customValidation);
        } else if (value === this.state['re-password']) {
          customValidation['re-password'].isValid = true;
        }
        break;
      case 're-password':
        this.validRePassowrd(value, customValidation);
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

  validPasword(value, error) {
    const regExp = /^(?=.*[a-z])(?=.*\d).{6,}$/;

    if (value.length < 6) {
      error.message = 'At least 6 characters';
      return false;
    } else if (!regExp.test(value)) {
      error.message = 'Password must contain letters and numbers';
      return false;
    }

    return true;
  };

  validRePassowrd = (value, customValidation) => {
    if (value !== this.state.password) {
      customValidation['re-password'].isValid = false;
      customValidation['re-password'].message = 'Passwords do not match';
    } else {
      customValidation['re-password'].isValid = true;
    }
  }

  render() {
    const { formValidate, customValidation } = this.state;

    return(
      <SingUpView 
        onSubmit={ this.handleSubmit }
        onChange={ this.handlerChange }
        onFormValidate={ formValidate }
        onCustomValidate={ customValidation }
        fireBaseError={ this.state.fireBaseError } 
        loading={ this.state.fireBaseLoading }
      />
    );
  }
}
