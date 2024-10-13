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
        <div>
          <div className="logo">
            <Link to={"/"}>
              <img
                src={Logo}
                style={{ height: "180px", width: "190px" }}
                alt="logo"
              />
            </Link>
          </div>
        </div>
      </Col>
      <Col md={8}></Col>
      <Col md={2}>
        <AccountMenu setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      </Col>
    </Row>
  );
};

export default Header;
