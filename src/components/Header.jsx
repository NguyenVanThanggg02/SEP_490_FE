import React from "react";
import "../style/Header.css";
import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="airbnb-listing d-flex">
      <header className="header">
        <div className="logo">
          <Link to={"/"}>
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="cart-link">
          <Link to={"/favorites"} className="cart-link-text">
            Cart
          </Link>
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
            placeholder="Địa điểm"
            className="search-input"
          />
          <input type="text" placeholder="Trả địa điểm" className="search-input" />
          <input type="text" placeholder="Khách" className="search-input" />
          <button className="search-btn">Tìm kiếm</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
