// Chatbox.jsx
import React from 'react';
import "../style/Chatboxx.css";


function Chatbox() {
  return (
    <div className="chat-container">
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
        <div className="message">
          <img
            alt="Profile picture of SpaceHub support group"
            height="50"
            src="https://storage.googleapis.com/a1aa/image/rQeQowC0PBWLFqALgjLfDwkBCTFaiDcDd0kqy8J301rZwmrTA.jpg"
            width="50"
          />
          <div className="message-content">
            <strong>Nhóm hỗ trợ SpaceHub</strong>
            <p>Vui lòng mô tả vấn đề của bạn tro...</p>
          </div>
          <div className="message-time">17:32</div>
        </div>
        <div className="message">
          <img
            alt="Profile picture of SpaceHub support group"
            height="50"
            src="https://storage.googleapis.com/a1aa/image/rQeQowC0PBWLFqALgjLfDwkBCTFaiDcDd0kqy8J301rZwmrTA.jpg"
            width="50"
          />
          <div className="message-content">
            <strong>Nhóm hỗ trợ SpaceHub</strong>
            <p>SpaceHub: Chúng tôi đóng trường h...</p>
          </div>
          <div className="message-time">29/9</div>
        </div>
      </div>

      <div className="chat">
        <div className="chat-header">
          <div className="d-flex align-items-center">
            <img
              alt="Profile picture of SpaceHub support group"
              height="50"
              src="https://storage.googleapis.com/a1aa/image/rQeQowC0PBWLFqALgjLfDwkBCTFaiDcDd0kqy8J301rZwmrTA.jpg"
              width="50"
            />
            <h5 className="mb-0 ms-3">Nhóm hỗ trợ SpaceHub</h5>
          </div>
        </div>
        <div className="chat-messages">
          <p className="text-muted">Hôm nay</p>
          <p className="text-muted">
            Chúng tôi có thể phân tích các tin nhắn nhằm mục đích đảm bảo an toàn, hỗ trợ, cải tiến sản phẩm hoặc
            mục đích khác. <a href="#">Tìm hiểu thêm</a>
          </p>
          <div className="message">
            <img
              alt="Profile picture of SpaceHub support group"
              height="50"
              src="https://storage.googleapis.com/a1aa/image/rQeQowC0PBWLFqALgjLfDwkBCTFaiDcDd0kqy8J301rZwmrTA.jpg"
              width="50"
            />
            <div className="message-content">
              <p><strong>Nhóm hỗ trợ SpaceHub 17:32</strong></p>
              <p>Chào Hoà! Chúng tôi sẽ trợ giúp bạn. Chúng tôi cần bạn trả lời một số câu hỏi và sau đó sẽ kết nối bạn với một thành viên trong nhóm của chúng tôi.</p>
              <p>Vui lòng mô tả vấn đề của bạn trong vài câu. Điều này sẽ giúp nhóm của chúng tôi hiểu được vấn đề đang diễn ra.</p>
              <p>Vui lòng không cho biết các thông tin nhạy cảm như số thẻ tín dụng.</p>
            </div>
          </div>
        </div>
        <div className="chat-input">
          <input type="text" placeholder="Nhập tin nhắn" />
          <i className="fas fa-paper-plane"></i>
        </div>
      </div>

      <div className="details">
        <div className="details-header">
          <h5 className="mb-0">Thông tin chi tiết</h5>
          <i className="fas fa-times"></i>
        </div>
        <div className="message">
          <img
            alt="Profile picture of SpaceHub support group"
            height="50"
            src="https://storage.googleapis.com/a1aa/image/rQeQowC0PBWLFqALgjLfDwkBCTFaiDcDd0kqy8J301rZwmrTA.jpg"
            width="50"
          />
          <div className="message-content">
            <strong>Nhóm hỗ trợ SpaceHub</strong>
            <p>Trợ giúp từ Nhóm hỗ trợ cộng đồng SpaceHub.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbox;
