import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";
import axios from "axios";
import CommunityStandards from "./CommunityStandards";
import DetailForAdmin from "./DetailForAdmin";

const PostManagement = () => {
  const [spaces, setSpaces] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

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

  const handleAccept = (postId) => {
    const selectedSpace = spaces.find((space) => space._id === postId);

    if (selectedSpace.censorship === "Chấp nhận") {
      return;
    }

    axios
      .put(`http://localhost:9999/spaces/update/${postId}`, {
        censorship: "Chấp nhận",
      })
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

  const handleReject = (postId, communityStandardsId) => {
    axios
      .put(`http://localhost:9999/spaces/update-censorship/${postId}`, {
        censorship: "Từ chối",
        communityStandardsId: communityStandardsId,
      })
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

  const openRejectDialog = (postId) => {
    setCurrentPostId(postId);
    setVisible(true);
  };

  const handleViewDetail = (postId) => {
    setSelectedSpaceId(postId);
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
  };

  return (
    <Container fluid>
      {!showDetail ? (
        <>
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
                          style={{ width: "100px", height: "150px",width:'150px' }}
                        />
                      </td>
                      <td>{s.name}</td>
                      <td>{s.userId?.fullname || "Unknown"}</td>
                      <td>
                        <Eye
                          style={{
                            color: "#3399FF",
                            fontSize: "30px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewDetail(s._id)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="success"
                          onClick={() => handleAccept(s._id)}
                          disabled={
                            s.censorship === "Chấp nhận" ||
                            s.censorship === "Từ chối"
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
                            s.censorship === "Chấp nhận" ||
                            s.censorship === "Từ chối"
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
        </>
      ) : (
        <DetailForAdmin id={selectedSpaceId} onBack={handleBackToList} />
      )}
    </Container>
  );
};

export default PostManagement;
