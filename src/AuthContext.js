import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";

export const AuthContext = createContext();

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://143.110.243.227";

export const AuthProvider = ({ children }) => {
  const cookies = new Cookies();
  const usertoken = cookies.get("access");
  let userdata = null;

  if (usertoken) {
    userdata = jwtDecode(usertoken);
  }

  const [user, setUser] = useState(userdata);
  const [token, setToken] = useState(cookies.get("access"));

  // Fetch user details if token is present
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        if (res.data.is_active) {
          setUser(res.data);
        } else {
          logout();
          toast.warning("User is not active");
        }
      } catch (err) {
        logout();
        toast.warning("Session timeout.");
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  // Login function
  const login = async (username, password) => {
    try {
      const res = await axios.post(
        "/api/token/",
        { username, password },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        cookies.set("access", res.data.access);
        cookies.set("refresh", res.data.refresh); // Fix typo from 'refress' to 'refresh'
        setUser(res.data);
        setToken(res.data.access);
        toast.success("Congrats You are in");
      } else if (res.status === 401) {
        toast.warning("Invalid Username or Password");
      }
    } catch (err) {
      toast.warning("Invalid Username or Password");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        "/api/logout/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setUser(null);
      cookies.remove("access");
      cookies.remove("refresh");
    } catch (err) {
      setUser(null);
      cookies.remove("access");
      cookies.remove("refresh");
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
