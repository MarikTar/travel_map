import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import './popup.css';

export default class Popup extends Component {
	state = {
		isOpen: true,
		showInstallMessage: false
	}

	componentDidMount() {
		this.addMessage();
	}

	handlerClosePopup = () => {
		this.setState({isOpen: false})
	}

	isIphone() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
  }

  isInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator.standalone);
  }

  addMessage() {
    if (this.isIphone() && !this.isInStandaloneMode()) {
      this.setState({ showInstallMessage: true });
    }
  }

	render() {
		const { isOpen, showInstallMessage } = this.state;

		return(
			<>
				{ isOpen && showInstallMessage && !this.props.authenticated ? this.messageView() : null }
			</>
		)
	}

	messageView() {
		return(
			<CSSTransition
				in={ this.state.showInstallMessage && this.props.loader }
				timeout={ 400 }
				classNames="apple-message"
				unmountOnExit
				appear
			>
				<div className="popup-message" onClick={ this.handlerClosePopup }>
					Install this web App on your iPhone:tab <span className="icon-upload" /> and then Add to Home Screen.<br/>
					<span>To close the popup, click on it</span>
				</div>
			</CSSTransition>
		)
	}
}