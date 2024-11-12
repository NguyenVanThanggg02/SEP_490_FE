// UserContext.js
import React, { createContext, useEffect, useState } from "react";
import { useSocket } from './SocketContext';
import { useUser } from '../hooks/useUser';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    username: "",
    fullname: "",
    role: "",
    firstLogin: false,
  });
  const [userId,setUserId]=useState("")

  const socket = useSocket();
  const { user: userHook, refreshUser } = useUser();

  useEffect(() => {
    window.addEventListener("storage", refreshUser);
    return () => {
      window.removeEventListener("storage", refreshUser);
    };
  }, []);

  useEffect(() => {
    socket.emit('register', userHook);
  }, [userHook]);

  return (
    <UserContext.Provider value={{ user, setUser,userId,setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
