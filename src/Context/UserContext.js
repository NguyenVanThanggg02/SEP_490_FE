// UserContext.js
import React, { createContext, useState } from "react";

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

  return (
    <UserContext.Provider value={{ user, setUser,userId,setUserId }}>
      {children}
    </UserContext.Provider>
  );
};
