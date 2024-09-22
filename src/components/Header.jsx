import React from "react";
import "../style/Header.css";
import Logo from "../assets/logo.png";
const Header = () => {
  return (
    <div className="airbnb-listing d-flex">
      <header className="header">
        <div className="logo">
          <img src={Logo} />
        </div>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm điểm đến"
          className="search-input"
        />
        <div className="">
          <input
            type="text"
            placeholder="Nhận phòng"
            className="search-input"
          />
          <input type="text" placeholder="Trả phòng" className="search-input" />
          <input type="text" placeholder="Khách" className="search-input" />
          <button className="search-btn">Tìm kiếm</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
