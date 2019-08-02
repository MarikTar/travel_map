import React from 'react';
import PropTypes from 'prop-types';
import AuthInput from "../AuthInput";
import { CSSTransition } from "react-transition-group";

export default function signIn(props) {
  const { onSubmit, onChange, isFormValidate, isCustomValidate, onToggleType, fireBaseError, loading } = props;

  return (
    <form className="auth" noValidate={ !isFormValidate } onSubmit={ onSubmit }>
      <div className="auth-fields">
        <AuthInput 
          onChange={ onChange }
          name='email'
          error={ isCustomValidate }
        />
        <AuthInput 
          onChange={ onChange }
          name='password'
          error={ isCustomValidate }
          onShowPassword={ onToggleType }
        />
      </div>
      <div className="auth-button">
        <button
          type="submit"
          className="button-send"
          disabled={ !isFormValidate }
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
  onShowPassword: PropTypes.func,
  isFormValidate: PropTypes.bool,
  isCustomValidate: PropTypes.object,
  fireBaseError: PropTypes.string,
  loading: PropTypes.bool,
  isTypedField: PropTypes.bool
};