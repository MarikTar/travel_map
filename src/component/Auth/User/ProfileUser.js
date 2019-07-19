import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Storage from "../../Storage/Storage";

export default class ProfileUser extends Component {
  static propTypes = {
    photoURL: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      pictureFile: null,
      loaded: false
    };
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (this.state.loaded !== nextState.loaded) {
      Storage.addStore(nextState.pictureFile, nextProps.user, nextState.loaded);
      console.log('foo');
    }
  }

  render() {
    const { photoURL } = this.props.user;

    return(
      <div className="profile">
        {photoURL ? <img src={ photoURL } alt=""/> : null}
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
  }
}
