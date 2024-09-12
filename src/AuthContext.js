import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode' // import dependency
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';
export const AuthContext = createContext();
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://127.0.0.1:8000';
export const AuthProvider = ({ children }) => {
    
    const cookies = new Cookies()
    const usertoken = cookies.get('access')
    let userdata = null
    if(usertoken){
        userdata = jwtDecode(usertoken)
    }
  
    const [user, setUser] = useState(userdata);
   console.log(user)
    // const [csrf,setCsrf] = useState('')
    const [token,setToken] = useState(cookies.get('access'))
    useEffect(() => {
        const ncookies = new Cookies()
       /* const usetoken = ncookies.get('access')*/
        const fetchUser = async () => {
         
            try {
              
                const res = await axios.get('/api/user/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    withCredentials: true
                });
                if(res.data.is_active){
                    setUser(res.data);

                }
                else{
                    setUser(null);
                    ncookies.remove('access');
                    ncookies.remove('refresh');
                    toast.warning("User is not active");
                }
                
            } catch (err) {
                
                setUser(null);
                ncookies.remove('access');
                ncookies.remove('refresh');
                toast.warning("session timeout.");
            }
        };
        fetchUser();
    }, [token]);
    // const getcsrftoken= async ()=>{
    //     const csrfres = await axios.get('http://127.0.0.1:8000/getcsrf/', { }, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         },
    //         withCredentials: true
    //     });
    //     console.log("csrf_token is ",csrfres)
    //     setCsrf(csrfres.token)
    // }
    const login = async (username, password) => {
        try{
            const res = await axios.post('http://127.0.0.1:8000/api/token/', { username, password }, {
                withCredentials: true
            });
            
            if(res.status === 200){
                cookies.set('access', res.data.access);
                cookies.set('refress', res.data.refresh);
                setUser(res.data);
                setToken(res.data.access)
                
                toast.success("Congrats You are in");
               
            }
            else if(res.status === 401){
                toast.warning("Invalid Username or Password");
            }
        }
        catch{
            toast.warning("Invalid Username or Password");
        }
      
    };
    const logout = async () => {
        try {
           
           
            await axios.post('http://127.0.0.1:8000/api/logout/', {}, {
                headers: {
                'Authorization': `Bearer ${token}`
            },
                withCredentials: true
            });
            setUser(null);
            cookies.remove('access');
            cookies.remove('refresh');
        } catch (err) {
            console.error('Logout failed', err);
            setUser(null);
            cookies.remove('access');
            cookies.remove('refresh');
        }
    };

    return (
        <AuthContext.Provider value={{ user,token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};