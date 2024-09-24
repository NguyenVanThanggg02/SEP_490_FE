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
  const nav = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = formRef.current;
    const username = form.elements["input-name"].value;
    const password = form.elements["password_field"].value;

    const data = { username, password };

    try {
      const res = await axios.post("http://localhost:9999/users/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { accessToken, refreshToken, username, id, fullname, role } =
        res.data;
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("username", username); // Lưu tên người dùng vào localStorage
      localStorage.setItem("fullname", fullname); // Lưu tên người dùng vào localStorage
      localStorage.setItem("userId", id); // Lưu tên người dùng vào localStorage

      localStorage.setItem("isLoggedIn", "true");
      toast.success("Login successful!");
      nav("/");
    } catch (error) {
      setError(error.response.data.error);
      toast.error("Username or password is incorrect");
    }
  };

  return (
    <Container>
      <Row
        className="justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Col xs={12} md={6}>
          <div>
            <form
              className="form_container"
              onSubmit={handleSubmit}
              ref={formRef}
            >
              <div
                className="logo_container d-flex justify-content-center"
                style={{ width: "100%" }}
              >
                <img
                  src={logo}
                  height={80}
                  alt="logo"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="title_container">
                <p className="title">Đăng nhập với tài khoản của bạn</p>
                <span className="subtitle">
                  Bắt đầu với ứng dụng của chúng tôi, chỉ cần tạo một tài khoản
                  và tận hưởng trải nghiệm.
                </span>
              </div>
              <br />
              <div className="input_container">
                <label className="input_label" htmlFor="email_field">
                  Tên đăng nhập
                </label>
                <input
                  placeholder="Enter your username"
                  name="input-name"
                  type="text"
                  className="input_field"
                  id="email_field"
                />
              </div>
              <div className="input_container">
                <label className="input_label" htmlFor="password_field">
                  Mật khẩu
                </label>
                <input
                  placeholder="Password"
                  name="password_field"
                  type="password"
                  className="input_field"
                  id="password_field"
                />
              </div>
              <Button
                variant="dark"
                className="sign-in_btn mb-3 mt-2"
                type="submit"
              >
                Đăng nhập
              </Button>
              <div>
                <Link to={"/register"} className="text-danger text-opacity-75">
                  Tôi chưa có tài khoản ...
                </Link>
              </div>{" "}
              <div>
                <Link to={"/forgot"} className="text-danger text-opacity-75">
                  Tôi quên mật khẩu
                </Link>
              </div>
            </form>
          </div>
        </Col>
      </Row>
      <ToastContainer /> {/* Tự đóng toast sau 3 giây */}
    </Container>
  );
};

export default LoginForm;
