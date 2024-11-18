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

    if (chat) getUserData();
  }, [chat, currentUser]);

  // Fetch messages for the chat
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
      setMessages((prevMessages) => [...prevMessages, data]);
      setNewMessage("");
    } catch (error) {
      console.log("Message sending error: ", error);
    }
  };

  // Update messages when receiving new one
  useEffect(() => {
    if (receivedMessage && chat && receivedMessage.chatId === chat._id) {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat]);

  return (
    <div className="ChatBox-container" style={{height:'100vh'}}>
      {chat ? (
        <>
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  alt="Profile"
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name" style={{ fontSize: "0.9rem" }}>
                  <span>{userData?.fullname}</span>
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

          {/* Chat Body */}
          <div
            className="chat-body"
            style={{ overflowY: "auto", maxHeight: "400px", padding: "1.5rem" }}
          >
            {/* Product Information */}
            {chat?.spacesId && (
              <div
                className="product-info"
                style={{
                  padding: "5px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "5px",
                  marginBottom: "10px",
                }}
              >
                <strong style={{ fontSize: "1rem" }}>Product:</strong>
                <div style={{ fontSize: "0.8rem" }}>
                  <div>
                    <strong>Name:</strong> {chat.spacesId.name || "N/A"}
                  </div>
                  <div>
                    <strong>Location:</strong> {chat.spacesId.location || "N/A"}
                  </div>
                  <div>
                    <strong>Price:</strong>{" "}
                    {chat.spacesId.pricePerHour
                      ? `$${chat.spacesId.pricePerHour}`
                      : "N/A"}
                  </div>
                  {chat?.spacesId?.images &&
                    chat.spacesId?.images?.length > 0 && (
                      <div>
                        <strong>Image:</strong>
                        <img
                          src={chat?.spacesId?.images?.[0].url} // Use the first image of the product
                          alt="Product"
                          style={{
                            width: "80px",
                            borderRadius: "5px",
                            marginTop: "5px",
                          }} // Adjust size and style of the image
                        />
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Messages */}
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

          {/* Message Sender */}
          <div
            className="chat-sender"
            style={{ display: "flex", alignItems: "center" }}
          >
            <InputEmoji value={newMessage} onChange={setNewMessage} />
            <div
              className="send-button buttonn"
              onClick={handleSend}
              style={{ marginLeft: "10px" }}
            >
              Gửi
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
