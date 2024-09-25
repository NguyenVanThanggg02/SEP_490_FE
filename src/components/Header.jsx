import React, { useState } from "react";
import "../style/Header.css";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <div className="navbar">
        <div className="logo">
          <img src={Logo} height="300" width="100" alt="logo" />
        </div>{" "}
        <div className="search-bar">
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
      </div>
    </>
  );
};

export default Header;
