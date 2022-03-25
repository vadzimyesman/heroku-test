import React, { useState } from 'react'
import Teams from './Teams'

function Game(props) {



    
  return (
    <div >
        <div>
            <Teams 
            nickname={props.nickname} 
            admin={props.admin=='no admin yet'? props.nickname : props.admin}
            />
        </div>

    </div>

  )
}

export default Game