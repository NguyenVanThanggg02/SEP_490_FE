import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import axios from "axios";

const PostManagement = () => {
  const [spaces, setSpaces] = useState([]);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/spaces")
      .then((response) => {
        setSpaces(response.data);
      })
      .catch((error) => {
        console.error("Error fetching spaces:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9999/rules")
      .then((response) => {
        console.log(response.data);
        setRules(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rules:", error);
      });
  }, []);

  const handleAccept = (postId) => {
    const selectedSpace = spaces.find((space) => space._id === postId);

    if (selectedSpace.censorship === "Chấp nhận") {
      return;
    }

    axios
      .put(`http://localhost:9999/spaces/update/${postId}`, { censorship: "Chấp nhận" })
      .then((response) => {
        setSpaces((prevSpaces) =>
          prevSpaces.map((space) =>
            space._id === postId ? { ...space, censorship: "Chấp nhận" } : space
          )
        );
      })
      .catch((error) => {
        console.error("Error updating censorship:", error);
      });
  };

  const handleReject = (postId) => {
    const selectedSpace = spaces.find((space) => space._id === postId);

    if (selectedSpace.censorship === "Chấp nhận") {
      return;
    }

    axios
      .put(`http://localhost:9999/spaces/update-censorship/${postId}`, { censorship: "Từ chối" })
      .then((response) => {
        setSpaces((prevSpaces) =>
          prevSpaces.map((space) =>
            space._id === postId ? { ...space, censorship: "Từ chối" } : space
          )
        );
      })
      .catch((error) => {
        console.error("Error updating censorship:", error);
      });
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
              {spaces.map((s, index) => (
                <tr key={s._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={s.images[0]}
                      alt={s.name}
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                  <td>{s.name}</td>
                  <td>{s.userId?.fullname || "Unknown"}</td>
                  <td>
                    <Eye style={{ color: "#3399FF", fontSize: "30px" }} />
                  </td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleAccept(s._id)}
                      disabled={s.censorship === "Chấp nhận"}
                    >
                      Chấp Nhận
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(s._id)}
                      disabled={s.censorship === "Chấp nhận" || s.censorship === "Từ chối"}
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
