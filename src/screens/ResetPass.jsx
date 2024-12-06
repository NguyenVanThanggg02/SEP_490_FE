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
    e.preventDefault();

    if (!password) {
      toast.error("Mật khẩu không được bỏ trống!");
      return;
    }

    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }

    axios
      .post(`http://localhost:9999/users/reset-password/${id}/${token}`, {
        password,
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log('success');
          toast.success("Cập nhật mật khẩu mới thành công.");
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
            placeholder="Nhập mật khẩu mới của bạn."
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="form-submit-btn" type="submit">
          Cập nhật
        </button>
      </form>
    </div>
  );
};

export default ResetPass;
