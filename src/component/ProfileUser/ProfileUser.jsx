import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Storage from "../Storage/Storage";

export default class ProfileUser extends Component {
  static propTypes = {
    photoURL: PropTypes.object
  };

 constructor(props) {
   super(props);

   this.state = {
     pictureFile: null,
     loaded: false,
     url: null,
     success: false
   };

   this.fileInput = React.createRef();
 }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (this.state.loaded !== nextState.loaded && nextState.pictureFile) {
      Storage.addStore(nextState.pictureFile, nextProps.user, nextState.loaded, this.setUrl);
    }

    if (!nextState.url) {
      Storage.getStoreDefaultAvatar(this.setUrl);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.user.photoURL !== this.props.user.photoURL) {
      this.updateUserProfile();
    }

    if (this.state.success && localStorage.getItem("avatar") === null) {
      this.addLocalStorage(this.state.url);
    }
  }

  addLocalStorage(value) {
    localStorage.setItem('avatar', JSON.stringify(value));
    this.forceUpdate();
  }

  getLocalStorage() {
    return localStorage.getItem("avatar").replace(/\"/g, "");
  }

  render() {
    const { photoURL } = this.props.user;
    console.log(this.props.user.photoURL);

    return(
      <div>
        {
          (this.state.success || !photoURL) || !!localStorage.getItem("avatar") ?
            <button
              type="button"
              title="add profile photo"
              className="upload-file"
              onClick={ this.handlerClick }
            >
              <img src={ !photoURL ? this.getLocalStorage() : photoURL } alt="add profile photo"/>
            </button> : null
        }
        <input
          accept="image/jpeg,image/png"
          type="file"
          multiple={ false }
          className="input-file"
          onChange={ this.handlerChange }
          ref={ this.fileInput }
        />
      </div>
    )
  }

  handlerChange = evt => {
    const files = evt.target.files[0];

    this.setState({
      pictureFile: files,
      loaded: true
    });
  };

  handlerClick = () => {
    this.fileInput.current.click();
  };

  setUrl = value => {
    this.setState({
      url: value,
      loaded: false,
      success: true
    });
  };

  updateUserProfile() {
    const { url } = this.state;

    this.props.user.updateProfile({photoURL: url});
  };
}
