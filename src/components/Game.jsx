import axios from 'axios'
import React, { useState } from 'react'
import Teams from './Teams'

function Game(props) {

    const [display1,setDisplay1]=useState(true)

    const handleClick1 = () =>{
        axios.get(`/api/killGame`)
        .then(res=>window.location.reload(false))
        .catch(err=>console.log(err))
    }


    
  return (
    <div >
        <div>
            <Teams 
            nickname={props.nickname} 
            admin={props.admin=='no admin yet'? props.nickname : props.admin}
            />
        </div>
        {display1 &&<div>

            {props.nickname==props.admin||props.admin=='no admin yet' && 
            <button
            onClick={handleClick1}
            >End current game
            </button>}
        </div>}
    </div>

  )
}

export default Game