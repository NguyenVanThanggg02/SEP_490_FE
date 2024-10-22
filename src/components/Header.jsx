import React, { useState } from "react";
import "../style/Header.css";
import Logo from "../assets/logo.png";
import NewLogo from "../assets/images/newlogo.png";

import { Col, Row } from "react-bootstrap";
import AccountMenu from "./Menu";
import { Link } from "react-router-dom";

const Header = ({ setIsLoggedIn, isLoggedIn }) => {
  return (
    <Row className="d-flex align-items-center justify-content-between headerr">
      <Col md={2}>
        <div className="logo">
          <Link to={"/"}>
            <img
              src={Logo}
              style={{ height: "180px", width: "190px" }}
              alt="logo"
            />
          </Link>
        </div>
      </Col>
      <Col md={9}>
        <div class="navbar">
          <div class="nav-links">
            <Link to={"/"}>Trang chủ</Link>
            <Link to={"/list_space"}>Danh sách địa điểm</Link>
            <Link to={"/"}>Bài viết</Link>
            <Link to={"/"}>Liên hệ</Link>
          </div>
          <AccountMenu setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />

        </div>
      </Col>
      {/* <Col md={2}>
        <AccountMenu setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      </Col> */}
    </Row>
  );
};

export default Header;
