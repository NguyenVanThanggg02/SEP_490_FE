import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/reset-forgotPass.css";
import axios from "axios";
import { Breadcrumb, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";

const Forgot_Pass = () => {
  const [gmail, setGmail] = useState();
  const nav = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:9999/users/forgot-password", { gmail })
      .then((res) => {
        if (res.data.Status === "Success") {
          toast.success("Thành Công");
          nav.push("/login");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.Error);
      });
  };
  return (
    <Container fluid>
      <Row className="mt-2 ml-2">
        <Breadcrumb>
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Quên mật khẩu</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      <div className="form-container">
        <div className="logo-container">Quên mật khẩu</div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Nhập email xác nhận"
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
