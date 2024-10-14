import React from "react";

const UserFeed = () => {
  return (
    <div className="testimonials">
      <h2>Khách Hàng Nói Gì?</h2>
      <div className="testimonial-item">
        <img
          src="https://storage.googleapis.com/a1aa/image/BkpQcthWHm77Dh0PCwged3Cdm0qjVaSY0IL1gSgpb327jLzJA.jpg"
          alt="Khách hàng 1"
        />
        <h3>Nguyễn Văn A</h3>
        <p>
          "Dịch vụ tuyệt vời! Tôi đã tìm được không gian hoàn hảo cho buổi họp
          của công ty."
        </p>
      </div>
      <div className="testimonial-item">
        <img
          src="https://storage.googleapis.com/a1aa/image/P9Wslfw0QK3LeEjYYE7kkOYy2xhBUWOLPelIiW1jkDuqPuMnA.jpg"
          alt="Khách hàng 2"
        />
        <h3>Trần Thị B</h3>
        <p>
          "Giá cả hợp lý và quy trình đặt chỗ rất dễ dàng. Tôi rất hài lòng."
        </p>
      </div>
      <div className="testimonial-item">
        <img
          src="https://storage.googleapis.com/a1aa/image/oARpEWCW3wbDNdHm9LXe7ivMYU5PxfCwO8PuPPC509l8HXmTA.jpg"
          alt="Khách hàng 3"
        />
        <h3>Phạm Văn C</h3>
        <p>
          "Không gian thuê rất đẹp và tiện nghi. Tôi sẽ tiếp tục sử dụng dịch vụ
          này."
        </p>
      </div>
    </div>
  );
};

export default UserFeed;
