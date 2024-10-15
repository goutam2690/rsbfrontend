import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { AuthContext } from '../AuthContext';
import { FaKey, FaUser } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { user, login } = useContext(AuthContext);  // Access AuthContext to get `login` and `user`
    
    useEffect(() => {
        if (user) {
            navigate('/home');  // Redirect to home if already logged in
        }
    }, [user, navigate]);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Handle form submission for login
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent form refresh
        await login(username, password);  // Call login function from context
        setUsername("");
        setPassword("");
        navigate('/home');  // Navigate to home on success
    };

    return (
        <section className="flex h-screen justify-center items-center bg-[#356c7c]">
            {
                user ?
                <Box sx={{ display: 'flex' }}>
                    <CircularProgress color="secondary" />
                </Box>
                :
                <div className="container">
                    <div className="grid grid-rows-1 bg-no-repeat bg-center">
                        <div className="grid grid-cols-1 justify-center justify-items-center mt-4">
                            <div className="bg-white shadow-md rounded-md border-0 w-[280px] p-4">
                                <div className="text-center md:text-center">
                                    <h1 className="mb-0 text-lg font-medium">
                                        RSB PVT LTD
                                    </h1>
                                    <div className="flex flex-col justify-center items-center ">
                                        <div className="w-full p-4">
                                            <form onSubmit={handleSubmit}> {/* Use onSubmit */}
                                                <div className="flex items-start flex-col w-full mb-2">
                                                    <label htmlFor="email" className="font-medium text-sm mb-2">Username</label>
                                                    <div className="flex flex-wrap justify-center items-center relative border-2 rounded-lg w-full h-10">
                                                        <FaUser className='font-medium w-1/6' />
                                                        <input 
                                                            type="text" 
                                                            value={username} 
                                                            name="username" 
                                                            className="block border-l-2 border-indigo-500 p-2 w-5/6 h-full" 
                                                            onChange={(e) => setUsername(e.target.value)} 
                                                            required  // Add required attribute
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-start flex-col w-full mt-4">
                                                    <label htmlFor="password" className="font-medium text-sm mb-2">Password</label>
                                                    <div className="flex flex-wrap justify-center items-center relative border-2 rounded-lg w-full h-10">
                                                        <FaKey className='font-medium w-1/6' />
                                                        <input 
                                                            type="password" 
                                                            value={password} 
                                                            name="password" 
                                                            onChange={(e) => setPassword(e.target.value)} 
                                                            className="block p-2 w-5/6 border-l-2 border-indigo-500 h-full" 
                                                            required  // Add required attribute
                                                        />
                                                    </div>
                                                </div>
                                                <div className="w-full p-4">
                                                    <motion.input 
                                                        whileTap={{ scale: 0.6 }}  
                                                        type="submit"  // Change from onClick to type="submit"
                                                        className="text-white bg-gray-800 font-medium text-center cursor-pointer text-sm py-2 px-2 rounded-md w-full"
                                                        value="Sign In" 
                                                    />
                                                </div>
                                            </form>
                                        </div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </section>
    );
};

export default Login;
