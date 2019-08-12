import React from 'react';
import Item from './Item';
import store from '../../Storage/store';
import './style.css';

export default function PhotoGellery(props)  {
  const { 
    countryID, 
    user, 
    isSelected, 
    onSelectItem } = props;
  return ( 
   <>
     { con(countryID, user, isSelected, onSelectItem) }
   </>
  )
}

const con = ({ id }, user, isSelected, onSelectItem) => {
  const countId = `code_${id.toLowerCase()}`;

  for (let item of store) {
    if (item.hasOwnProperty(countId)) {
      return item[countId].map(count => 
      <Item 
        key={ count.name }
        countryID={ id }
        user={ user }
        { ...count }
        isSelected = { isSelected }
        onSelectItem={ onSelectItem }
      />)
    }
  }
}