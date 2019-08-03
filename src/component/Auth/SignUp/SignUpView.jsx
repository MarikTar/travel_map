import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import AuthInput from "../AuthInput";

export default function SignUpView(props) {
  const { onSubmit, onChange, onToggleType, isFormValidate, isCustomValidate, fireBaseError, loading } = props;

  return (
    <div className="wrapper-form">
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
            eye
          />
          <AuthInput 
            onChange={ onChange } 
            name='re-password' 
            error={ isCustomValidate } 
            onShowPassword={ onToggleType }
            eye
          />
        </div>
        <div className="auth-button">
          <button
            type="submit"
            className="button-send"
            disabled={ !isFormValidate }
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
  onShowPassword: PropTypes.func,
  isFormValidate: PropTypes.bool,
  isCustomValidate: PropTypes.object,
  fireBaseError: PropTypes.string,
  loading: PropTypes.bool,
  isTypedField: PropTypes.bool
}