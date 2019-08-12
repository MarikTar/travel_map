import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import ServiceFirebaseStore from '../../Services/ServiceFirebaseStore';
import Modal from '../Modal/Modal';

export default class ProfileUser extends Component {
  static propTypes = {
    photoURL: PropTypes.object
  };

  serviceStore = new ServiceFirebaseStore();
  fileInput = React.createRef();
  inputFile = React.createRef();
  uid = this.props.user.uid;

  state = {
    pictureFile: null,
    defaultAvatar: null,
    updateFile: false,
    cropperOpen: false,
    img: null,
    zoom: 1,
    isOpen: false
  };

  componentDidMount() {
    if (!this.state.defaultAvatar && !this.props.user.photoURL) {
      this.serviceStore.getStoreDefaultAvatar(this.setDefaultAvatar);
    }
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (nextState.pictureFile !== this.state.pictureFile) {
      this.serviceStore.updateProfileUserAvatar(nextState.pictureFile, this.updateUserProfile);
    }
  };

  handlerChange = evt => {
    const files = evt.target.files[0];
    const url = window.URL.createObjectURL(files);
    this.fileInput.current.value = '';
    this.handlerResetZommSlider();

    this.setState({
      cropperOpen: true,
      img: url,
      isOpen: true,
      updateFile: false
    });
  };

  handlerClick = () => {
    this.fileInput.current.click();
  };

  handlerSave = () => {
    if (this.editor) {
      const canvasScaled = this.editor.getImageScaledToCanvas();

      canvasScaled.toBlob(blob => {
        // const cropperImg = canvasScaled.toDataURL();

        this.setState({
          pictureFile: blob,
          cropperOpen: false,
          updateFile: true
        });
      });
    }
  };

  handlerCancel = () => {
    this.handlerResetZommSlider();

    this.setState({
      cropperOpen: false,
      isOpen: false
    });
  };

  handlerZoomSlider = value => {
    this.setState({ zoom: value });
  };

  handlerResetZommSlider = () => {
    this.setState({ zoom: 1 });
  };

  setEditorRef = editor => this.editor = editor;

  updateUserProfile = url => {
    if (url) {
      this.setState({
        isOpen: false
      });
    }
  };

  setDefaultAvatar = url => {
    if (url) {
      this.setState({ defaultAvatar: url });
    }
  }

  render() {
    const { photoURL } = this.props.user;
    const { defaultAvatar, img, zoom, isOpen, updateFile } = this.state;

    return(
      <>
        <CSSTransition
          in={ isOpen }
          timeout={ 300 }
          classNames="popup"
          unmountOnExit
        >
          <Modal 
            onCancel={ this.handlerCancel }
            onSave={ this.handlerSave }
            onRef={ this.setEditorRef }
            avatar={ img }
            rangeZoom={ zoom }
            onChangeZoom={ this.handlerZoomSlider }
            updateFile={ updateFile }
          /> 
        </CSSTransition>
        <button
          type="button"
          title="add profile photo"
          className="upload-file profile-avatar"
          onClick={this.handlerClick}
        >
          <span className="profile-avatar-label">Add</span>
          { !(defaultAvatar || photoURL) ? <span className="upload-loading" /> : <img src={ !photoURL ? defaultAvatar : photoURL } alt="add profile"/> }
        </button>
        <input
          accept="image/jpeg,image/png"
          type="file"
          multiple={false}
          className="input-file"
          onChange={this.handlerChange}
          ref={this.fileInput}
        />
      </>
    )
  };
}