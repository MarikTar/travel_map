import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PhotoGallery from '../PhotoGallery/PhotoGallery';
import DragDropFile from '../DragDrop/DragDrop';
import { Scrollbars } from 'react-custom-scrollbars';
import ServiceDB from '../../Services/ServiceDB';
import ServiceFirebaseStore from '../../Services/ServiceFirebaseStore';
import store from '../../Storage/store';
import './style.css';

export default class Upload extends Component {
  static propTypes = {
    user: PropTypes.object,
    countryID: PropTypes.object,
    showUploader: PropTypes.bool,
    onClose: PropTypes.func,
    onUpdateCountrys: PropTypes.func,
    countrysID: PropTypes.array,
    uploadedFile: PropTypes.bool
  }

  serviceDB = new ServiceDB();
  serviceStore = new ServiceFirebaseStore();

  removeItem = [];

  state = {
    uploaded: false,
    selected: false,
    selectItem: false,
    storeEmpty: false,
    loading: false
  }

  componentDidMount() {
    const { countrysID } = this.props;

    if (countrysID.length) {
      countrysID.forEach(id => this.serviceStore.getCollectionPhoto(
        id, 
        true, 
        this.updateComponent, 
        countrysID,
        false,
        null
        ));
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { id } = nextProps.countryID;

    if (nextProps.showUploader !== this.props.showUploader && !nextState.uploaded) {
      this.serviceStore.getCollectionPhoto(
        id,
        nextProps.uploadedFile,
        this.updateComponent, 
        nextProps.countrysID,
        true,
        nextProps.onUpdateCountrys
        );
        store.forEach(item => {
          if (item.hasOwnProperty([`code_${id.toLowerCase()}`]) && item[`code_${id.toLowerCase()}`].length || (item.hasOwnProperty([`code_${id.toLowerCase()}`]) && nextProps.uploadedFile)) {
            this.setState({loading: true});
          }
        })
    }

    if (!nextProps.showUploader && nextState.uploaded) {
      this.setState({
        uploaded: false
      });
    }
  }

  addImages = fileList => {
    const { id } = this.props.countryID;
    Object.values(fileList)
      .forEach(file => {
        this.serviceStore.addFileStore(id, file)
        .then(() => {
          this.serviceStore.getCollectionPhoto(
            id, 
            true, 
            this.updateComponent,
            this.props.countrysID, 
            true, 
            this.props.onUpdateCountrys
          );
        })
      });

    this.setState({
      loading: true
    })
  }

  handlerSelected = () => {
    this.setState({
      selected: !this.state.selected,
      selectItem: false

    });

    this.removeItem = [];
  }

  handlerSelectItem = name => {
    if (!this.removeItem.includes(name)) {
      this.removeItem.push(name); 
    } else {
      this.removeItem.splice(
        this.removeItem.findIndex(el => el === name), 1
      )
    }

    this.setState({
      selectItem: !!this.removeItem.length
    })
  }

  handlerRemoveItem = () => {
    const { countryID } = this.props;
    const id = `code_${countryID.id.toLowerCase()}`;
    this.serviceStore.removeStorageFile(countryID, this.removeItem);
    
    store.forEach(item => {
      if (item.hasOwnProperty(id)) {
        item[id].splice(
          item[id]
          .findIndex(element => this.removeItem.includes(element.name)), 
          this.removeItem.length
        );
      }
    });

    this.serviceDB.deleteFromLocationDB(
      countryID, 
      this.updateComponent,
      this.props.onUpdateCountrys,
      this.props.countrysID
    );
  }

  updateComponent = (
    uploaded, 
    selectItem, 
    storeEmpty,
    selected = false,
    loading
    ) => {

    this.setState({
      uploaded,
      selectItem,
      storeEmpty,
      selected,
      loading
    });
  }

  uploaderView() {
    const { selected, selectItem, storeEmpty, loading } = this.state;

    return(
      <div className="uploader-mask">
        <div className="uploader">
          <div className="upload-head">
            <div className="constroll-item">
              <button
                className="select"
                onClick={ this.handlerSelected }
              >
                { !selected ? 'Select' : 'Cancel' }
              </button>
              { selected ?
                <button
                  className="basket"
                  disabled={ !selectItem }
                  onClick={ this.handlerRemoveItem }
                >
                  <span className="icon-basket" />
              </button> : null }
            </div>
            <div className="head-title">Photos</div>
            { loading && storeEmpty ? <span className="upload-loading" /> : null }
            <button 
              onClick={ this.props.onClose } 
              className="upload-close"
            >
              <span className="uload-icon-close" />
            </button>
          </div>
          <Scrollbars
            style={{ height: "calc(100% - (46px + 145px))" }}
          >
            <div className="upload-content">
              <div className="gallery-wrapper">
              { storeEmpty ?
                <PhotoGallery
                  countryID={ this.props.countryID }
                  user={ this.props.user }
                  isSelected={ selected }
                  onSelectItem={ this.handlerSelectItem }
                />
                : <div className="upload-title">
                    You can upload your photos here.
                    <span className="pic-info" />
                    { loading && !this.state.uploaded ? 'loading...' : null }
                  </div>
                }
              </div>
            </div>
          </Scrollbars>
          <DragDropFile 
            onAddPhoto={ this.addImages }
          />
        </div>
      </div>
    );
  }

  uploaderInformationView() {
    return(
      <div className="upload-information">
        <div className="upload-title">You can upload your photos here.</div>
        <span className="pic-info" />
      </div>
    )
  }

  render() {
    const { showUploader } = this.props;
    return(
      <>
        { showUploader ? this.uploaderView() : null }
      </>
    )
  }
}