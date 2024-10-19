import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import Conversation from "../components/Conversation";
import ChatBox from "../components/ChatBox";
import { userChats } from "../Api/ChatRequests";
import "../style/chat.css";
const Chat = () => {
  const socket = useRef();
  const userId = localStorage.getItem("userId");

  const [chats, setChats] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  // Fetch user's chats
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(userId);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [userId]);

  // Connect to Socket.io
  useEffect(() => {
    socket.current = io("ws://localhost:9999", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.current.on("connect", () => {
      socket.current.emit("new-user-add", userId);
    });

    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  // Receive Message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceivedMessage(data);
    });
  }, []);

  // Check online status of chat members
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== userId);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <div className="Chat">
      <div className="Left-side-chat">
        <div className="Chat-container">
          <h2>Chats</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div key={chat._id} onClick={() => setCurrentChat(chat)}>
                <Conversation
                  data={chat}
                  currentUser={userId}
                  online={checkOnlineStatus(chat)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="Right-side-chat">
        <ChatBox
          chat={currentChat}
          currentUser={userId}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
