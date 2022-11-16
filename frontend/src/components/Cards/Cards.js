import React from 'react';
import CardItem from './CardItem';
import '../../assets/CSS/Cards.css'

function Cards() {
  return (
    <div className='cards'>
      <h1></h1>
      <div className='cards__container'>
        <div className='cards__wrapper'>
          <ul className='cards__items'>
            <CardItem
              //src='assets/images/ .jpg'
              text='This is a card'
              label='CardLabel'
              //path='/'
            />
            <CardItem
              //src='assets/images/ .jpg'
              text='This is another card'
              label='CardLabel'
              //path='/'
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
