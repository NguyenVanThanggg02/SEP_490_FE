import React, { useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { Lock, Unlock, Eye, EyeSlash } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ChangePass = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const [username, setUsername] = useState("");
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showReNewPass, setShowReNewPass] = useState(false);
  const nav = useNavigate();

  const handleUpdate = () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      toast.error("Token không tồn tại. Vui lòng đăng nhập lại!");
      nav("/login");
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    const id = payload.user.id;

    axios
      .get(`http://localhost:9999/users/${id}`)
      .then((response) => {
        setUsername(response.data.username);
      })
      .catch((error) => {
        console.error(error);
      });

    if (!username) {
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
    if (oldPass === newPass && oldPass === reNewPass) {
      toast.error("Mật khẩu mới phải khác với mật khẩu cũ");
      return;
    }

    axios
      .put(`http://localhost:9999/users/changepass/${username}`, {
        oldPassword: oldPass,
        newPassword: newPass,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success("Thay đổi mật khẩu thành công!");
          setOldPass("");
          setNewPass("");
          setReNewPass("");
          nav("/");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(
          error.response
            ? error.response.data.message
            : "Change password failed!"
        );
      });
  };

  // CSS styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "70px",
    marginBottom: "70px",
    height: "400px",
  };

  const inputIconStyle = {
    fontSize: "25px",
    border: "solid #CCCC 1px",
    height: "38px",
    color: "#808080",
    backgroundColor: "#EEEEEE",
    width: "30px",
  };

  const eyeIconStyle = {
    cursor: "pointer",
    marginLeft: "10px",
  };

  return (
    <Container fluid>
      <Container style={{ borderRadius: "30px" }}>
        <Row style={containerStyle}>
          <Col md={8}>
            <InputGroup className="mb-3">
              <Lock style={inputIconStyle} />
              <FormControl
                placeholder="Mật khẩu cũ"
                aria-label="Old Password"
                type={showOldPass ? "text" : "password"}
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />
              <span
                style={eyeIconStyle}
                onClick={() => setShowOldPass(!showOldPass)}
              >
                {showOldPass ? <EyeSlash /> : <Eye />}
              </span>
            </InputGroup>

            <InputGroup className="mb-3">
              <Unlock style={inputIconStyle} />
              <FormControl
                placeholder="Mật khẩu mới"
                aria-label="New Password"
                type={showNewPass ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <span
                style={eyeIconStyle}
                onClick={() => setShowNewPass(!showNewPass)}
              >
                {showNewPass ? <EyeSlash /> : <Eye />}
              </span>
            </InputGroup>

            <InputGroup className="mb-3">
              <Unlock style={inputIconStyle} />
              <FormControl
                placeholder="Nhập lại mật khẩu mới"
                aria-label="Re-enter New Password"
                type={showReNewPass ? "text" : "password"}
                value={reNewPass}
                onChange={(e) => setReNewPass(e.target.value)}
              />
              <span
                style={eyeIconStyle}
                onClick={() => setShowReNewPass(!showReNewPass)}
              >
                {showReNewPass ? <EyeSlash /> : <Eye />}
              </span>
            </InputGroup>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button variant="primary" onClick={handleUpdate}>
                Lưu
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default ChangePass;
