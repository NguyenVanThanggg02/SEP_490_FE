import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {
  BoxArrowInRight,
  Calendar2Check,
  Clipboard2Check,
  Heart,
  List,
  PersonVcard,
  Wallet,
} from "react-bootstrap-icons";
import '../style/Menu.css'
const MenuAdmin = ({ setIsLoggedIn, isLoggedIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setUserInfo(null);
    handleClose();
    navigate("/");
    window.location.reload();
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleChangePass = () => {
    handleClose();
    navigate("/changepassadm");
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip
          title="Cài đặt tài khoản"
          style={{ height: "61px", marginTop: "-10px" }}
        >
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "90px",
              height: "48px",
            }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <List style={{ marginLeft: "30px", fontSize: "30px"  }} />
          </IconButton>
        </Tooltip>
      </Box>
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
          <MenuItem onClick={() => handleNavigation("/profile")}>
            <PersonVcard style={{ fontSize: "20px", marginRight: "10px" }} />
            Thông tin cá nhân
          </MenuItem>

          <MenuItem onClick={handleChangePass}>
            <Wallet style={{ fontSize: "20px", marginRight: "10px" }} />
            Thay đổi mật khẩu
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <BoxArrowInRight
              style={{ fontSize: "20px", marginRight: "10px" }}
            />
            Đăng xuất
          </MenuItem>
        </>
      </Menu>
    </React.Fragment>
  );
};

export default MenuAdmin;
