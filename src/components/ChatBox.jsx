import React, { useEffect, useState, useRef } from "react";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { getUser } from "../Api/UserRequests";
import { addMessage, getMessages } from "../Api/MessageRequests";
import "../style/chatbox.css";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();

  // Fetch user data for the chat header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // Fetch messages for the chat
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  // Scroll to the last message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send new message
  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    const receiverId = chat.members.find((id) => id !== currentUser);

    // Send message to socket server
    setSendMessage({ ...message, receiverId });

    // Save message to database
    try {
      const { data } = await addMessage(message);
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (error) {
      console.log("Message sending error: ", error);
    }
  };

  // Update messages when receiving new one
  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat]);

  return (
    <div className="ChatBox-container">
      {chat ? (
        <>
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  src={
                    userData?.profilePicture
                      ? process.env.REACT_APP_PUBLIC_FOLDER +
                        userData.profilePicture
                      : process.env.REACT_APP_PUBLIC_FOLDER +
                        "defaultProfile.png"
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name" style={{ fontSize: "0.9rem" }}>
                  <span>
                    {userData?.firstname} {userData?.lastname}
                  </span>
                </div>
              </div>
            </div>
            <hr
              style={{
                width: "95%",
                border: "0.1px solid #ececec",
                marginTop: "20px",
              }}
            />
          </div>

          <div className="chat-body">
            {messages.map((message) => (
              <div
                ref={scroll}
                key={message._id}
                className={
                  message.senderId === currentUser ? "message own" : "message"
                }
              >
                <span>{message.text}</span>{" "}
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
          </div>

          <div className="chat-sender">
            <InputEmoji value={newMessage} onChange={setNewMessage} />
            <div className="send-button button" onClick={handleSend}>
              Send
            </div>
          </div>
        </>
      ) : (
        <span className="chatbox-empty-message">
          Tap on a chat to start conversation...
        </span>
      )}
    </div>
  );
};

export default ChatBox;
