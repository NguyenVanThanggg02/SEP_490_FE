import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Box,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Comment from "./Comment";
import { Link, useParams } from "react-router-dom";
import { ImageList, ImageListItem, Dialog, DialogContent } from '@mui/material';
import { Col, Row } from "react-bootstrap";
import { FlagFill } from "react-bootstrap-icons";
import Reports from "./Reports";


function SpaceDetails() {
  const { id } = useParams();
  const [spaceData, setSpaceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visible, setVisible] = useState(false);

  const handleClickOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };


  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/spaces/${id}`);
        setSpaceData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceData();
  }, [id]);

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        Error loading data.
      </Typography>
    );
  console.log(spaceData.rulesId)
  // Ensure spaceData and its properties are properly initialized
  const appliances = spaceData?.appliancesId || [];
  const images = spaceData?.images || [];

  return (
    <Container fluid spacing={3} style={{ padding: "20px" }}>
      {spaceData && (
        <>
          <Container fluid item xs={12}>
            <Typography variant="h4" className="pb-5">
              {spaceData.name}
            </Typography>
            <Row container spacing={2}>
              {images.length > 0 ? (
                <div>
                  <ImageList cols={3}>
                    {images.map((item) => (
                      <ImageListItem
                        key={item}
                        onClick={() => handleClickOpen(item)}
                      >
                        <img
                          src={`${item}?w=164&h=164&fit=crop&auto=format`}
                          alt={item.title}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>

                  <Dialog open={open} onClose={handleClose} maxWidth="md">
                    <DialogContent>
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Chi tiết ảnh"
                          style={{ width: "100%", height: "auto" }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <Typography variant="body2">No images available</Typography>
              )}
            </Row>
          </Container>
          <Container fluid>
            <Row>
              <Col item xs={12} md={8}>
                <Typography variant="h5">
                  {spaceData.location}
                  <p style={{ fontSize: "18px" }}>
                    10 người • {spaceData.area}{" "}
                  </p>
                  <Row item md={12}>
                    <Divider
                      sx={{
                        bgcolor: "gray",
                        margin: "20px auto",
                        width: "97%",
                      }}
                    />

                    <Typography
                      variant="h6"
                      className="py-1"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={spaceData.userId?.avatar}
                          alt="avatar"
                          style={{
                            objectFit: "cover",
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            marginRight: "10px",
                          }}
                        />
                        Chủ nhà: {spaceData.userId?.username || "Unknown"}
                      </div>

                      <Link to="/mess" state={{ id }}>
                        <Button
                          sx={{
                            backgroundColor: "#f8f8f8", // Màu ban đầu (trắng)
                            color: "black",
                            boxShadow: "none",
                            border: "1px solid #ccc", // Đường viền
                            "&:hover": {
                              backgroundColor: "#e0e0e0", // Màu nền khi hover
                              boxShadow: "none",
                            },
                          }}
                        >
                          <Typography variant="button">
                            <b>
                              Nhắn tin cho <br /> chủ không gian{" "}
                            </b>
                          </Typography>
                        </Button>
                      </Link>
                    </Typography>

                    <Divider
                      sx={{
                        bgcolor: "gray",
                        margin: "20px auto",
                        width: "97%",
                      }}
                    />
                  </Row>
                </Typography>
                <Typography variant="h5" className="pb-2">
                  Mô tả không gian{" "}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {spaceData.description}
                </Typography>
                <Divider />
                <Typography variant="h6">Tiện nghi</Typography>
                <List>
                  {appliances.length > 0 ? (
                    appliances.map((appliance) => (
                      <ListItem key={appliance._id}>
                        <ListItemIcon>
                          {/* Replace with actual icon based on appliance data */}
                          <AcUnitIcon /> {/* Example icon */}
                        </ListItemIcon>
                        <ListItemText primary={appliance.name} />
                      </ListItem>
                    ))
                  ) : (
                    <Typography variant="body2">
                      No appliances available
                    </Typography>
                  )}
                </List>
                <Typography variant="h5">Nội quy</Typography>
                <List>
                  {spaceData.rulesId && spaceData.rulesId.length > 0 ? (
                    spaceData.rulesId.map((ruleGroup) =>
                      ruleGroup.rules && ruleGroup.rules.length > 0 ? (
                        ruleGroup.rules.map((rule, index) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <AcUnitIcon /> {/* Example icon */}
                            </ListItemIcon>
                            <ListItemText primary={rule} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem key={ruleGroup._id}>
                          <ListItemText primary="No rules available" />
                        </ListItem>
                      )
                    )
                  ) : (
                    <ListItem>
                      <ListItemText primary="No rule groups available" />
                    </ListItem>
                  )}
                </List>
              </Col>
              <Col item xs={12} md={4}>
                <Box
                  sx={{
                    maxWidth: 350,
                    padding: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                    border: "1px solid #ddd",
                  }}
                >
                  {/* Giá theo đêm */}
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                  >
                    {spaceData.pricePerHour} / giờ
                  </Typography>

                  {/* Chọn ngày nhận và trả phòng */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <TextField
                      label="Nhận phòng"
                      type="date"
                      defaultValue="2024-10-17"
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      label="Trả phòng"
                      type="date"
                      defaultValue="2024-10-22"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>

                  {/* Số lượng khách */}
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Khách</InputLabel>
                    <Select defaultValue={1} label="Khách">
                      <MenuItem value={1}>1 khách</MenuItem>
                      <MenuItem value={2}>2 khách</MenuItem>
                      <MenuItem value={3}>3 khách</MenuItem>
                      <MenuItem value={4}>4 khách</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Nút đặt phòng */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: "#F53D6B", color: "#fff", mb: 2 }}
                  >
                    <Typography variant="button">Đặt phòng </Typography>
                  </Button>

                  {/* Chi tiết giá */}

                  <Divider sx={{ mb: 2, bgcolor: "gray" }} />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "bold",
                    }}
                  >
                    <Typography variant="body1">Tổng </Typography>
                    <Typography variant="body1">....</Typography>
                  </Box>
                </Box>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => setVisible(true)}
                >
                  <FlagFill
                    style={{
                      color: "gray",
                      marginRight: "15px",
                      marginTop: "6px",
                    }}
                  />
                  Báo cáo nhà/phòng cho thuê này
                </div>
              </Col>
            </Row>
          </Container>
          {/* Display Images */}

          <Row item md={12}>
            <Comment />
          </Row>
        </>
      )}
      {visible && <Reports visible={visible} setVisible={setVisible} />}
    </Container>
  );
}

export default SpaceDetails;
