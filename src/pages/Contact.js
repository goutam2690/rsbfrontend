import React from 'react'
import { useNavigate } from 'react-router-dom'

function Contact() {
    const navigate = useNavigate()
    const gotoHome = ()=>{
        navigate('/home')
    }
  return (
    <>    
        <div>Contact</div>
        <button onClick={()=>gotoHome()}>Home</button>
    </>

  )
}

export default Contact