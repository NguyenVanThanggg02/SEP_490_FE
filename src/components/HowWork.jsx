import React from "react";

const HowWork = () => {
  return (
    <div className="how-it-works">
      <h2>Cách Hoạt Động</h2>
      <div className="step">
        <i className="fas fa-user-plus"></i>
        <h3>Đăng Ký</h3>
        <p>Tạo tài khoản miễn phí và bắt đầu tìm kiếm không gian phù hợp.</p>
      </div>
      <div className="step">
        <i className="fas fa-search-location"></i>
        <h3>Tìm Kiếm</h3>
        <p>Sử dụng công cụ tìm kiếm để tìm không gian theo nhu cầu của bạn.</p>
      </div>
      <div className="step">
        <i className="fas fa-calendar-check"></i>
        <h3>Đặt Chỗ</h3>
        <p>Đặt chỗ và thanh toán trực tuyến một cách an toàn và nhanh chóng.</p>
      </div>
    </div>
  );
};

export default HowWork;
