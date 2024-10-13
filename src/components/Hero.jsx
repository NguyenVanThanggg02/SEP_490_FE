import React from "react";
import "../style/hero.css";
const Hero = () => {
  return (
    <div className="containers">
      <div className="text-content">
        <h2>DỰ ÁN NỔI BẬT CỦA SEP490_G4 </h2>
        <h1>Trung Tâm Không Gian</h1>
        <p>
          Tìm kiếm không gian hoàn hảo cho sự kiện của bạn? Chúng tôi là nền
          tảng trung gian giúp kết nối bạn với những không gian sự kiện độc đáo
          và linh hoạt. Từ hội nghị, tiệc cưới đến các buổi gặp mặt riêng tư,
          chúng tôi mang đến Lựa Chọn Đa Dạng
        </p>
        <button>ĐĂNG KÝ NGAY!</button>
      </div>
      <div className="image-content">
        <img
          height="400"
          src="https://storage.googleapis.com/a1aa/image/kV7Xdn8VZ5oDEBn8gb0HMSqLfDK2qdzar8jUm3YIYeSucXmTA.jpg"
          width="600"
        />
      </div>
    </div>
  );
};

export default Hero;
