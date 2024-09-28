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

    const showMenu = () =>{
        setIsMenu(!isMenu)
        return;
    }
    

    
 
  return (
    <header className='h-[10%] md:h-[10%] xsm:h-[10%] bg-gray-100 w-full md:p-6 md:px-4 sm:p-2 sm:px-2'>
    {/* Header desktop view */}
        <div className='hidden md:flex h-full w-full items-center justify-between'>
       <p className=' font-bold'>RSB PVT LTD</p>

       
            <div className="flex items-center gap-8">
            <span className='px-4 py-2 pointer flex items-center gap-3 hover:bg-slate-200 transition-all duration-100 ease-in-out'>
                       <p className='text-center text-xs'> {user.username}<br /> {user.profile?user.profile.fname?user.profile.fname:"":""}</p>
                        </span>
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
    <div className='flex h-full w-full items-center p-2 justify-between md:hidden'>
    <p className=' font-bold'>RSB PVT LTD</p>
            <div className="flex items-center gap-4 pr-2 justify-center">
            <span className='px-4 py-2 pointer flex items-center gap-3 hover:bg-slate-200 transition-all duration-100 ease-in-out'>
                       <p className='text-center text-xs'> {user.username}<br /> {user.profile?user.profile.fname?user.profile.fname:"":""}</p>
                        </span>
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
