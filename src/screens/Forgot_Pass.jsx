import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/reset-forgotPass.css";
import axios from "axios";
import {  Container } from "react-bootstrap";
import { toast } from "react-toastify";

const Forgot_Pass = () => {
  const [gmail, setGmail] = useState("");
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:9999/users/forgot-password", { gmail })
      .then((res) => {
        if (res.data.Status === "Thành công") {
          setGmail("");
          toast.success("Vui lòng kiểm tra email để lấy lại mật khẩu.");
          nav.push("/login");
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.Error);
      });
  };
  return (
    <Container fluid>
      <div className="form-container">
        <div className="logo-container">Quên mật khẩu</div>
        <p className="text-center text-secondary mb-4">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Nhập email xác nhận"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              required
            />
          </div>
          <button className="form-submit-btn" type="submit">
            Gửi
          </button>
        </form>
      </div>
    </Container>
  );
};

export default Forgot_Pass;
