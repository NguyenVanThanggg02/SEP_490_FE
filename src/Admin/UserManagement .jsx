import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import axios from "axios"; // Đảm bảo bạn đã cài đặt axios bằng cách chạy 'npm install axios'

const UserManagement = () => {
  const [listUser, setListUser] = useState([]);
  const isBan = useState()
  
  // Lấy danh sách user từ API
  useEffect(() => {
    fetch("http://localhost:9999/users")
      .then((resp) => resp.json())
      .then((data) => {
        setListUser(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  // Hàm định dạng ngày tháng
  const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObject.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };

  const handleBanUser = (userId, isBan) => {
    axios
      .put(`http://localhost:9999/users/${userId}`, {
        isBan: !isBan, 
      })
      .then((response) => {
        if (response.status === 200) {
          const updatedUsers = listUser.map((user) =>
            user._id === userId ? { ...user, isBan: !isBan } : user
          );
          setListUser(updatedUsers);
        } else {
          console.error("Cập nhật thất bại");
        }
      })
      .catch((error) => {
        console.error("Đã xảy ra lỗi:", error);
      });
  };

  return (
    <Container fluid>
      <Row style={{ width: "100%", marginTop: "24px" }}>
        <Col md={12}>
          <div>
            <Row className="ml-1 mb-4">
              <h3>Quản Lí Khách Hàng</h3>
            </Row>
          </div>
          <Table striped bordered hover>
            <thead className="text-center">
              <tr>
                <th>ID</th>
                <th>Họ và Tên</th>
                <th>Giới tính</th>
                <th>Địa chỉ</th>
                <th>Ngày sinh</th>
                <th>Số điện thoại</th>
                <th>Gmail</th>
                <th>Tên tài khoản</th>
                <th>IsBan</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {listUser.map((u, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{u.fullname}</td>
                  <td>{u.gender}</td>
                  <td>{u.address}</td>
                  <td>{formatDate(u.birthday)}</td>
                  <td>{u.phone}</td>
                  <td>{u.gmail}</td>
                  <td>{u.username}</td>
                  <td>{u.isBan ? "True" : "False"}</td>
                  <td>
                    <Button
                      variant={u.isBan ? "success" : "danger"}
                      onClick={() => handleBanUser(u._id, u.isBan)} 
                    >
                      {u.isBan ? "Unban" : "Ban"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default UserManagement;
