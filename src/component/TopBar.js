import React, { useState,useContext, useEffect } from 'react'
import { motion } from 'framer-motion';
import Avatar from "./img/avatar.png"
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { MdAdd, MdLogout } from "react-icons/md";
import { AuthContext } from '../AuthContext';
import { Divider } from '@mui/material';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';


const TopBar = () => {
    const [isMenu,setIsMenu] = useState(false)
    const {user, logout } = useContext(AuthContext);
    const [checked,setChecked] = useState()

  
    const showMenu = () =>{
        setIsMenu(!isMenu)
        return;
    }
    
    const handleSwitchChange = (event) => {
    
        setChecked(event.target.checked);
        
    };
    
  useEffect(()=>{
  
    const getRsbToken =  ()=>{
        const cookies = new Cookies()
        const token = cookies.get('access')
        const res = axios.get('http://127.0.0.1:8000/getrsbuser/',{
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        })
        console.log(res)
        res
        .then(response =>{
            if(response.status === 200){
                console.log(response.data.username,response.data.password)
                const rsbres =  axios.get('http://192.168.50.158:8073/jderest/v2/tokenrequest',{
                    auth: {
                            username:response.data.username,
                            password:response.data.password
                        },
                        headers: { 
                            'Content-Type': 'application/json', 
                            'Access-Control-Allow-Origin':'*'
                        },
                        withCredentials: false
                    }
                    )
                rsbres
                    .then(rsbres =>{
                        if(rsbres.status === 200){
                            console.log(rsbres.data.userInfo.token)
                            cookies.set('rsbtoken',rsbres.data.userInfo.token)
                            toast.success("Token generated. And connected to JD.")
                        }
                    })
                    .catch(error =>{
                        if (error.response && error.response.status === 401) {
                            toast.warning("un-authorized access")
                        } else {
                            toast.warning("Token not generated. Try again.")
                        }
                        
                    })
            

                }
                
        
        

            }
            
        )
        .catch(error =>{
            console.log(error)
            toast.warning("Session expired. Please logout and login again.")
           logout()
        })
            
        }
      
      
       
  
    if(checked){
        getRsbToken()
    }
   
  },[checked,logout])
  return (
    <header className='h-[10%] md:h-[10%] xsm:h-[20%] bg-gray-100 w-full md:p-6 md:px-4 sm:p-2 sm:px-2'>
    {/* Header desktop view */}
        <div className='hidden md:flex h-full w-full items-center justify-between'>
       <p className=' font-bold'>RSB PVT LTD</p>

       
            <div className="flex items-center gap-8">
          
                <div className="relative cursor-pointer">
              
                <motion.img whileTap={{scale:0.6}} 
                    src={Avatar} 
                    alt="userProfile" 
                    className='w-10 min-w-[40px] min-h-[40px] drop-shadow-2xl rounded-full' 
                    onClick={showMenu}
                    />
                    {
                        isMenu && (
                        <motion.div 
                            initial={{opacity : 0, scale : 0.6}}
                            animate={{opacity : 1, scale : 1}}
                            exit={{opacity : 0, scale : 0.6}}
                             className="absolute z-10 flex flex-col w-40 bg-gray-50 shadow-xl top-12 right-0">
                        <p className='px-4 py-2 flex items-center gap-3 hover:bg-slate-200 transition-all duration-100 ease-in-out'>
                       USER : {user.username} 
                        </p>
                        <Divider />
                        <button onClick={()=>logout()} className='px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-200 transition-all duration-100 ease-in-out'>
                        Logout <MdLogout />
                        </button>
                    </motion.div>
                        )
                    }
                    
                </div>
                
            </div>
        </div>


    {/* Header mobile view */}
    <div className='flex bg-gray-400 h-full w-full items-center p-2 justify-between md:hidden'>
      <p></p>
            <div className="flex items-center gap-4 pr-2 justify-center">
               
                <div className="relative cursor-pointer">
                <motion.img whileTap={{scale:0.6}} 
                    src={ Avatar} 
                    alt="userProfile" 
                    className='w-10 min-w-[40px] h-10 min-h-[40px] drop-shadow-2xl rounded-full' 
                    onClick={showMenu}
                    />
                    {
                        isMenu && (
                        <motion.div 
                            initial={{opacity : 0, scale : 0.6}}
                            animate={{opacity : 1, scale : 1}}
                            exit={{opacity : 0, scale : 0.6}}
                             className="absolute flex flex-col w-40 bg-gray-50 shadow-xl top-12 right-0">
                        <p className='px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-200 transition-all duration-100 ease-in-out'>
                        Add Items <MdAdd />
                        </p>
                        <p  className='px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-200 transition-all duration-100 ease-in-out'>
                        Logout <MdLogout />
                        </p>
                    </motion.div>
                        )
                    }
                    
                </div>
                
            </div>
        </div>
    </header>
 
  )
}

export default TopBar
