import React, { useState } from 'react'
import Chat from './Chat'




function Lobby(props) {

  const [display1,setDisplay1]=useState(true)
  const [display2,setDisplay2]=useState(false)

  const handleClick1 = () =>{
    setDisplay1(false)
    setDisplay2(true)
  }
  
  return (
    
    <>

    {display1 && <div>
      <h1>Welcome, {props.nickname+"!"}</h1>
      <div>
        <button
        onClick={handleClick1}
        >Join chat</button>
      </div>
    </div>}
    {display2 && <Chat nickname={props.nickname}/>}
    </>
  )
}

export default Lobby