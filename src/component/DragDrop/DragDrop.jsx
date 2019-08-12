import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.css';

export default class DropDown extends Component {
	static propTypes = {
		onAddPhoto: PropTypes.func
	}

	fileInput = React.createRef();

	onClick = () => {
    this.fileInput.current.click();
  };

	onChange(e) {
		let fileList = e.target.files;
		this.props.onAddPhoto(fileList);
  }

  onDragOverEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.add('dragover');
  }

  onDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    let rect = e.target.getBoundingClientRect();
    let dx = e.clientX - rect.left;
    let dy = e.clientY - rect.top;
    if ((dx < 0) || (dx >= rect.width) || (dy < 0) || (dy >= rect.height)) {
        e.target.classList.remove('dragover');
    };
  }

  onDragDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.classList.remove('dragover');
		let fileList = e.dataTransfer.files;
		this.props.onAddPhoto(fileList);
  }

	render() {
		return(
			<div 
				className="drag-file"
				onDragEnter={(e) => this.onDragOverEnter(e)}
				onDragOver={(e) => this.onDragOverEnter(e)}
				onDragLeave={(e) => this.onDragLeave(e)}
				onDrop={(e) => this.onDragDrop(e)}
			>
			<>
				<input 
					className="input-file"
					onChange={(e) => this.onChange(e)}
					type="file" 
					name="file" 
					multiple accept="image/*"
					ref={ this.fileInput }
					/>
				<div className="drag-info"> 
					Drag a file here or <span onClick={ this.onClick }>browse</span> for a file to upload
				</div>
			</>
		</div>
		);
	}
}