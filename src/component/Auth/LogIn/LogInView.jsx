import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AuthInput from "../AuthInput";
import {Link} from "react-router-dom";
import {CSSTransition} from "react-transition-group";
import GoogleLogIn from "./GoogleLogIn";

export default class LogInView extends Component {
  static propTypes = {
    fireBaseError: PropTypes.string,
    onSubmit: PropTypes.func,
    loading: PropTypes.bool
  };

  state = {
    email: null,
    password: null,
    formValidate: false,
    customValidation: {
      email: {
        isValid: null,
        message: ''
      },
      password: {
        isValid: null,
        message: ''
      }
    }
  };

  render() {
    const { customValidation, formValidate } = this.state;
    const { onSubmit, fireBaseError, loading } = this.props;

    return (
      <form className="auth" noValidate={ !formValidate } onSubmit={ onSubmit }>
        <div className="auth-title">Log In</div>
        <div className="auth-fields">
          <AuthInput onChange={ this.handlerChange } name='email' error={ customValidation } />
          <AuthInput onChange={ this.handlerChange } name='password' error={ customValidation } />
        </div>
        <div className="auth-button">
          <button
            type="submit"
            className="button-send"
            disabled={ !formValidate }
          >
            { loading ? 'loading...' : 'Sig in' }
          </button>
          <span className="account">
           You do not have an account?&nbsp;
            <Link to='/signup' className="auth-link">
            Sign up
          </Link>
        </span>
        </div>
        <CSSTransition
          in={ !!fireBaseError }
          timeout={300}
          classNames="alert"
          unmountOnExit
        >
          <div className="error-server">{ fireBaseError }</div>
        </CSSTransition>
        <GoogleLogIn />
      </form>
    );
  }

  handlerChange = evt => {
    const { name, value } = evt.target;
    let { formValidate, customValidation } = this.state;

    switch (name) {
      case 'email':
        customValidation.email.isValid = this.isEmail(value, customValidation.email);
        break;
      case 'password':
        customValidation.password.isValid = this.validationPassword(value, customValidation.password);
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

  isEmail(value, error) {
    const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!regExp.test(String(value).toLowerCase())) {
      error.message = 'Invalid email';
      return false
    }

    return true;
  };

  validationPassword(value, error) {

    if (value.length < 6) {
      error.message = 'At least 6 characters';
      return false;
    }

    return true;
  };
}
