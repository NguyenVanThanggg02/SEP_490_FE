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
  Drawer,
  Card,
  CardContent,
  Grid,
  CardMedia,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Comment from "./Comment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ImageList, ImageListItem, Dialog, DialogContent } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Image } from 'antd';

import { FlagFill, Plus, PlusCircle } from "react-bootstrap-icons";
import Reports from "./Reports";
import AddIcon from "@mui/icons-material/Add";
import SelectSpaceToCompare from "./SelectSpaceToCompare";
function SpaceDetails() {
  const { id } = useParams();
  const [spaceData, setSpaceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [visibleCompare, setVisibleCompare] = useState(false);
  const [valueFromChild, setValueFromChild] = useState('');
  const [compare, setCompare] = useState({});
  const [openGallery, setOpenGallery] = useState(false);


  const nav = useNavigate()


  console.log(valueFromChild);

  const handleValueChange = (newValue) => {
    setValueFromChild(newValue);
  };

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

  useEffect(() => {
    const fetchSpaceDataToCompare = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/spaces/${valueFromChild}`);
        console.log(response.data);
        setCompare(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaceDataToCompare();
  }, [valueFromChild]);


  const changeFavorite = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9999/spaces/${id}/favorite`
      );
      setSpaceData((prevSpace) => ({
        ...prevSpace,
        favorite: response.data.favorite,
      }));
    } catch (error) {
      console.error("Error change favorite:", error);
    }
  };

  const handleOpenGallery = () => {
    setOpenGallery(true);
  };

  const handleCloseGallery = () => {
    setOpenGallery(false);
  };

  if (loading) return <Typography variant="h6">Đang tải...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        Error loading data.
      </Typography>
    );
  const mainImage = spaceData.images[0];
  const otherImages = spaceData.images.slice(1, 5); // Lấy 4 hình ảnh tiếp theo


  // Ensure spaceData and its properties are properly initialized
  const appliances = spaceData?.appliancesId || [];
  const images = spaceData?.images || [];

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(open);
  };
  const handleCompare = () => {
    if (valueFromChild == "") {
      return
    }
    nav('/compare', { state: { id, valueFromChild } });
  }
  const handleDeleteIdSoToCompare = () => {
    setValueFromChild('');
  }

  const drawerContent = () => (
    <Row style={{ margin: "20px" }}>
      <Col md={6}>
        <Card style={{ position: "relative" }}>
          <CardMedia
            sx={{ height: 250 }}
            image={spaceData.images[0]}
            title="image spaceF"
            style={{ objectFit: "cover" }}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {spaceData.name}
            </Typography>
          </CardContent>
        </Card>
      </Col>
      {compare && compare.name ? (
        <Col md={6}>
          <Card style={{ position: "relative" }}>
            <CardMedia
              sx={{ height: 250 }}
              image={compare.images[0]}
              title="image spaceCompare"
              style={{ objectFit: "cover" }}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {compare.name}
              </Typography>
            </CardContent>
          </Card>
        </Col>
      ) : (
        <Col
          md={6}
          style={{ textAlign: "center", position: "relative" }}
          onClick={() => {
            setVisibleCompare(true);
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100px",
              height: "100px",
              border: "2px dashed gray",
              position: "relative",
              margin: "auto",
              marginTop: "90px",
            }}
          >
            <AddIcon style={{ fontSize: "40px", color: "gray" }} />
          </div>
          <div style={{ marginTop: "10px" }}>Thêm địa điểm</div>
        </Col>
      )}
      <Col
        md={6}
        style={{ textAlign: "center", position: "relative" }}
        onClick={handleCompare}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            margin: "10px auto",
          }}
        >
          <Button className="btn btn-success">So sánh</Button>
        </div>
      </Col>
      {valueFromChild != "" && (
        <Col
          md={6}
          style={{ textAlign: "center", position: "relative" }}
          onClick={handleDeleteIdSoToCompare}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              margin: "10px auto",
            }}
          >
            <Button className="btn btn-danger">Xoá</Button>
          </div>
        </Col>
      )}
    </Row>

  );



  return (
    <Container fluid spacing={3} style={{ padding: "20px" }}>
      {spaceData && (
        <>
          <Container>
            <Grid container spacing={0.8} style={{ position: "relative", marginBottom: "20px" }}>
              <Grid item xs={12} md={6}>
                {mainImage && (
                  <img
                    src={`${mainImage}`}
                    alt="Hình chính"
                    style={{ width: "100%", height: "405px", borderRadius: "3px", objectFit: "cover" }}
                    onClick={handleOpenGallery}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={0.8}>
                  {otherImages.map((item) => (
                    <Grid item xs={6} key={item}>
                      <img
                        src={`${item}`}
                        alt={item}
                        style={{ width: "100%", height: "200px", borderRadius: "3px", objectFit: "cover" }}
                        loading="lazy"
                        onClick={handleOpenGallery}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {images.length > 4 && (
                <Grid container justifyContent="flex-end" style={{ position: "absolute", top: "89%", right: "1%" }}>
                  <Button
                    variant="outlined"
                    onClick={handleOpenGallery}
                    style={{
                      backgroundColor: "white",
                      color: "black",
                      borderColor: "white",
                    }}
                  >
                    Xem toàn bộ ảnh ({images.length})
                  </Button>
                </Grid>
              )}
            </Grid>

            <Dialog open={openGallery} onClose={handleCloseGallery} maxWidth="xl" PaperProps={{
              style: {
                width: "80%",
                maxWidth: "none",
                zIndex: 1, // z-index cao hơn cho preview
                position: "absolute"
              },
            }}>
              <DialogContent style={{ padding: "10px 10px" }}>
                <Image.PreviewGroup
                  preview={{
                    onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                  }}
                  style={{
                    zIndex: 2, // z-index cao hơn cho preview
                    position: "absolute", // Sử dụng relative để giữ vị trí cho preview
                  }}
                >
                  <Grid container spacing={0.4}>
                    {images.map((item) => (
                      <Grid item xs={6} sm={6} key={item}>
                        <Image
                          src={`${item}`}
                          alt={item}
                          loading="lazy"
                          style={{ width: "100%", height: "400px", borderRadius: "3px", objectFit: "cover" }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Image.PreviewGroup>
              </DialogContent>

            </Dialog>
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
      <Drawer anchor="bottom" open={openDrawer} onClose={toggleDrawer(false)} sx={{
        '& .MuiDrawer-paper': {
          width: '50vw',
          left: '25vw',
          right: 'auto',
        }, zIndex: 1000
      }}>
        {drawerContent()}
      </Drawer>
      {visibleCompare && (
        <SelectSpaceToCompare
          visibleCompare={visibleCompare}
          setVisibleCompare={setVisibleCompare}
          sx={{ zIndex: 1500 }}
          id={id}
          onValueChange={handleValueChange}
        />
      )}
    </Container>
  );
}

export default SpaceDetails;
