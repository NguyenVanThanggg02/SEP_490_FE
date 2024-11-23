import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Eye, HouseAddFill, Person } from "react-bootstrap-icons";
import axios from "axios";
import CommunityStandards from "./CommunityStandards";
import DetailForAdmin from "./DetailForAdmin";
import { Paginator } from "primereact/paginator";
import { Grid, Card, CardMedia, CardContent, Button, Typography, Box, IconButton } from '@mui/material';
import { dateFormatterDDMMYYY } from "../utils/dateFormatter";

const PostManagement = () => {
  const [spaces, setSpaces] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [rows, setRows] = useState(9);
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
      .put(`http://localhost:9999/spaces/update-censorship/${postId}`, {
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
                <p>
                  <Person style={{ fontSize: "30px" }} />
                  Chủ cho thuê
                </p>
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
            <Grid container spacing={4} style={{marginBottom:'20px'}}>
              {productsOnPage.map((product) => (
                <Grid item md={4} key={product._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: 3,
                      borderRadius: 2,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="220"
                      image={product.images[0]?.url || "placeholder.jpg"}
                      alt={product.name}
                      sx={{
                        objectFit: "cover",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    />
                    <CardContent sx={{ flex: 1, padding: 2 }}>
                      <Typography
                        variant="h6"
                        noWrap
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        <strong>Chủ không gian: </strong>
                        {product.userId?.fullname || "Không rõ"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        <strong>Ngày đăng: </strong>
                        {dateFormatterDDMMYYY(product.createdAt || "Không rõ")}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ mt: 1, display: "flex", alignItems: "center" }}
                      >
                        <strong>Trạng thái: </strong>
                        <span
                          className={
                            product.censorship === "Chấp nhận"
                              ? "text-success"
                              : product.censorship === "Từ chối"
                                ? "text-danger"
                                : "text-warning"
                          }
                          style={{
                            marginLeft: "8px",
                            fontWeight: 600,
                            color:
                              product.censorship === "Chấp nhận"
                                ? "#28a745"
                                : product.censorship === "Từ chối"
                                  ? "#dc3545"
                                  : "#ffc107",
                          }}
                        >
                          {product.censorship}
                        </span>
                      </Typography>
                    </CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAccept(product._id)}
                        disabled={product.censorship === "Chấp nhận"}
                        sx={{
                          minWidth: 120,
                          padding: "8px 16px",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          borderRadius: "8px",
                          textTransform: "none",
                        }}
                      >
                        Chấp Nhận
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => openRejectDialog(product._id)}
                        disabled={
                          product.censorship === "Chấp nhận" ||
                          product.censorship === "Từ chối"
                        }
                        sx={{
                          minWidth: 120,
                          padding: "8px 16px",
                          fontWeight: 600,
                          fontSize: "0.875rem",
                          borderRadius: "8px",
                          textTransform: "none",
                        }}
                      >
                        Từ Chối
                      </Button>
                      <IconButton
                        sx={{
                          color: "#3399FF",
                          fontSize: "30px",
                          cursor: "pointer",
                          alignSelf: "center",
                          "&:hover": {
                            color: "#007bff",
                          },
                        }}
                        onClick={() => handleViewDetail(product._id)}
                      >
                        <Eye />
                      </IconButton>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
            style={{ backgroundColor: "white" }}
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