import React, { useEffect, useState } from "react";
import "../style/headeradmin.css";
import Logo from "../assets/logo.png";
import { BellFill, PersonCircle } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import NewLogo from "../assets/images/newlogo.png";
import MenuAdmin from "./MenuAdmin";
import Notification from '../components/Notification';

const HeaderAdmin = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  useEffect(() => {
    if (isLoggedIn) {
      const storedUsername = localStorage.getItem("userId");
      if (storedUsername) {
        fetchUserData(storedUsername);
      }
    }
  }, [isLoggedIn]);

  const fetchUserData = async (userId) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `http://localhost:9999/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    handleClose();
    navigate('/login')
  };

  const handleChangePass = () => {
    handleClose();
    navigate("/changepassadm");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Row className="d-flex justify-content-between headerr">
      <Col md={2}>
        <div className="logo">
          <Link to={"/"}>
            <img
              src={NewLogo}
              style={{ height: "180px", width: "190px", marginTop: "-30px" }}
              alt="logo"
            />
          </Link>
        </div>
      </Col>
      <Col md={10}>
        <div class="navbar">
          <div class="nav-links">
            <Link to={"/"}>Trang chủ</Link>
            <Link to={"/list_space"}>Danh sách địa điểm</Link>
          </div>
          <div style={{marginBottom:'10px'}}>
            <Notification />
          </div>
          <MenuAdmin setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
        </div>
      </Col>
    </Row>
  );
};

export default HeaderAdmin;