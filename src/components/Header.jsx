import React, { useState } from "react";
import "../style/Header.css";
import Logo from "../assets/logo.png";
import { Col, Row } from "react-bootstrap";
import AccountMenu from "./Menu";
import { Link } from "react-router-dom";

const Header = ({ setIsLoggedIn, isLoggedIn }) => {
  return (
    <Row className="d-flex align-items-center justify-content-between">
      <Col md={2}>
        <div className="navbar">
          <div className="logo">
            <Link to={"/"}>
              <img src={Logo} style={{height:'150px', width:'150px'}} alt="logo" />
            </Link>
          </div>
        </div>
      </Col>
      <Col md={8}>
        <div className="search-bar d-flex align-items-center justify-content-around">
          <div className="search-container">
            <div className="search-item">
              <span>Địa điểm</span>
              <input type="text" placeholder="Tìm kiếm điểm đến" />
            </div>
            <div className="search-item">
              <span>Nhận phòng</span>
              <input type="text" placeholder="Thêm ngày" />
            </div>
            <div className="search-item">
              <span>Trả phòng</span>
              <input type="datetime-local" placeholder="Thêm ngày" />
            </div>
            <div className="search-item">
              <span>Khách</span>
              <input type="number" placeholder="Thêm khách" />
            </div>
            <button className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </div>
        </div>
      </Col>
      <Col md={2}>
        <AccountMenu setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      </Col>
    </Row>
  );
};

export default Header;
