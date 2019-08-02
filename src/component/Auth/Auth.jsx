import React, { Component } from 'react';
import { Link, Route, withRouter } from "react-router-dom";
import { CSSTransition } from 'react-transition-group';
import SignIn from './SignIn/SigninController';
import SignUp from './SignUp/SignUpController';
import SocialsAuthorization from './SocialsAuthorization';
import './auth.css';

class Auth extends Component {

	render() {
		const { pathname } = this.props.location;
		const currentPath = pathname === '/login' ? 'Sign In' : 'Sign Up';
		const authInfo = pathname === '/login' ? `to keep connected with us please login with your personal info` : `Enter your personal detail and start journey with us`;
		return(
			<div className="container-auth">
				<div className="auth-information">
					<CSSTransition
						in={ pathname === '/login' }
						timeout={ 500 }
						classNames="example"
					>
						<div>
							<div className="auth-information-heading">{ currentPath }</div>
							<div className="auth-information-descr">{ authInfo }</div>
							<Link 
								to={ pathname === '/login' ? '/signup' : '/login' }
								className="button-view"
								role="button"
							>
								{ pathname === '/login' ? 'Sign Up' : 'Sign In' }
							</Link>
						</div>
					</CSSTransition>
				</div>
				<div className="wrapper-auth">
					<CSSTransition
						in={ pathname === '/login' }
						timeout={ 500 }
						classNames="example"
					>
						<div>
							<div className="auth-title">{ currentPath }</div>
							<SocialsAuthorization/>
							<span className="auth-or">{pathname === '/login' ? 'or use your email account:' : 'or use your email from registration:'}</span>
						</div>
					</CSSTransition>
					<CSSTransition
						in={ pathname === '/login' }
						timeout={ 500 }
						classNames="example"
					>
						<div>
							<Route exact path="/login" component={ SignIn } />
							<Route exact path="/signup" component={ SignUp } />
						</div>
					</CSSTransition>
				</div>
			</div>
		);
	}
}

export default withRouter(Auth);