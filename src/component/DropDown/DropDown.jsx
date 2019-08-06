import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import FireBase from "../../Firebase/FireBase";

export default class DropDown extends Component {
	static propTypes = {
		onUpload: PropTypes.func
	}

	state = {
		isOpen: false
	}

	handlerToggleDropDawn = () => {
    this.setState({
			isOpen: !this.state.isOpen
		})
	}

	handlerCancelDropDown = () => {
		this.setState({
			isOpen: false
		});
	}
	
	dropDownView() {
		return(
			<ul className="dropdown-list">
				<li 
					className="dropdown-item item-upload"
					onClick={ this.props.onUpload }
				>
					<span className="dropdown-item-text"> Upload photo </span>
				</li>
				<li 
					className="dropdown-item item-logout"
					onClick={ () => FireBase.firebase.auth().signOut() }
				>
					<span 
						className="dropdown-item-text"> Log out </span>
				</li>
				<li 
					className="dropdown-item item-cancel"
					onClick={ this.handlerCancelDropDown }
				>
					<span className="dropdown-item-text"> Cancel </span>
				</li>
			</ul>
		)
	}

	render() {
		const { isOpen } = this.state;

		return(
		<>
			<button 
				className="btn-dropdown"
				onClick={ this.handlerToggleDropDawn }
				>
				<span className="icon-dots" />
			</button>
			{ isOpen ? this.dropDownView() : null }
		</>
		);
	}
}