import React, { useState } from "react";
import "../style/reset-forgotPass.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPass = () => {
  const [password, setPassword] = useState();
  const { id, token } = useParams();
  const nav = useNavigate();
  const handleSubmit = (e) => {
    e.prevenDefault();
    axios
      .post(`http://localhost:9999/users/reset-password/${id}/${token}`, {
        password,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          toast.success("Thành Công");
          nav("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Thất bại");
      });
  };
  return (
    <div className="form-container">
      <div className="logo-container">Cập nhật lại mật khẩu</div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Mật khẩu mới</label>
          <input
            type="password"
            placeholder="Enter your new password"
            onChange={(e) => setPassword(e.target.value)}
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
