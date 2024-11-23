import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { LockOutlined, LockOpenOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ChangePassAdmin = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [username, setUsername] = useState("");
  const nav = useNavigate();

  const handleUpdate = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Token không tồn tại. Vui lòng đăng nhập lại!");
      nav("/login");
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.user.id;

    try {
      const response = await axios.get(`http://localhost:9999/users/${id}`);
      setUsername(response.data.username);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy thông tin người dùng.");
      return;
    }

    if (!oldPass || !newPass || !reNewPass) {
      toast.error("Vui lòng điền tất cả các trường");
      return;
    }
    if (newPass !== reNewPass) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    if (oldPass === newPass) {
      toast.error("Mật khẩu mới phải khác với mật khẩu cũ");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:9999/users/changepass/${username}`,
        { oldPassword: oldPass, newPassword: newPass }
      );
      if (response.data.status) {
        toast.success("Thay đổi mật khẩu thành công!");
        setOldPass("");
        setNewPass("");
        setReNewPass("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Thay đổi mật khẩu thất bại !!!"
      );
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{ mt: 8, mb: 15 }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxWidth: 600,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" mb={3}>
          Đổi Mật Khẩu
        </Typography>

        <Box display="flex" alignItems="center" mb={2}>
          <LockOutlined color="action" sx={{ mr: 1 }} />
          <TextField
            fullWidth
            label="Mật khẩu cũ"
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            variant="outlined"
          />
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <LockOpenOutlined color="action" sx={{ mr: 1 }} />
          <TextField
            fullWidth
            label="Mật khẩu mới"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            variant="outlined"
          />
        </Box>
        <Box display="flex" alignItems="center" mb={3}>
          <LockOpenOutlined color="action" sx={{ mr: 1 }} />
          <TextField
            fullWidth
            label="Nhập lại mật khẩu mới"
            type="password"
            value={reNewPass}
            onChange={(e) => setReNewPass(e.target.value)}
            variant="outlined"
          />
        </Box>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleUpdate}
        >
          Lưu
        </Button>
      </Box>
    </Box>
  );
};

export default ChangePassAdmin;
