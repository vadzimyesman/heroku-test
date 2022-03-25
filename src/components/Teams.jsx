import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Chat from './Chat'


function Teams(props) {

    const [redSpy, setRedSpy]=useState("")
    const [blueSpy, setBlueSpy]=useState("")
    const [redAgents, setRedAgents]=useState([])
    const [blueAgents, setBlueAgents]=useState([])

    const [display1, setDisplay1]=useState(true)

    useEffect(()=>{
        tet1()
    },[])
    
    const tet1 = ()=>{
        axios.get(`/api/showTeams`)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            if (res.data.allPlayers.includes(props.nickname)){
                setDisplay1(false)
            }
            
        })
        .catch(err=>console.log(err))
      }      

    const addRedSpy=()=>{
        const body ={
            nickname:props.nickname
        }
        axios.post(`/api/redSpy`,body)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            setDisplay1(false)
        })
        .catch(err=>console.log(err))
    }

    const addBlueSpy=()=>{
        const body ={
            nickname:props.nickname
        }
        axios.post(`/api/blueSpy`,body)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            setDisplay1(false)
        })
        .catch(err=>console.log(err))
    }

    const addRedAgent=()=>{
        const body ={
            nickname:props.nickname
        }
        axios.post(`/api/redAgent`,body)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            setDisplay1(false)
        })
        .catch(err=>console.log(err))
    }

    const addBlueAgent=()=>{
        const body ={
            nickname:props.nickname
        }
        axios.post(`/api/blueAgent`,body)
        .then(res=>{
            console.log(res.data)
            setRedSpy(res.data.redSpy)
            setBlueSpy(res.data.blueSpy)
            setRedAgents(res.data.redAgents)
            setBlueAgents(res.data.blueAgents)
            setDisplay1(false)
        })
        .catch(err=>console.log(err))
    }

  return (
    <div className='gameTopDiv'>
        <div>
            <h3>Red team</h3>
            <h3>Spy: {redSpy}</h3>
            <h3>Agents:{redAgents}</h3>
            {display1 &&<div className='roleButtons'>
                <button
                onClick={addRedSpy}
                >Join as a spy</button>
                <button
                onClick={addRedAgent}
                >Join as an agent</button>
            </div>}
        </div>
        <h1>Admin is {props.admin}</h1>
        <div>
            <h3>Blue team</h3>
            <h3>Spy: {blueSpy}</h3>
            <h3>Agents: {blueAgents}</h3>
            {display1 &&<div className='roleButtons'>
                <button
                onClick={addBlueSpy}
                >Join as a spy</button>
                <button
                onClick={addBlueAgent}
                >Join as an agent</button>
            </div>}
        </div>
        <Chat nickname={props.nickname}/>
    </div>

  )
}

export default Teams
