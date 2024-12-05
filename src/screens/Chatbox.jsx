// import React, { useState, useRef, useEffect } from 'react';
// import "../style/Chatboxx.css";

// function Chatbox() {
//   const [input, setInput] = useState('');
//   const [messages, setMessages] = useState([
//     { senderName: "Alice", avatarUrl: "https://via.placeholder.com/50", preview: "Hello!", content: "Hello!", time: "10:00 AM" },
//     { senderName: "Bob", avatarUrl: "https://via.placeholder.com/50", preview: "How are you?", content: "How are you?", time: "10:05 AM" },
//   ]);

//   const chatDetails = {
//     groupName: "Default Group",
//     avatarUrl: "https://via.placeholder.com/50",
//     introMessage: "Welcome to the chat!",
//     description: "This is a default chat group description.",
//   };

//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleSendMessage = () => {
//     if (input.trim()) {
//       const newMessage = {
//         senderName: "You",
//         avatarUrl: "https://via.placeholder.com/50",
//         content: input,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       };
//       setMessages([...messages, newMessage]);
//       setInput('');
//     }
//   };

//   return (
//     <div className="chat-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h5 className="mb-0">Tin nhắn</h5>
//           <div>
//             <i className="fas fa-search me-3" aria-label="Search"></i>
//             <i className="fas fa-cog" aria-label="Settings"></i>
//           </div>
//         </div>
//         <div className="d-flex mb-4">
//           <button className="btn btn-dark me-2">Tất cả</button>
//           <button className="btn btn-light">Chưa đọc</button>
//         </div>
        
//         {messages.map((msg, index) => (
//           <div className="message" key={index}>
//             <img alt={msg.senderName} height="50" src={msg.avatarUrl} width="50" />
//             <div className="message-content">
//               <strong>{msg.senderName}</strong>
//               <p>{msg.preview}</p>
//             </div>
//             <div className="message-time">{msg.time}</div>
//           </div>
//         ))}
//       </div>

//       {/* Chat Section */}
//       <div className="chat">
//         <div className="chat-header">
//           <div className="d-flex align-items-center">
//             <img alt={chatDetails.groupName} height="50" src={chatDetails.avatarUrl} width="50" />
//             <h5 className="mb-0 ms-3">{chatDetails.groupName}</h5>
//           </div>
//         </div>
//         <div className="chat-messages">
//           <p className="text-muted">Hôm nay</p>
//           <p className="text-muted">
//             {chatDetails.introMessage} <a href="#">Tìm hiểu thêm</a>
//           </p>
//           {messages.map((msg, index) => (
//             <div className="message" key={index}>
//               <img alt={msg.senderName} height="50" src={msg.avatarUrl} width="50" />
//               <div className="message-content">
//                 <p><strong>{msg.senderName} {msg.time}</strong></p>
//                 <p>{msg.content}</p>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//         <div className="chat-input">
//           <input
//             type="text"
//             placeholder="Nhập tin nhắn"
//             value={input}
//             onChange={handleInputChange}
//           />
//           <i className="fas fa-paper-plane" onClick={handleSendMessage} aria-label="Send"></i>
//         </div>
//       </div>

//       {/* Details Section */}
//       <div className="details">
//         <div className="details-header">
//           <h5 className="mb-0">Thông tin chi tiết</h5>
//           <i className="fas fa-times" aria-label="Close Details"></i>
//         </div>
//         <div className="message">
//           <img alt={chatDetails.groupName} height="50" src={chatDetails.avatarUrl} width="50" />
//           <div className="message-content">
//             <strong>{chatDetails.groupName}</strong>
//             <p>{chatDetails.description}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chatbox;
