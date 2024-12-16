import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';
import { Constants } from '../utils/constants';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const socket = io(`${Constants.apiHost}`);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
