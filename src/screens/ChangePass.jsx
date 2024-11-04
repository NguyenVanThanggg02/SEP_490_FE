import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
  Card,
  Alert,
} from "react-bootstrap";
import { Lock, Unlock } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ChangePass = () => {
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
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.user.id;
  
      // Lấy username
      const response = await axios.get(`http://localhost:9999/users/${id}`);
      setUsername(response.data.username);
    } catch (error) {
      console.error(error);
      toast.error("Không thể lấy thông tin người dùng.");
      return;
    }
  
    // Kiểm tra giá trị các trường đầu vào
    if (!oldPass || !newPass || !reNewPass) {
      toast.error("Vui lòng điền tất cả các trường");
      return;
    }
    if (newPass !== reNewPass) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    if (oldPass === newPass && oldPass === reNewPass) {
      toast.error("Mật khẩu mới phải khác với mật khẩu cũ");
      return;
    }
  
    // Gọi API thay đổi mật khẩu
    try {
      const response = await axios.put(`http://localhost:9999/users/changepass/${username}`, {
        oldPassword: oldPass,
        newPassword: newPass,
      });
  
      if (response.data.status) {
        toast.success("Thay đổi mật khẩu thành công!");
        setOldPass("");
        setNewPass("");
        setReNewPass("");
        nav("/profile");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(
        error.response
          ? error.response.data.message
          : "Thay đổi mật khẩu thất bại!"
      );
    }
  };
  

  return (
   
      <Container
        fluid
        className="d-flex align-items-center justify-content-center"
        style={{
          height: "100vh",
          backgroundColor: "#f0f2f5",
        }}
      >
        <Card
          style={{
            width: "640px",
            maxWidth: "650px",
            padding: "10px 30px",
            borderRadius: "20px",
            boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)",
            border: "none",
          }}
        >
          <Card.Body>
            <h2
              className="text-center mb-4"
              style={{ fontWeight: "600", color: "#333" }}
            >
              Thay Đổi Mật Khẩu
            </h2>
            <p className="text-center mb-4 text-muted">
              Để bảo mật tài khoản của bạn, vui lòng không chia sẻ mật khẩu với
              người khác.
            </p>
            <Row>
              <Col md={12}>
                <InputGroup
                  className="mb-3"
                  style={{ borderRadius: "8px", overflow: "hidden" }}
                >
                  <InputGroup.Text
                    style={{ backgroundColor: "#e9ecef", border: "none" }}
                  >
                    <Lock style={{ fontSize: "22px", color: "#6c757d" }} />
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Mật khẩu cũ"
                    type="password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    style={{
                      border: "1px solid #ced4da",
                      height: "45px",
                    }}
                  />
                </InputGroup>

                <InputGroup
                  className="mb-3"
                  style={{ borderRadius: "8px", overflow: "hidden" }}
                >
                  <InputGroup.Text
                    style={{ backgroundColor: "#e9ecef", border: "none" }}
                  >
                    <Unlock style={{ fontSize: "22px", color: "#6c757d" }} />
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Mật khẩu mới"
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    style={{
                      border: "1px solid #ced4da",
                      height: "45px",
                    }}
                  />
                </InputGroup>

                <InputGroup
                  className="mb-4"
                  style={{ borderRadius: "8px", overflow: "hidden" }}
                >
                  <InputGroup.Text
                    style={{ backgroundColor: "#e9ecef", border: "none" }}
                  >
                    <Unlock style={{ fontSize: "22px", color: "#6c757d" }} />
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Nhập lại mật khẩu mới"
                    type="password"
                    value={reNewPass}
                    onChange={(e) => setReNewPass(e.target.value)}
                    style={{
                      border: "1px solid #ced4da",
                      height: "45px",
                    }}
                  />
                </InputGroup>

                <Button
                  variant="primary"
                  onClick={handleUpdate}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    backgroundColor: "#007bff",
                    border: "none",
                  }}
                >
                  Cập Nhật Mật Khẩu
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
  );
};

export default ChangePass;
