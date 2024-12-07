import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import axios from "axios";
import CommunityStandards from "./CommunityStandards";
import { Link } from "react-router-dom";

const PMana = () => {
  const [spaces, setSpaces] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axios.get("http://localhost:9999/spaces");
        setSpaces(response.data);
      } catch (error) {
        console.error("Error fetching spaces:", error);
      }
    };

    fetchSpaces();
  }, []);

  const updateCensorship = async (postId, censorship, communityStandardsId = null) => {
    try {
      const endpoint = communityStandardsId
        ? `http://localhost:9999/spaces/update-censorship/${postId}`
        : `http://localhost:9999/spaces/update/${postId}`;

      const payload = communityStandardsId
        ? { censorship, communityStandardsId }
        : { censorship };

      await axios.put(endpoint, payload);

      setSpaces((prevSpaces) =>
        prevSpaces.map((space) =>
          space._id === postId ? { ...space, censorship } : space
        )
      );
    } catch (error) {
      console.error("Error updating censorship:", error);
    }
  };

  const handleAccept = (postId) => {
    const selectedSpace = spaces.find((space) => space._id === postId);

    if (selectedSpace?.censorship !== "Chấp nhận") {
      updateCensorship(postId, "Chấp nhận");
    }
  };

  const handleReject = (postId, communityStandardsId) => {
    updateCensorship(postId, "Từ chối", communityStandardsId);
  };

  const openRejectDialog = (postId) => {
    setCurrentPostId(postId);
    setVisible(true);
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
                    <Link to={"/detail-admin"} state={{ id: s._id }}>
                      <Eye style={{ color: "#3399FF", fontSize: "30px" }} />
                    </Link>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => handleAccept(s._id)}
                      disabled={
                        s.censorship === "Chấp nhận" || s.censorship === "Từ chối"
                      }
                    >
                      Chấp Nhận
                    </Button>
                  </td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => openRejectDialog(s._id)}
                      disabled={
                        s.censorship === "Chấp nhận" || s.censorship === "Từ chối"
                      }
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
      {visible && (
        <CommunityStandards
          visible={visible}
          setVisible={setVisible}
          handleReject={handleReject}
          postId={currentPostId}
        />
      )}
    </Container>
  );
};

export default PMana;
