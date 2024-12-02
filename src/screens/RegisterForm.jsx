import React, { useState } from "react";
import "../style/login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import newlogo2 from "../assets/images/newlogo_2.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const navigate = useNavigate(); // Hook to navigate after successful registration

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Mật khẩu không khớp!");
      return;
    }
    if (password.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự!");
      return;
    }
    // Tạo đối tượng FormData
    const formDataToSend = new FormData();
    formDataToSend.append("username", username);
    formDataToSend.append("gmail", email);
    formDataToSend.append("password", password);

    try {
      const res = await axios.post(
        "http://localhost:9999/users/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);

      toast.success(
        "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("Tên người dùng hoặc email đã tồn tại!");
      } else if (error.response && error.response.data) {
        toast.error(error.response.data.error || "Đăng ký không thành công!");
      } else {
        toast.error("Đã xảy ra lỗi không xác định!");
      }
    }
  };

  return (
    <form className="form_container" onSubmit={handleRegister}>
      <ToastContainer />
      <div
        className="logo_container d-flex justify-content-center"
        style={{ width: "100%" }}
      >
        <img
          src={newlogo2}
          height={80}
          alt="logo"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="title_container">
        <p className="title">Đăng kí tài khoản với thông tin của bạn</p>
        <span className="subtitle">
          Bắt đầu với ứng dụng của chúng tôi, chỉ cần tạo một tài khoản và
          thưởng thức trải nghiệm.
        </span>
      </div>
      <div className="input_container">
        <label className="input_label" htmlFor="username">
          Tên người dùng
        </label>
        <input
          type="text"
          id="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Tên người dùng của bạn"
          className="input_field"
          required
        />
      </div>
      <div className="input_container">
        <label className="input_label" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="name@mail.com"
          className="input_field"
          required
        />
      </div>
      <div className="input_container">
        <label className="input_label" htmlFor="password">
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
          className="input_field"
          required
        />
      </div>
      <div className="input_container">
        <label className="input_label" htmlFor="confirmPassword">
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Xác nhận mật khẩu"
          className="input_field"
          required
        />
      </div>
      <button title="Đăng ký" type="submit" className="sign-in_btn">
        <span>Đăng ký</span>
      </button>
      <div>
        <div>
          <Link to="/login" className="text-danger text-opacity-75"  style={{textDecoration:'none'}}>
            Tôi đã có tài khoản ...
          </Link>
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
