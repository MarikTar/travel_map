import React from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from "prop-types";

export default function AuthInput(props) {
  const { name, error, onChange } = props;

  return (
    <div className="auth-field">
      <input
        type={ name === 'email' ? 'text' : 'password' }
        name={ name }
        className={`field ${ !error[name].isValid && error[name].isValid !== null ? 'is-error' : '' }`}
        autoComplete="off"
        placeholder={ name }
        onChange={ onChange }
      />
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
  onChange: PropTypes.func
};
