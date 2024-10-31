import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Nav,
  Form,
  Button,
  Alert,
  Image,
} from "react-bootstrap";
import ChangePass from "./ChangePass";
import BankAccount from "./BankAccount";

const ProfileTemplate = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [userData, setUserData] = useState({});
  const [editData, setEditData] = useState({});

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditingUser, setIsEditingUser] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = () => {
    axios
      .get(`http://localhost:9999/users/${userId}`)
      .then((response) => {
        setUserData(response.data);
        setEditData(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError("Không thể tải dữ liệu người dùng.");
      });
  };

  const handleChange = (field, value) => {
    setEditData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSaveUser = () => {
    axios
      .put(`http://localhost:9999/users/${userId}`, editData)
      .then(() => {
        setSuccess("Cập nhật thông tin người dùng thành công!");
        setError(null);
        setIsEditingUser(false);
        fetchUserData();
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
        setError("Cập nhật thông tin người dùng thất bại.");
      });
  };

  return (
    <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
      <Container className="flex-grow-1 py-3">
        <h4
          style={{ fontWeight: "bold", color: "#333", marginBottom: "1.5rem" }}
        >
          Cài đặt tài khoản
        </h4>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Card style={{ borderColor: "#ddd" }}>
          <Row noGutters className="border-light">
            <Col md={3} className="pt-0">
              <Nav
                variant="pills"
                className="flex-column list-group-flush"
                style={{ borderRight: "1px solid #ddd" }}
              >
                {[
                  { key: "general", label: "Thông tin chung" },
                  { key: "change-password", label: "Đổi mật khẩu" },
                  { key: "bank-info", label: "Thông tin ngân hàng" },
                ].map((tab) => (
                  <Nav.Item key={tab.key}>
                    <Nav.Link
                      eventKey={tab.key}
                      style={{
                        color: activeTab === tab.key ? "#fff" : "#333",
                        backgroundColor:
                          activeTab === tab.key ? "#333" : "transparent",
                        borderColor: "transparent",
                        padding: "0.85rem 1.5rem",
                      }}
                    >
                      {tab.label}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>
            <Col md={9}>
              <Tab.Content>
                {/* General Tab */}
                <Tab.Pane eventKey="general">
                  <Card.Body>
                    <Form.Group
                      className="text-center"
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <Image
                        src={
                          userData.avatar || "https://via.placeholder.com/150"
                        }
                        roundedCircle
                        className="mb-3"
                        style={{ width: "150px", height: "150px" }}
                      />
                      <Button
                        variant="outline-secondary"
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          opacity: 0,
                          transition: "opacity 0.3s",
                        }}
                        className="edit-image-button"
                      >
                        Chỉnh sửa ảnh
                      </Button>
                    </Form.Group>
                    {[
                      { label: "Tên tài khoản", field: "username" },
                      { label: "Họ và tên", field: "fullname" },
                      { label: "Email", field: "gmail" },
                      { label: "Giới tính", field: "gender" },
                      { label: "Số điện thoại", field: "phone" },
                      { label: "Địa chỉ", field: "address" },
                    ].map((field, idx) => (
                      <Form.Group key={idx}>
                        <Form.Label style={{ color: "#333" }}>
                          {field.label}
                        </Form.Label>
                        <Form.Control
                          type={field.label === "Email" ? "email" : "text"}
                          value={editData[field.field] || ""}
                          onChange={(e) =>
                            handleChange(field.field, e.target.value)
                          }
                          disabled={!isEditingUser}
                        />
                      </Form.Group>
                    ))}
                    <Button
                      variant="dark"
                      onClick={() => setIsEditingUser(true)}
                    >
                      Chỉnh sửa thông tin
                    </Button>
                    {isEditingUser && (
                      <Button
                        variant="dark"
                        onClick={handleSaveUser}
                        className="ml-2"
                      >
                        Lưu thông tin người dùng
                      </Button>
                    )}
                  </Card.Body>
                </Tab.Pane>

                {/* Change Password Tab */}
                <Tab.Pane eventKey="change-password">
                  <ChangePass />
                </Tab.Pane>

                {/* Bank Info Tab */}
                <Tab.Pane eventKey="bank-info">
                  <Card.Body>
                    <BankAccount></BankAccount>
                  </Card.Body>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Card>
      </Container>
    </Tab.Container>
  );
};

export default ProfileTemplate;
