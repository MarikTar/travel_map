import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-slider';
import Cropper from 'react-avatar-editor';
import './modal.css';

export default function Modal(props) {
	const { avatar, onCancel, onSave, onRef, rangeZoom, onChangeZoom, updateFile } = props;

	return(
		<div className='modal-mask'>
			<div className='modal'>
				<Cropper
					ref={ onRef }
					image={ avatar }
					width={ 250 }
					height={ 250 }
					border={ 0 }
					borderRadius={ 250 * 2 }
					color={ [255, 255, 255, 0.6] }
					scale={ rangeZoom }
					rotate={ 0 }
				/>
				<span className="crop-title">Select an area for your profile photo</span>
				<InputRange 
					axis="x"
					x={ rangeZoom }
					xmin={ 1 }
					xmax={ 10 }
					xstep={ 0.1 }
					onChange={ ({ x }) => onChangeZoom(x) }
				/>
				<div className="crop-controls">
					<button className="crop-control" onClick={ onCancel }>Cancel</button>
					<button className="crop-control" onClick={ onSave }>{ updateFile ? <span className="upload-loading crop-loading" /> : null }Save</button>
				</div>
			</div>
		</div>
	);
}

Modal.propTypes = {
	avatar: PropTypes.string,
	onCancel: PropTypes.func,
	onSave: PropTypes.func,
	onRef: PropTypes.func,
	rangeZoom: PropTypes.number,
	onChangeZoom: PropTypes.func,
	updateFile: PropTypes.bool
}