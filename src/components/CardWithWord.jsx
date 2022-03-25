import React from 'react'
import cardLogo from './images/card.png'

function CardWithWord(props) {
  return (
    <>
    
    <div
    className='article'
    style={{backgroundImage: `url(${cardLogo})`}}
    >
      <h2 className='header'>{props.randomWord}</h2>
    </div>

    </>
  )
}

export default CardWithWord