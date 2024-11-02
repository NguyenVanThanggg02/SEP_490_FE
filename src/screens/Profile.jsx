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
import { CameraFill } from "react-bootstrap-icons";

const Profile = () => {
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

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [success, error]);

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

  const handleFileChange = async (event) => {
    const target = event.target;
    const files = target.files;
  
    if (files && files.length > 0) {
  
      
    } else {
      console.log("No files selected.");
    }
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
      <Container className="flex-grow-1 py-4">
        <h4
          className="text-center mb-4"
          style={{ fontWeight: "bold", color: "#343a40" }}
        >
          Cài đặt tài khoản
        </h4>
        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="text-center">
            {success}
          </Alert>
        )}

        <Card
          className="border-0 shadow-sm rounded"
          style={{ overflow: "hidden" }}
        >
          <Row noGutters>
            <Col md={3} className="bg-light p-4">
              <Nav
                variant="pills"
                className="flex-column"
                style={{ fontWeight: 500 }}
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
                        color: activeTab === tab.key ? "#fff" : "#495057",
                        backgroundColor:
                          activeTab === tab.key ? "#000" : "transparent",
                        padding: "0.85rem 1.5rem",
                        borderRadius: "0.25rem",
                      }}
                      className="mb-2"
                    >
                      {tab.label}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>

            <Col md={9}>
              <Tab.Content className="p-4">
                {/* General Tab */}
                <Tab.Pane eventKey="general">
                  <Card.Body>
                    <Form.Group
                      className="text-center mb-4"
                      style={{ position: "relative" }}
                    >
                      <Image
                        src={
                          userData.avatar || "https://via.placeholder.com/150"
                        }
                        roundedCircle
                        className="mb-3"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      {isEditingUser && ( // Chỉ hiển thị CameraFill khi đang chỉnh sửa
                        <div
                          className="edit-image-button"
                          style={{
                            position: "absolute",
                            bottom: "16px",
                            left: "53%",
                            transform: "translateX(-50%)",
                            cursor: "pointer",
                            backgroundColor: "#CCCCCC",
                            borderRadius: "50%",
                            padding: "6px",
                          }}
                          onClick={() => document.getElementById("chooseFile")?.click()}
                        >
                          <CameraFill
                            style={{ fontSize: "25px", color: "white" }}
                          />
                          <input
                            type="file"
                            id="chooseFile"
                            hidden
                            onChange={handleFileChange}
                          />
                        </div>
                      )}
                    </Form.Group>

                    {[
                      { label: "Tên tài khoản", field: "username" },
                      { label: "Họ và tên", field: "fullname" },
                      { label: "Email", field: "gmail" },
                      { label: "Giới tính", field: "gender" },
                      { label: "Số điện thoại", field: "phone" },
                      { label: "Địa chỉ", field: "address" },
                    ].map((field, idx) => (
                      <Form.Group key={idx} className="mb-3">
                        <Form.Label style={{ fontWeight: 500 }}>
                          {field.label}
                        </Form.Label>
                        <Form.Control
                          type={field.label === "Email" ? "email" : "text"}
                          value={editData[field.field] || ""}
                          onChange={(e) =>
                            handleChange(field.field, e.target.value)
                          }
                          disabled={!isEditingUser}
                          style={{ borderRadius: "0.25rem" }}
                        />
                      </Form.Group>
                    ))}
                    <div className="d-flex justify-content-end mt-4">
                      {!isEditingUser ? (
                        <Button
                          variant="primary"
                          onClick={() => setIsEditingUser(true)}
                        >
                          Chỉnh sửa thông tin
                        </Button>
                      ) : (
                        <>
                          <Button variant="success" onClick={handleSaveUser}>
                            Lưu thông tin
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => setIsEditingUser(false)}
                            className="ml-2"
                          >
                            Hủy
                          </Button>
                        </>
                      )}
                    </div>
                  </Card.Body>
                </Tab.Pane>

                {/* Change Password Tab */}
                <Tab.Pane eventKey="change-password">
                  <ChangePass />
                </Tab.Pane>

                {/* Bank Info Tab */}
                <Tab.Pane eventKey="bank-info">
                  <Card.Body>
                    <BankAccount />
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

export default Profile;
