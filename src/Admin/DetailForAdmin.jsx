import { Box, Typography, Card, CardContent, Grid, List, ListItemIcon, ListItem, ListItemText, Divider } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Button, Modal, ProgressBar } from "react-bootstrap";
import { Image } from "antd";
import { formatNumberToVND } from "../utils/numberFormatter";
import * as MuiIcons from '@mui/icons-material';
import BlockIcon from "@mui/icons-material/Block";
import { Textarea } from "react-bootstrap-icons";
import { MapShopDetail } from "../components/MapShopDetail";

const DetailForAdmin = ({ id, onBack }) => {
  const [space, setSpace] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const now = 60;

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/spaces/${id}`);
        setSpace(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceData();
  }, [id]);

  const handleShowAllImages = () => {
    setShowAllImages(true);
  };

  const handleCloseModal = () => {
    setShowAllImages(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const remainingImagesCount = space.images ? space.images.length - 3 : 0;

  return (
    <Container style={{ maxWidth: "900px", marginTop: "20px" }}>
      <Button className="btn btn-success m-3" onClick={onBack}>
        Quay lại
      </Button>
      <Card
        sx={{
          padding: "24px",
          borderRadius: "12px",
          boxShadow: 6,
          backgroundColor: "#f9f9f9",
        }}
      >
        <CardContent>
          {/* Tiêu đề */}
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{ fontWeight: "bold", color: "#3f51b5" }}
          >
            {space.name}
          </Typography>

          <Grid container spacing={3}>
            {/* Phần hình ảnh */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mb={2}>
                <Grid container spacing={2}>
                  <Image.PreviewGroup>
                    {space.images &&
                      space.images.slice(0, 3).map((imgUrl, index) => (
                        <Grid item xs={4} key={index}>
                          <Box position="relative">
                            <Image
                              src={imgUrl.url}
                              alt={`Space image ${index + 1}`}
                              style={{
                                borderRadius: "12px",
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />
                            {index === 2 && remainingImagesCount > 0 && (
                              <Box
                                position="absolute"
                                top="0"
                                left="0"
                                right="0"
                                bottom="0"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                bgcolor="rgba(0, 0, 0, 0.6)"
                                color="white"
                                fontSize="20px"
                                fontWeight="bold"
                                borderRadius="12px"
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": {
                                    bgcolor: "rgba(0, 0, 0, 0.8)",
                                  },
                                }}
                                onClick={handleShowAllImages}
                              >
                                +{remainingImagesCount}
                              </Box>
                            )}
                          </Box>
                        </Grid>
                      ))}
                  </Image.PreviewGroup>
                </Grid>
              </Box>
            </Grid>

            {/* Phần thông tin */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {[
                  { label: "Diện tích", value: space.area },
                  { label: "Giá theo giờ", value: space.pricePerHour },
                  { label: "Giá theo ngày", value: space.pricePerDay },
                  { label: "Giá theo tháng", value: space.pricePerMonth },
                ].map((info, index) => (
                  <Grid item xs={6} key={index}>
                    <Card
                      variant="outlined"
                      sx={{
                        padding: "12px",
                        borderRadius: "10px",
                        boxShadow: 2,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <Typography variant="subtitle2" color="textSecondary">
                        {info.label}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#333" }}
                      >
                        {formatNumberToVND(info.value)}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>

          {/* Mô tả */}
          <Typography
            variant="h6"
            sx={{ marginTop: "16px", fontWeight: "bold", color: "#3f51b5" }}
          >
            Mô tả
          </Typography>
          <Typography
            variant="body1"
            sx={{ marginTop: "8px", color: "textSecondary" }}
          >
            {space.description}
          </Typography>

          {/* Tiện nghi */}
          <Typography
            variant="h6"
            sx={{ marginTop: "16px", fontWeight: "bold", color: "#3f51b5" }}
          >
            Tiện nghi
          </Typography>
          <List>
            {space?.appliancesId?.appliances?.length > 0 ? (
              <Grid container>
                {space.appliancesId.appliances.map((appliance) => {
                  const IconAppliances = MuiIcons[appliance.iconName];
                  return (
                    <Grid item xs={6} key={appliance._id}>
                      <ListItem>
                        <ListItemIcon>
                          {IconAppliances && (
                            <IconAppliances sx={{ color: "#3f51b5" }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={appliance.name}
                          primaryTypographyProps={{ fontSize: "14px" }}
                        />
                      </ListItem>
                    </Grid>
                  );
                })}
              </Grid>
            ) : (
              <Typography variant="body2">No appliances available</Typography>
            )}
          </List>

          {/* Nội quy */}
          <Typography
            variant="h6"
            sx={{ marginTop: "16px", fontWeight: "bold", color: "#3f51b5" }}
          >
            Nội quy
          </Typography>
          <List>
            {space.rulesId &&
            (space.rulesId.rules.length > 0 ||
              space.rulesId.customeRules.length > 0) ? (
              <Grid container>
                {[...space.rulesId.rules, ...space.rulesId.customeRules].map(
                  (rule, index) => (
                    <Grid item xs={6} key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <BlockIcon sx={{ color: "#f44336" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={rule}
                          primaryTypographyProps={{ fontSize: "14px" }}
                        />
                      </ListItem>
                    </Grid>
                  )
                )}
              </Grid>
            ) : (
              <ListItem>
                <ListItemText primary="No rules available" />
              </ListItem>
            )}
          </List>

          <Typography
            variant="h6"
            sx={{ marginTop: "16px", fontWeight: "bold", color: "#3f51b5" }}
          >
            Vị trí không gian: {space?.location || ""}
          </Typography>

          <Divider
            sx={{ bgcolor: "gray", margin: "16px auto", width: "100%" }}
          />
        </CardContent>
      </Card>

      <Modal show={showAllImages} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tất cả ảnh</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {space.images &&
            space.images.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl.url}
                alt={`Space image ${index + 1}`}
                style={{ width: "100%", padding: "5px" }}
              />
            ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DetailForAdmin;
