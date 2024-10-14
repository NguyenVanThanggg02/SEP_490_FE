import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Features = () => {
  return (
    <div className="features">
      <h2>Tại Sao Chọn Chúng Tôi?</h2>
      <div className="feature-item">
        <i className="fas fa-search"></i>
        <h3>Tìm Kiếm Dễ Dàng</h3>
        <p>
          Chúng tôi cung cấp công cụ tìm kiếm mạnh mẽ để bạn dễ dàng tìm thấy
          không gian phù hợp.
        </p>
      </div>
      <div className="feature-item">
        <i className="fas fa-dollar-sign"></i>
        <h3>Giá Cả Hợp Lý</h3>
        <p>
          Chúng tôi cam kết cung cấp giá cả cạnh tranh và hợp lý cho mọi không
          gian.
        </p>
      </div>
      <div className="feature-item">
        <i className="fas fa-shield-alt"></i>
        <h3>An Toàn & Bảo Mật</h3>
        <p>Chúng tôi đảm bảo an toàn và bảo mật cho mọi giao dịch của bạn.</p>
      </div>
    </div>
  );
};

export default Features;
