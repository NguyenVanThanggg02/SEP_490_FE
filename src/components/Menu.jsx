import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import '../style/Menu.css'
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
    handleClose();
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
  const handleMannaPost = () => {
    handleClose();
    navigate("/posted");
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.put(`http://localhost:9999/users/${userId}`, formData);
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
            <MenuItem onClick={handleProfileOpen}>
              <PersonVcard style={{ fontSize: "20px", marginRight: "10px" }} />
              Thông tin cá nhân
            </MenuItem>
            <MenuItem onClick={handleFavorites}>
              <Heart style={{ fontSize: "20px", marginRight: "10px" }} />
              Danh sách yêu thích
            </MenuItem>
            <MenuItem onClick={handleChangePass}>
              <ArrowRepeat style={{ fontSize: "20px", marginRight: "10px" }} />
              Thay đổi mật khẩu
            </MenuItem>
            {role === "2" && (
              <MenuItem onClick={handleMannaPost}>
                <Calendar2Check
                  style={{ fontSize: "20px", marginRight: "10px" }}
                />
                Quản Lí Bài Đăng
              </MenuItem>
            )}

            <MenuItem onClick={handleAddFunds}>
              <Wallet style={{ fontSize: "20px", marginRight: "10px" }} />
              Nạp tiền
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
