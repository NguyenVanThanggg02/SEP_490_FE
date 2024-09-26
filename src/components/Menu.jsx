import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const AccountMenu = ({ setIsLoggedIn, isLoggedIn }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    gmail: "",
    gender: "",
    birthday: "",
    phone: "",
    address: "",
  });
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("fullname");
    localStorage.removeItem("userId");
    localStorage.setItem("isLoggedIn", "false");
    handleClose();
  };

  const handleLogin = () => {
    handleClose();
    navigate("/login");
  };

  const handleRegister = () => {
    handleClose();
    navigate("/register");
  };

  const handleProfileOpen = () => {
    setOpenProfileModal(true);
    handleClose();
  };

  const handleProfileClose = () => {
    setOpenProfileModal(false);
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFavorites = () => {
    handleClose();
    navigate("/favorites");
  };
  const handleChangePass = () => {
    handleClose();
    navigate("/chang_pass");
  };

  const handleSave = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      await axios.put(
        `http://localhost:9999/users/${userInfo.username}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUserInfo((prev) => ({ ...prev, ...formData }));
      setEditMode(false);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      toast.error("Cập nhật thông tin thất bại.");
    }
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        {isLoggedIn && userInfo && (
          <Typography sx={{ marginRight: 1 }}>{userInfo.fullname}</Typography>
        )}
        <Tooltip title="Cài đặt tài khoản">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }} />
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
            <MenuItem onClick={handleProfileOpen}>Thông tin cá nhân</MenuItem>
            <MenuItem onClick={handleFavorites}>Danh sách yêu thích</MenuItem>
            <MenuItem onClick={handleChangePass}>Thay đổi mật khẩu</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={handleLogin}>Đăng nhập</MenuItem>
            <MenuItem onClick={handleRegister}>Đăng ký</MenuItem>
          </>
        )}
      </Menu>

      <Dialog open={openProfileModal} onClose={handleProfileClose}>
        <DialogTitle>Thông tin chi tiết</DialogTitle>
        <ToastContainer />
        <DialogContent>
          {userInfo ? (
            <div>
              <TextField
                label="Họ và tên"
                name="fullname"
                value={formData.fullname}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="gmail"
                value={formData.gmail}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal" disabled={!editMode}>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Male">Nam</MenuItem>
                  <MenuItem value="Female">Nữ</MenuItem>
                  <MenuItem value="">Chưa xác định</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Ngày sinh"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!editMode}
                fullWidth
                margin="normal"
              />
            </div>
          ) : (
            <Typography>Đang tải...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          {editMode ? (
            <>
              <Button onClick={handleSave} color="primary">
                Lưu
              </Button>
              <Button onClick={() => setEditMode(false)} color="secondary">
                Hủy
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditMode(true)} color="primary">
              Chỉnh sửa
            </Button>
          )}
          <Button onClick={handleProfileClose}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AccountMenu;
