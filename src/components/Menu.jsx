import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { toast, ToastContainer } from "react-toastify";
import {
  ArrowRepeat,
  BoxArrowInRight,
  Calendar2Check,
  Clipboard2Check,
  Heart,
  List,
  PersonVcard,
  Wallet,
} from "react-bootstrap-icons";
import axios from "axios";
import "../style/Menu.css";
import { MenuItem } from "@mui/material";

const AccountMenu = ({ setIsLoggedIn, isLoggedIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    gmail: "",
    gender: "",
    birthday: "",
    phone: "",
    address: "",
  });
  const role = localStorage.getItem("role");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

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
      setFormData({
        fullname: response.data.fullname,
        gmail: response.data.gmail,
        gender: response.data.gender,
        birthday: response.data.birthday,
        phone: response.data.phone,
        address: response.data.address,
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

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
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.put(`http://localhost:9999/users/${userId}`, formData);
      setUserInfo((prev) => ({ ...prev, ...formData }));
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      toast.error("Cập nhật thông tin thất bại.");
    }
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Link to={"/alladd"} className="linkk">
          <Typography sx={{ marginRight: 1 }}>
            <p style={{ fontWeight: "bold", color: "#0f5a4f" }}>
              Cho thuê địa điểm qua SpaceHub
            </p>
          </Typography>
        </Link>
        <Tooltip
          title="Cài đặt tài khoản"
          style={{ height: "61px", marginTop: "-10px" }}
        >
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{
              ml: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px",
              borderRadius: "50px",
              border: "1px solid #ccc",
              width: "90px",
              height: "48px",
            }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <List style={{ marginLeft: "8px" }} />
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {isLoggedIn ? (
          <>
            <MenuItem onClick={() => handleNavigation("/profile")}>
              <PersonVcard style={{ fontSize: "20px", marginRight: "10px" }} />
              Thông tin cá nhân
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/favorites")}>
              <Heart style={{ fontSize: "20px", marginRight: "10px" }} />
              Danh sách yêu thích
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/chang_pass")}>
              <ArrowRepeat style={{ fontSize: "20px", marginRight: "10px" }} />
              Thay đổi mật khẩu
            </MenuItem>
            {role === "2" && (
              <MenuItem onClick={() => handleNavigation("/manaspace")}>
                <Calendar2Check
                  style={{ fontSize: "20px", marginRight: "10px" }}
                />
                Quản Lí Bài Đăng
              </MenuItem>
            )}
            <MenuItem onClick={() => handleNavigation("/addfund")}>
              <Wallet style={{ fontSize: "20px", marginRight: "10px" }} />
              Nạp tiền
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/history")}>
              <Clipboard2Check
                style={{ fontSize: "20px", marginRight: "10px" }}
              />
              Lịch sử đặt
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <BoxArrowInRight
                style={{ fontSize: "20px", marginRight: "10px" }}
              />
              Đăng xuất
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => handleNavigation("/login")}>
              Đăng nhập
            </MenuItem>
            <MenuItem onClick={() => handleNavigation("/register")}>
              Đăng ký
            </MenuItem>
          </>
        )}
      </Menu>
    </React.Fragment>
  );
};

export default AccountMenu;
