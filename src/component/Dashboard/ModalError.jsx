import React from 'react';
import PropTypes from 'prop-types';

export default function modalContainer(props) {
	const { text } = props;

	return(
		<div>
			<button 
				className="modal-close"
			>
				Close
			</button>
			<div>{ text }</div>
		</div>
	)
}