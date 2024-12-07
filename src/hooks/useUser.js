import React, { useEffect, useState, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const useUser = () => {
  const [user, setUser] = useState(null);

  const getUser = useCallback(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (!storedToken) {
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
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const refreshUser = getUser;

  return { user, refreshUser };
};

export { useUser };
