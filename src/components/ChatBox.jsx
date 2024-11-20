import React, { useEffect, useState, useRef } from "react";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import { getUser } from "../Api/UserRequests";
import { addMessage, getMessages } from "../Api/MessageRequests";
import "../style/chatbox.css";
import { Avatar } from "@mui/material";

const ChatBox = ({ chat, currentUser, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();

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

    if (chat) getUserData();
  }, [chat, currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (chat) {
        try {
          const { data } = await getMessages(chat._id);
          setMessages(data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    fetchMessages();
  }, [chat]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });

    try {
      const { data } = await addMessage(message);
      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage("");
    } catch (error) {
      console.log("Message sending error: ", error);
    }
  };

  useEffect(() => {
    if (receivedMessage && chat && receivedMessage.chatId === chat._id) {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat]);

  return (
    <div className="ChatBox-container" style={{ height: "100vh" }}>
      {chat ? (
        <>
          {/* Header section */}
          <div
            className="chat-header d-flex justify-content-between"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 10px",
            }}
          >
            {/* User Avatar and Name */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={userData?.avatar || "/default-avatar.png"}
                sx={{ width: 56, height: 56 }}
              />
              <span
                style={{
                  marginLeft: "10px",
                  fontSize: "1rem",
                  fontWeight: "500",
                }}
              >
                {userData?.fullname}
              </span>
            </div>

            {/* Product Card Section */}
            <div
              className="product-card"
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "5px 10px",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                maxWidth: "500px",
                height: "100px",
                marginRight: "20px",
              }}
            >
              <img
                src={chat.spacesId?.images[0].url || "/default-product.png"}
                alt="Product"
                style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "8px",
                  marginRight: "10px",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p
                  style={{
                    margin: 0,
                    color: "#859b50",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                  }}
                >
                  {chat.spacesId?.name || "N/A"}
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "gray" }}>
                  {chat.spacesId?.location || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Body */}
          <div
            className="chat-body"
            style={{ overflowY: "auto", maxHeight: "400px", padding: "1.5rem" }}
          >
            {messages.map((message) => (
              <div
                ref={scroll}
                key={message._id}
                className={
                  message.senderId === currentUser ? "message own" : "message"
                }
              >
                <span>{message.text}</span>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
          </div>

          {/* Message Sender */}
          <div
            className="chat-sender"
            style={{ display: "flex", alignItems: "center" }}
          >
            <InputEmoji value={newMessage} onChange={setNewMessage} />
            <div
              className="send-button button"
              onClick={handleSend}
              style={{ marginLeft: "10px" }}
            >
              Send
            </div>
          </div>
        </>
      ) : (
        <span className="chatbox-empty-message">
          Nhấn vào cuộc trò chuyện để bắt đầu cuộc trò chuyện...
        </span>
      )}
    </div>
  );
};

export default ChatBox;
