import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useSocket } from '../Context/SocketContext';

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken || storedToken.length === 0) {
      setUser(null);
      return null;
    }
    try {
      const decodedToken = jwtDecode(storedToken);
      setUser(decodedToken.user);
      return decodedToken.user;
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  const refreshUser = () => {
    getUser();
  };

  return { user, refreshUser };
};

export { useUser };
