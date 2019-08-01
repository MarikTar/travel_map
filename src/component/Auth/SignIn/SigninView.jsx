import React from 'react';
import PropTypes from 'prop-types';
import AuthInput from "../AuthInput";
import { CSSTransition } from "react-transition-group";

export default function signIn(props) {
  const { onSubmit, onChange, onFormValidate, onCustomValidate, fireBaseError, loading } = props;

  return (
    <form className="auth" noValidate={ !onFormValidate } onSubmit={ onSubmit }>
      <div className="auth-fields">
        <AuthInput onChange={ onChange } name='email' error={ onCustomValidate } />
        <AuthInput onChange={ onChange } name='password' error={ onCustomValidate } />
      </div>
      <div className="auth-button">
        <button
          type="submit"
          className="button-send"
          disabled={ !onFormValidate }
        >
          { loading ? 'loading...' : 'Sign in' }
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
  );
}

signIn.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onFormValidate: PropTypes.bool,
  onCustomValidate: PropTypes.object,
  fireBaseError: PropTypes.string,
  loading: PropTypes.bool
};