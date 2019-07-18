import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import AuthInput from "../AuthInput";
import { Link } from "react-router-dom";

export default class SignUpView extends Component {
  static propTypes = {
    validate: PropTypes.object,
    formValidate: PropTypes.bool,
    fireBaseError: PropTypes.string,
    onSubmit: PropTypes.func
  };

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
    }
  };

  render() {
    const { customValidation, formValidate } = this.state;
    const { fireBaseError, onSubmit, loading } = this.props;

    return (
      <form className="auth" noValidate={ !formValidate } onSubmit={ onSubmit }>
        <div className="auth-title">Sign Up</div>
        <div className="auth-fields">
          <AuthInput onChange={ this.handlerChange } name='email' error={ customValidation } />
          <AuthInput onChange={ this.handlerChange } name='password' error={ customValidation } />
          <AuthInput onChange={ this.handlerChange } name='re-password' error={ customValidation } />
        </div>
        <div className="auth-button">
          <button
            type="submit"
            className="button-send"
            disabled={ !formValidate }
          >
            { loading ? 'loading...' : 'Sign up' }
          </button>
          <span className="account">
            already have an account?&nbsp;
            <Link to='/login' className="auth-link">
            Login
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
        {/*<div className="auth-socials">*/}
        {/*  <div className="auth-socials-title">*/}
        {/*    Sign up with social platforms*/}
        {/*  </div>*/}
        {/*  <ul className="list-socials">*/}
        {/*    <li className="item-social">*/}
        {/*      <a href="#" className="link-social fb" />*/}
        {/*    </li>*/}
        {/*    <li className="item-social">*/}
        {/*      <a href="#" className="link-social gp" />*/}
        {/*    </li>*/}
        {/*  </ul>*/}
        {/*</div>*/}
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
      case 're-password':
        if (value !== this.state.password) {
          customValidation['re-password'].isValid = false;
          customValidation['re-password'].message = 'Passwords do not match';
        } else {
          customValidation['re-password'].isValid = true;
        }
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
}
