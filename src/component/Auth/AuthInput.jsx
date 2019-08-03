import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from "prop-types";

export default function AuthInput(props) {
  const { name, error, onChange, onShowPassword, reference, eye } = props;

  return (
    <div className="auth-field">
      <input
        type={ name === 'email' ? 'text' : !error[name].isType ? 'password' : 'text' }
        name={ name }
        className={`field ${ !error[name].isValid && error[name].isValid !== null ? 'is-error' : '' }`}
        autoComplete="off"
        placeholder={ name.charAt(0).toUpperCase() + name.slice(1) }
        onChange={ onChange }
        ref={ reference }
      />
      { name !== 'email' && eye ? 
        <span 
          className="eye" 
          style={{ opacity: error[name].isType ? 0.8 : 0.4 }} 
          onClick={ onShowPassword } 
        /> : null }
      <CSSTransition
        in={error[name].isValid}
        timeout={300}
        classNames="alert"
        unmountOnExit
      >
        <span className="field-valid" />
      </CSSTransition>
      <CSSTransition
        in={ !error[name].isValid && error[name].isValid !== null }
        timeout={300}
        classNames="alert"
        unmountOnExit
      >
        <span className="text-error" >{ !error[name].isValid ? error[name].message : null }</span>
      </CSSTransition>
    </div>
  )
}

AuthInput.propTypes = {
  name: PropTypes.string,
  error: PropTypes.object,
  onChange: PropTypes.func,
  onShowPassword: PropTypes.func,
  isType: PropTypes.bool
};
