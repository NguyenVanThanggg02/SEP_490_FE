import React, { useState } from "react";
import "../style/Header.css";
import Logo from "../assets/logo.png";
import LogoVer2 from "../assets/logo-removebg.png";
import LogoVer3 from "../assets/logover3.ico";
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
                style={{width:"60%",height:"100px",objectFit:"cover"}}
                alt="logo"
              />
            </Link>
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
