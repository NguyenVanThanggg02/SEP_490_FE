import React, { useState } from "react";
import { Col, Container, Row, Table, Button } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";

const PostManagement = () => {
  const [listPosts, setListPosts] = useState([
    {
      _id: "1",
      img: "https://picsum.photos/200", // Link hình ảnh placeholder
      spaceName: "Wedding A",
      ownerName: "Nguyễn Văn A",
      status: "Pending",
    },
    {
      _id: "2",
      img: "https://picsum.photos/200", // Link hình ảnh placeholder
      spaceName: "Studio B",
      ownerName: "Trần Thị B",
      status: "Completed",
    },
  ]);

  const handleAccept = (postId) => {
    setListPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, status: "Completed" } : post
      )
    );
  };

  const handleReject = (postId) => {
    setListPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, status: "Cancel" } : post
      )
    );
  };

  return (
    <Container fluid>
      <Row className="ml-1 mb-4 mt-4"></Row>
      <Row style={{ width: "100%" }}>
        <Col md={12}>
          <Table striped bordered hover>
            <thead className="text-center">
              <tr>
                <th>STT</th>
                <th>Hình ảnh</th>
                <th>Tên không gian</th>
                <th>Tên chủ không gian</th>
                <th>Chi tiết</th>
                <th colSpan={2}>Trạng thái</th> 
              </tr>
            </thead>

            <tbody className="text-center">
              {listPosts.map((post, index) => (
                <tr key={post._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={post.img}
                      alt={post.spaceName}
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                  <td>{post.spaceName}</td>
                  <td>{post.ownerName}</td>
                  <td><Eye style={{color:'#3399FF', fontSize:'30px'}}/></td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleAccept(post._id)}
                      disabled={post.status !== "Pending"}
                    >
                      Chấp Nhận
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(post._id)}
                      disabled={post.status !== "Pending"}
                    >
                      Từ Chối
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

export default PostManagement;