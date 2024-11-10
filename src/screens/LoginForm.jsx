import React, { useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../style/login.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = ({ setIsLoggedIn }) => {
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      username: formRef.current.elements["email_field"].value,
      password: formRef.current.elements["password_field"].value,
    };

    try {
      const response = await axios.post("http://localhost:9999/users/login", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const { accessToken, refreshToken, username, id, fullname, role, firstLogin } = response.data;
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("username", username);
      localStorage.setItem("fullname", fullname);
      localStorage.setItem("userId", id);
      localStorage.setItem("role", role);
      localStorage.setItem("firstLogin", firstLogin);
      localStorage.setItem("isLoggedIn", "true");

      toast.success("Đăng nhập thành công!");
      setIsLoggedIn(true);

      if (role === 1) {
        navigate("/admin");
      } else {
        navigate(firstLogin ? "/userneed" : "/");
      }
    } catch (error) {
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    if (error.response) {
      const errorMessage = error.response.data.error || "Đăng nhập không thành công!";
      if (error.response.status === 403) {
        toast.error("Người dùng bị cấm!");
      } else {
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } else {
      toast.error("Đã xảy ra lỗi không xác định!");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center">
        <Col xs={12} md={6}>
          <form className="form_container" onSubmit={handleSubmit} ref={formRef}>
            <div className="logo_container d-flex justify-content-center">
              <img src={logo} height={80} alt="logo" style={{ objectFit: "contain" }} />
            </div>
            <div className="title_container">
              <p className="title">Đăng nhập với tài khoản của bạn</p>
              <span className="subtitle">
                Bắt đầu với ứng dụng của chúng tôi, chỉ cần tạo một tài khoản và tận hưởng trải nghiệm.
              </span>
            </div>

            <div className="input_container">
              <label htmlFor="email_field" className="input_label">Tên đăng nhập</label>
              <input
                id="email_field"
                type="text"
                placeholder="Enter your username"
                className="input_field"
              />
            </div>

            <div className="input_container">
              <label htmlFor="password_field" className="input_label">Mật khẩu</label>
              <input
                id="password_field"
                type="password"
                placeholder="Password"
                className="input_field"
              />
            </div>

            <Button variant="dark" className="sign-in_btn mb-3 mt-2" type="submit">
              Đăng nhập
            </Button>

            <div>
              <Link to="/register" className="text-danger text-opacity-75">Tôi chưa có tài khoản ...</Link>
            </div>
            <div>
              <Link to="/forgot" className="text-danger text-opacity-75">Tôi quên mật khẩu</Link>
            </div>
          </form>
        </Col>
      </Row>
      <ToastContainer autoClose={3000} />
    </Container>
  );
};

export default LoginForm;
