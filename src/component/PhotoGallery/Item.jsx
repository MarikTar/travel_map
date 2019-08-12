import React, { Component } from 'react';
import Modal from 'react-awesome-modal';

export default class Item extends Component {
  state = {
    isOpenModal: false,
    select: false
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextProps.isSelected && this.state.select) {
      this.setState({select: false});
    }
  }

  handlerSelect = () => {
    this.setState({
      select: !this.state.select
    });

    this.props.onSelectItem(this.props.name);
  }

  handlerToggleModal = (evt) => {
    if (this.props.isSelected) {
      return;
    }

    this.setState({
      isOpenModal: !this.state.isOpenModal
    })
  }

  render() {
    const { url, name, isSelected } = this.props;
    return ( 
      <div className="gallery-item">
        <button
          className={ `btn-view ${ isSelected ? 'on-selected' : '' }` }
          onClick={ !isSelected ? this.handlerToggleModal : this.handlerSelect }
        >
          { this.state.select && isSelected ? <span className="select-check-icon" /> : null }
          <img src={ url } alt={ name }/>
        </button>
        <Modal 
          visible={ this.state.isOpenModal }
          width="500" height="500"
          effect="fadeInUp"
          onClickAway={ this.handlerToggleModal }
        >
          <div className='pop-image'><img src={ url } alt={ name }/></div>
          <button 
            className="close-modal"
            onClick={ this.handlerToggleModal } 
          >
            X
          </button>
        </Modal>
      </div>
    )
  }
}