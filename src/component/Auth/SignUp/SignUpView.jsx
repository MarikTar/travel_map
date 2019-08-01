import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import AuthInput from "../AuthInput";

export default function SignUpView(props) {
  const { onSubmit, onChange, onFormValidate, onCustomValidate, fireBaseError, loading } = props;

  return (
    <div className="wrapper-form">
      <form className="auth" noValidate={ !onFormValidate } onSubmit={ onSubmit }>
        <div className="auth-fields">
          <AuthInput onChange={ onChange } name='email' error={ onCustomValidate } />
          <AuthInput onChange={ onChange } name='password' error={ onCustomValidate } />
          <AuthInput onChange={ onChange } name='re-password' error={ onCustomValidate } />
        </div>
        <div className="auth-button">
          <button
            type="submit"
            className="button-send"
            disabled={ !onFormValidate }
          >
            { loading ? 'loading...' : 'Sign up' }
          </button>
        </div>
        <CSSTransition
          in={ !!fireBaseError }
          timeout={300}
          classNames="alert"
          unmountOnExit
        >
          <div className="error-server">{ fireBaseError }</div>
        </CSSTransition>
      </form>
    </div>
  );
}

SignUpView.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onFormValidate: PropTypes.bool,
  onCustomValidate: PropTypes.object,
  fireBaseError: PropTypes.string,
  loading: PropTypes.bool
}