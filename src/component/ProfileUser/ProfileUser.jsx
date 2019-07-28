import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ServiceFirebaseStore from "../../Services/ServiceFirebaseStore";

export default class ProfileUser extends Component {
  static propTypes = {
    photoURL: PropTypes.object
  };

  FirebaseStore = new ServiceFirebaseStore();

  constructor(props) {
   super(props);

   this.state = {
     pictureFile: null,
     loaded: false,
     url: null,
     defaultAvatar: null
   };

   this.fileInput = React.createRef();
   this.uid = this.props.user.uid;
 }

  componentDidMount() {
    this.FirebaseStore.getStoreDefaultAvatar(this.setDefaultAvatar);
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (this.state.loaded !== nextState.loaded && nextState.pictureFile) {
      this.FirebaseStore.addFileStore(nextState.pictureFile, nextState.loaded, this.setUrl);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.user.photoURL !== this.props.user.photoURL) {
      this.updateUserProfile(); 
    }
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
      loaded: false
    });
  };

  setDefaultAvatar = (value) => {
    this.setState({defaultAvatar: value});
  }

  updateUserProfile() {
    const { url } = this.state;
    this.props.user.updateProfile({photoURL: url});
  };

  render() {
    const { photoURL } = this.props.user;
    const { defaultAvatar } = this.state;

    return(
      <div>
        <button
          type="button"
          title="add profile photo"
          className="upload-file"
          onClick={ this.handlerClick }
        >
          { (defaultAvatar || photoURL) ? <img src={ !photoURL ? defaultAvatar : photoURL } alt="add profile photo"/> : null }
        </button>
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
}