import React, { useEffect, useState } from "react";
import "../style/headeradmin.css";
import Logo from "../assets/logo.png";
import { BellFill, PersonCircle } from "react-bootstrap-icons";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HeaderAdmin = ({ setIsLoggedIn, isLoggedIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

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
  };

  const handleChangePass = () => {
    handleClose();
    navigate("/changepassadm");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src={Logo} height="100" width="100" alt="logo" />
      </div>
      <div className="nav-links">
        <h5 style={{ paddingRight: "30px" }}>Trang chủ</h5>
        <h5>Tạo</h5>
      </div>
      <div className="search-bar">
        <input placeholder="Tìm kiếm" type="text" />
      </div>
      <div className="icons">
        <div className="icon">
          <BellFill style={{ fontSize: "25px" }} />
          <div className="badge">22</div>
        </div>
        <div
          className="icon"
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          <PersonCircle style={{ fontSize: "25px" }} />
        </div>
      </div>
      <div className="profile">
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <>
            <MenuItem onClick={handleChangePass}>Thay đổi mật khẩu</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </>
        </Menu>
      </div>
    </div>
  );
};

export default HeaderAdmin;
