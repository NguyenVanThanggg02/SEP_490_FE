import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {
  BoxArrowInRight,
  Calendar2Check,
  Chat,
  Clipboard2Check,
  Heart,
  List,
  PersonVcard,
  Wallet,
} from "react-bootstrap-icons";
import '../style/Menu.css'
import ListAltIcon from '@mui/icons-material/ListAlt';
import Notification from './Notification';
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
      console.log(userInfo.role);

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
    navigate("/");

  };
  const handleAddFunds = () => {
    navigate("/addfund");
  };
  const handleHistory = () => {
    navigate("/history");
  };

  const handleLogin = () => {
    handleClose();
    navigate("/login");
  };

  const handleRegister = () => {
    handleClose();
    navigate("/register");
  };

  const handleFavorites = () => {
    handleClose();
    navigate("/favorites");
  };

  const handleMannaPost = () => {
    handleClose();
    navigate("/posted");
  };
  const handleMannaReport = () => {
    handleClose();
    navigate("/report");
  };
  const handleMessage = () => {
    handleClose();
    navigate("/chat");
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleClose();
  };
  const handleMannaOrder = () => {
    handleClose();
    navigate("/order");
  };
  const handleStatistic = () => {
    handleClose();
    navigate('/statistics');
  };
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
      <Notification />
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
            <i class="bi bi-list" style={{ marginLeft: "8px" }}>
              <List />
            </i>
            <Avatar
              src={userInfo?.avatar || "/default-avatar.png"}
              sx={{ width: 56, height: 56 }}
            />
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
        {isLoggedIn ? (
          <>
            <MenuItem onClick={() => handleNavigation("/profile")}>
              <PersonVcard style={{ fontSize: "20px", marginRight: "10px" }} />
              Thông tin cá nhân
            </MenuItem>
            <MenuItem onClick={handleFavorites}>
              <Heart style={{ fontSize: "20px", marginRight: "10px" }} />
              Danh sách yêu thích
            </MenuItem>
            <MenuItem onClick={handleMannaPost}>
              <Calendar2Check
                style={{ fontSize: "20px", marginRight: "10px" }}
              />
              Quản Lí Bài Đăng
            </MenuItem>
            <MenuItem onClick={handleMannaReport}>
              <Calendar2Check
                style={{ fontSize: "20px", marginRight: "10px" }}
              />
              Quản Lí Tố Cáo
            </MenuItem>
            <MenuItem onClick={handleMessage}>
              <Chat
                style={{ fontSize: "20px", marginRight: "10px" }}
              />
              Tin nhắn
            </MenuItem>
            <MenuItem onClick={handleMannaOrder}>
              <ListAltIcon
                style={{ fontSize: "20px", marginRight: "10px" }}
              />
              Quản Lí Đơn
            </MenuItem>
            <MenuItem onClick={handleStatistic}>
              <Calendar2Check
                style={{ fontSize: "20px", marginRight: "10px" }}
              />
              Thống kê doanh thu
            </MenuItem>
            <MenuItem onClick={handleAddFunds}>
              <Wallet style={{ fontSize: "20px", marginRight: "10px" }} />
              Ví 
            </MenuItem>
            <MenuItem onClick={handleHistory}>
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
            <MenuItem onClick={handleLogin}>Đăng nhập</MenuItem>
            <MenuItem onClick={handleRegister}>Đăng ký</MenuItem>
          </>
        )}
      </Menu>
    </React.Fragment>
  );
};

export default AccountMenu;