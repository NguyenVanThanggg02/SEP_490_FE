import React, { useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../style/login.css";
import newlogo2 from "../assets/images/newlogo_2.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Constants } from "../utils/constants";

const LoginForm = ({ setIsLoggedIn }) => {
  const formRef = useRef(null);
  const nav = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = formRef.current;
    const username = form.elements["email_field"].value; // Sử dụng id đúng
    const password = form.elements["password_field"].value; // Sử dụng id đúng
    const data = { username, password };
    try {
      const res = await axios.post(`${Constants.apiHost}/users/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const {
        accessToken,
        refreshToken,
        username,
        id,
        fullname,
        role,
        firstLogin,
      } = res.data;
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
        nav("/admin");
      } else {
        // if (firstLogin === true) {
        //   nav("/userneed");
        //   return;
        // }
        nav("/");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          toast.error("Người dùng bị cấm!");
        } else {
          setError(error.response.data.error || "Đăng nhập không thành công!");
          toast.error(
            error.response.data.error ||
              "Tên đăng nhập hoặc mật khẩu không chính xác!"
          );
        }
      } else {
        toast.error("Đã xảy ra lỗi không xác định!");
      }
    }
  };
  return (
    <Container>
      <Row
        className="justify-content-center align-items-center"
        // style={{ height: "100vh" }}
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
                  src={newlogo2}
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
                <Link to={"/register"} className="text-danger text-opacity-75" style={{textDecoration:'none'}}>
                  Tôi chưa có tài khoản ...
                </Link>
              </div>{" "}
              <div>
                <Link to={"/forgot_pass"} className="text-danger text-opacity-75"  style={{textDecoration:'none'}}>
                  Tôi quên mật khẩu
                </Link>
              </div>
            </form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
