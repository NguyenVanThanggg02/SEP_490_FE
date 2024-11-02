import React, { useState } from 'react';
import "../style/Chatboxx.css";

function Chatbox({ messages = [], chatDetails, onSendMessage }) {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">Tin nhắn</h5>
          <div>
            <i className="fas fa-search me-3"></i>
            <i className="fas fa-cog"></i>
          </div>
        </div>
        <div className="d-flex mb-4">
          <button className="btn btn-dark me-2">Tất cả</button>
          <button className="btn btn-light">Chưa đọc</button>
        </div>
        
        {messages.map((msg, index) => (
          <div className="message" key={index}>
            <img alt={msg.senderName} height="50" src={msg.avatarUrl} width="50" />
            <div className="message-content">
              <strong>{msg.senderName}</strong>
              <p>{msg.preview}</p>
            </div>
            <div className="message-time">{msg.time}</div>
          </div>
        ))}
      </div>

      {/* Chat Section */}
      <div className="chat">
        <div className="chat-header">
          <div className="d-flex align-items-center">
            <img alt={chatDetails.groupName} height="50" src={chatDetails.avatarUrl} width="50" />
            <h5 className="mb-0 ms-3">{chatDetails.groupName}</h5>
          </div>
        </div>
        <div className="chat-messages">
          <p className="text-muted">Hôm nay</p>
          <p className="text-muted">
            {chatDetails.introMessage} <a href="#">Tìm hiểu thêm</a>
          </p>
          {messages.map((msg, index) => (
            <div className="message" key={index}>
              <img alt={msg.senderName} height="50" src={msg.avatarUrl} width="50" />
              <div className="message-content">
                <p><strong>{msg.senderName} {msg.time}</strong></p>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Nhập tin nhắn"
            value={input}
            onChange={handleInputChange}
          />
          <i className="fas fa-paper-plane" onClick={handleSendMessage}></i>
        </div>
      </div>

      {/* Details Section */}
      <div className="details">
        <div className="details-header">
          <h5 className="mb-0">Thông tin chi tiết</h5>
          <i className="fas fa-times"></i>
        </div>
        <div className="message">
          <img alt={chatDetails.groupName} height="50" src={chatDetails.avatarUrl} width="50" />
          <div className="message-content">
            <strong>{chatDetails.groupName}</strong>
            <p>{chatDetails.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
