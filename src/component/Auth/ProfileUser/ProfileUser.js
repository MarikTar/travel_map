import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Storage from "../../Storage/Storage";

export default class ProfileUser extends Component {
  static propTypes = {
    photoURL: PropTypes.object
  };

  state = {
    pictureFile: null,
    loaded: false,
    url: null
  };

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (this.state.loaded !== nextState.loaded) {
      Storage.addStore(nextState.pictureFile, nextProps.user, nextState.loaded, this.setUrl);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.user.photoURL !== this.props.user.photoURL) {
      this.updateUserProfile();
    }
  }

  render() {
    return(
      <div className="profile">
        <img src={ this.props.user.photoURL } alt=""/>
        <input
          accept="image/jpeg,image/png"
          type="file"
          multiple={ false }
          className="upload-file"
          onChange={ this.handlerChange }
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

  setUrl = value => {
    this.setState({url: value});
  };

  updateUserProfile() {
    const { url } = this.state;

    this.props.user.updateProfile({photoURL: url});
  };
}
