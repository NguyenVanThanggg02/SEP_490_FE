import React, { useEffect, useState } from "react";
import { Col, Container, Row, Card, Button } from "react-bootstrap";
import { Eye, HouseAddFill, Person } from "react-bootstrap-icons";
import axios from "axios";
import CommunityStandards from "./CommunityStandards";
import DetailForAdmin from "./DetailForAdmin";
import { Paginator } from "primereact/paginator";

const PostManagement = () => {
  const [spaces, setSpaces] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [rows, setRows] = useState(6);
  const [first, setFirst] = useState(0);
  const productsOnPage = spaces.slice(first, first + rows);
  const [, setCurrentPage] = useState(1);
  useEffect(() => {
    axios
      .get("http://localhost:9999/spaces/all")
      .then((response) => {
        const sortedSpaces = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setSpaces(sortedSpaces);
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
      .then(() => {
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

  const handleReject = (postId, selectedReasons, customReason) => {
    axios
      .put(`http://localhost:9999/spaces/update/${postId}`, {
        censorship: "Từ chối",
        reasons: selectedReasons,
        customReason: customReason ? [customReason] : [],

      })
      .then(() => {
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
  const onPageChange = (event) => {
    setFirst(event?.first);
    setCurrentPage(event.page + 1);
    setRows(event?.rows);
  };
  return (
    <Container fluid className="py-4">
      {!showDetail ? (
        <>
          <Row>
            <div style={{ display: "flex", gap: 20, marginBottom: "20px" }}>
              <div
                style={{
                  width: "150px",
                  height: "110px",
                  backgroundColor: "#cccc",
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p><Person style={{ fontSize: '30px' }} />Chủ cho thuê</p>
              </div>
              <div
                style={{
                  width: "120px",
                  height: "110px",
                  backgroundColor: "#4c68a1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HouseAddFill style={{ color: "white" }} />
              </div>
              <div
                style={{
                  width: "120px",
                  height: "110px",
                  backgroundColor: "#4c68a1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HouseAddFill style={{ color: "white" }} />
              </div>
              <div
                style={{
                  width: "120px",
                  height: "110px",
                  backgroundColor: "#4c68a1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HouseAddFill style={{ color: "white" }} />
              </div>
              <div
                style={{
                  width: "120px",
                  height: "110px",
                  backgroundColor: "#4c68a1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HouseAddFill style={{ color: "white" }} />
              </div>
            </div>
            <Row>
            {productsOnPage.map((s, index) => (
                <Col md={4} key={s._id} className="mb-4">
                  <Card className="shadow-sm h-100">
                    <Card.Img
                      variant="top"
                      src={s.images[0]?.url || "placeholder.jpg"}
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        borderTopLeftRadius: "5px",
                        borderTopRightRadius: "5px",
                      }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="text-truncate">
                        {s.name}
                      </Card.Title>
                      <Card.Text className="text-muted">
                        <strong>Chủ không gian: </strong>
                        {s.userId?.fullname || "Không rõ"}
                      </Card.Text>
                      <Card.Text className="">
                        <strong>Trạng thái: </strong>
                        <span
                          className={
                            s.censorship === "Chấp nhận"
                              ? "text-success"
                              : s.censorship === "Từ chối"
                                ? "text-danger"
                                : "text-warning"
                          }
                        >
                          {s.censorship}
                        </span>
                      </Card.Text>
                      <div className="mt-auto d-flex justify-content-between">
                        <Button
                          variant="success"
                          onClick={() => handleAccept(s._id)}
                          disabled={
                            s.censorship === "Chấp nhận"
                          }
                        >
                          Chấp Nhận
                        </Button>
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
                        <Eye
                          style={{
                            color: "#3399FF",
                            fontSize: "30px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleViewDetail(s._id)}
                        />
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
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
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!showDetail && (
          <Paginator
            style={{ backgroundColor: "#f9f9f9" }}
            first={first}
            rows={rows}
            totalRecords={spaces.length}
            onPageChange={onPageChange}
          />
        )}
      </Row>
    </Container>
  );
};

export default PostManagement;