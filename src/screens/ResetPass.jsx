import React from "react";
import "../style/reset-forgotPass.css";

const ResetPass = () => {
  return (
    <div className="form-container">
      <div className="logo-container">Cập nhật lại mật khẩu</div>
      <form className="form">
        <div className="form-group">
          <label htmlFor="email">Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Enter your new password"
            // onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="form-submit-btn" type="submit">
          Cập nhật
        </button>
      </form>
      {/* <p className="signup-link">
        Tôi không có tài khoản...
        <a href="/register" className="signup-link link">
          Đăng kí ngay bây giờ
        </a>
      </p> */}
    </div>
  );
};

export default ResetPass;
