import React, { useState } from "react";
import { Col, Container, Row, Table, Button } from "react-bootstrap";

const UserManagement = () => {
  const [listUser, setListUser] = useState([
    {
      fullname: "Nguyễn Văn A",
      gender: "Nam",
      address: "Hà Nội",
      birthday: "1990-01-15",
      phone: "0123456789",
      gmail: "nguyenvana@gmail.com",
      username: "nguyenvana",
      status: "Active",
    },
    {
      fullname: "Trần Thị B",
      gender: "Nữ",
      address: "TP. Hồ Chí Minh",
      birthday: "1992-03-22",
      phone: "0987654321",
      gmail: "tranthib@gmail.com",
      username: "tranthib",
      status: "Active",
    },
  ]);

  const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObject.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const toggleStatus = (index) => {
    setListUser((prevUsers) => {
      return prevUsers.map((user, i) => {
        if (i === index) {
          return { ...user, status: user.status === "Active" ? "Ban" : "Active" };
        }
        return user;
      });
    });
  };

  return (
    <Container fluid>
      <Row style={{ width: "100%" }}>
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
                <th>Trạng thái</th>
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
                  <td>{u.status}</td>
                  <td>
                    <Button
                      variant={u.status === "Active" ? "danger" : "success"}
                      onClick={() => toggleStatus(index)}
                    >
                      {u.status === "Active" ? "Ban" : "Activate"}
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
