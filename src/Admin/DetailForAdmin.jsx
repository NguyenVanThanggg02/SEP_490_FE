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
      <Card sx={{ padding: "20px", borderRadius: "10px", boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            {space.name}
          </Typography>

          <Grid container spacing={3}>
            {/* Image Section */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
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
                                borderRadius: "8px",
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                              }}
                            />
                            {/* Overlay for the last image if there are more than 3 images */}
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
                                bgcolor="rgba(0, 0, 0, 0.5)"
                                color="white"
                                fontSize="24px"
                                fontWeight="bold"
                                borderRadius="8px"
                                sx={{
                                  cursor: "pointer",
                                  "&:hover": {
                                    bgcolor: "rgba(0, 0, 0, 0.7)",
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

            {/* Information Section */}
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {[
                  { label: "Diện tích", value: space.area },
                  { label: "Giá theo giờ", value: space.pricePerHour },
                  { label: "Giá theo ngày", value: space.pricePerDay },
                  // { label: "Giá theo tuần", value: space.pricePerWeek },
                  { label: "Giá theo tháng", value: space.pricePerMonth },
                ].map((info, index) => (
                  <Grid item xs={6} key={index}>
                    <Card
                      variant="outlined"
                      sx={{ padding: "10px", borderRadius: "8px" }}
                    >
                      <Typography variant="subtitle1" color="textSecondary">
                        {info.label}
                      </Typography>
                      <Typography variant="h6">
                        {formatNumberToVND(info.value)}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
          <Typography
            variant="h6"
            className="pb-2"
            sx={{ fontSize: "20px", fontWeight: "700" }}
            gutterBottom
          >
            Mô tả
          </Typography>
          <Typography variant="body1" color="textSecondary" mt={4}>
            {space.description}
          </Typography>
          <Typography
            variant="h6"
            className="pb-2"
            sx={{ fontSize: "20px", fontWeight: "700" }}
            gutterBottom
          >
            Tiện nghi
          </Typography>
          <List>
            {space?.appliancesId?.appliances?.length > 0 ? (
              <Grid container>
                {space.appliancesId.appliances?.map((appliance) => {
                  const IconAppliances = MuiIcons[appliance.iconName];
                  return (
                    <Grid item xs={6} key={appliance._id}>
                      {" "}
                      {/* Mỗi item chiếm 50% chiều rộng */}
                      <ListItem>
                        <ListItemIcon>
                          {IconAppliances ? (
                            <IconAppliances sx={{ color: "black" }} />
                          ) : null}
                        </ListItemIcon>
                        <ListItemText
                          sx={{ color: "black", fontSize: "10px" }}
                          primary={appliance.name}
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
          <Typography
            variant="h6"
            className="pb-2"
            sx={{ fontSize: "20px", fontWeight: "700" }}
            gutterBottom
          >
            Diện tích
          </Typography>
          <div style={{ flexDirection: "row" }}>
            <Textarea style={{ fontWeight: "bold", fontSize: "25px" }} />
            <b style={{ fontSize: "18px", marginLeft: "20px" }}>
              {space.area}m2
            </b>
          </div>
          <Typography
            variant="h6"
            className="pb-2"
            sx={{ fontSize: "20px", fontWeight: "700" }}
            gutterBottom
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
                          <BlockIcon /> {/* Icon ví dụ */}
                        </ListItemIcon>
                        <ListItemText primary={rule} />
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
            className="pb-2"
            sx={{ fontSize: "20px", fontWeight: "700" }}
            gutterBottom
          >
            Vị trí không gian: {space?.location || ""}
          </Typography>

          <Divider
            sx={{
              bgcolor: "gray",
              margin: "20px auto",
              width: "100%",
            }}
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
