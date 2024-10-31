import React, { useEffect, useState } from "react";
import axios from "axios";
import '../style/SpaceDetail.css'; // Đảm bảo đường dẫn đúng
import {
  Typography, Button, List, ListItem, ListItemIcon, ListItemText, Divider, Container, FormControl, Select, MenuItem, InputLabel, TextField, Box, Drawer, Card, CardContent, Grid,
  CardMedia,
  AppBar,
  Toolbar,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
} from "@mui/material";
import * as MuiIcons from '@mui/icons-material'; // Import all MUI icons
import AcUnitIcon from "@mui/icons-material/AcUnit";
import BlockIcon from "@mui/icons-material/Block";

import Comment from "./Comment";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ImageList, ImageListItem, Dialog, DialogContent } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Image } from 'antd';

import { ChevronLeft, ChevronRight, FlagFill, Plus, PlusCircle } from "react-bootstrap-icons";
import Reports from "./Reports";
import AddIcon from "@mui/icons-material/Add";
import SelectSpaceToCompare from "./SelectSpaceToCompare";
import Similar from "./Similar";
import { priceFormatter } from "../utils/numberFormatter";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon
import { MapShopDetail } from "../components/MapShopDetail";

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
  const [category, setCategory] = useState(null)
  const [openGalleryPreview, setOpenGalleryPreview] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nav = useNavigate()

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
        setCategory(response.data.categoriesId._id);

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
  const mainImage = spaceData?.images?.[0]?.url;
  const otherImages = spaceData?.images ? spaceData.images.slice(1, 5).map(image => image.url) : [];

  const appliances = spaceData?.appliancesId || [];
  const images = spaceData?.images || [];
  console.log(mainImage);
  console.log(otherImages);
  console.log(images);


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
  const handleProfileOfOwner = () => {
    nav(`/host_profile/${spaceData?.userId?._id}`);
  }
  const handleDeleteIdSoToCompare = () => {
    setValueFromChild('');
  }
// // Tạo một MutationObserver để theo dõi sự thay đổi trong DOM
// const observer = new MutationObserver((mutations) => {
//   mutations.forEach((mutation) => {
//     if (mutation.type === 'childList') {
//       const elements = document.querySelectorAll('.css-pdteti-MuiPaper-root-MuiDialog-paper');
//       elements.forEach((element) => {
//         element.style.background = 'none'; 
//         element.style.boxShadow = 'none'; 
//       });
//     }
//   });
// });
// const targetNode = document.body; 
// observer.observe(targetNode, { childList: true, subtree: true });

  const elements = document.querySelectorAll('.css-pdteti-MuiPaper-root-MuiDialog-paper');
      elements.forEach((element) => {
      element.style.background = 'none'; 
      element.style.boxShadow = 'none'; 
  });
  
  const drawerContent = () => (
    <Row style={{ margin: "20px" }}>
      <Col md={6}>
        <Card style={{ position: "relative" }}>
          <CardMedia
            sx={{ height: 250 }}
            image={spaceData?.images?.[0]?.url || "default-image"}
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
              image={compare?.images[0].url || "default-image"}
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



  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const renderDaysInMonth = (month) => {
    const date = new Date(2024, month);
    const daysInMonth = new Date(2024, month + 1, 0).getDate();
    const firstDay = new Date(2024, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<TableCell key={`empty-${i}`} className="inactive"></TableCell>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <TableCell key={i} className={i === new Date().getDate() ? 'today' : ''}>
          {i}
        </TableCell>
      );
    }

    return (
      <>
        <TableRow>
          {days.slice(0, 7)}
        </TableRow>
        {days.slice(7).reduce((rows, day, index) => {
          if (index % 7 === 0) rows.push([]);
          rows[rows.length - 1].push(day);
          return rows;
        }, []).map((row, index) => (
          <TableRow key={index}>
            {row}
          </TableRow>
        ))}
      </>
    );
  };

  const renderTimeSlots = (title, selectedSlots) => (
    <div className="time-section">
      <Typography variant="h6">{title}</Typography>
      <Grid container spacing={1} className="time-grid">
        {[...Array(24)].map((_, index) => {
          const time = index < 10 ? `0${index}:00` : `${index}:00`;
          const isSelected = selectedSlots.includes(time);
          return (
            <Grid item key={index} xs={2}>
              <Chip
                label={time}
                className={`time-slot ${isSelected ? 'selected' : ''}`}
                onClick={() => { /* handle time slot click */ }}
                color={isSelected ? 'primary' : 'default'}
                variant={isSelected ? 'filled' : 'outlined'}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
  const handleClickImage = (index) => {
    setOpenGalleryPreview(true)
    setCurrentImageIndex(index);
    handleCloseGallery()
  };

  // Handle next image
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle previous image
  const handleBack = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <Container fluid spacing={3} style={{ padding: "20px" }}>
      {spaceData && (
        <>
          <Container>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <Typography variant="h6" sx={{ fontWeight: 500, fontSize: "26px" }}>
                {spaceData.name}
              </Typography>
              <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                <div onClick={changeFavorite} style={{ marginRight: "10px" }}>
                  {spaceData.favorite ? (
                    <FavoriteIcon
                      style={{ color: "#FF385C", fontSize: "40px" }}
                    />
                  ) : (
                    <FavoriteBorderIcon style={{ fontSize: "40px" }} />
                  )}
                </div>
                <div onClick={toggleDrawer(true)} style={{ display: "flex", alignItems: "center" }}>
                  <PlusCircle style={{ color: "blue", fontSize: "33px", marginRight: "5px" }} />
                  So sánh
                </div>
              </div>
            </div>
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

            <Dialog
              open={openGallery}
              onClose={handleCloseGallery}
              maxWidth="xl"
              PaperProps={{
                style: {
                  width: "80%",
                  maxWidth: "none",
                  zIndex: 8, // Ensuring Dialog is above other components
                },
              }}
            >
              <DialogContent style={{ padding: "10px 10px" }}>
                <Grid container spacing={0.4}>
                  {images.map((item, index) => (
                    <Grid item xs={6} sm={6} key={index}>
                      <Image
                        src={item.url}
                        alt={item}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "400px",
                          borderRadius: "3px",
                        }}
                        onClick={() => handleClickImage(index)}
                        preview={{
                          mask: null, // Remove any additional mask over the image
                          visible: false, // Disable default preview on click
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>


              </DialogContent>
            </Dialog>

            <Dialog
              open={openGalleryPreview}
              onClose={() => {
                setOpenGalleryPreview(false);
                setOpenGallery(true);
              }}
              maxWidth="xl"
              PaperProps={{
                style: {
                  width: "100%",
                  maxWidth: "none",
                  zIndex: 8, // Ensuring Dialog is above other components
                },
              }}

            >
              <DialogContent style={{ position: "relative", textAlign: "center" }}>
                {/* Close Button */}
                <IconButton
                  onClick={() => {
                    setOpenGalleryPreview(false);
                    setOpenGallery(true);
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    zIndex: 1000,
                  }}
                >
                  <CloseIcon />
                </IconButton>
                {images.length > 0 && currentImageIndex >= 0 && currentImageIndex < images.length && (
                  <div style={{ position: "relative" }}>
                    {/* Back Button */}
                    <IconButton
                      onClick={handleBack}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "10px",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        zIndex: 1000,
                      }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>

                    {/* Image */}
                    <Image.PreviewGroup
                      preview={{
                        current: currentImageIndex,
                        onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                      }}
                    >
                      <Image
                        src={images[currentImageIndex].url}
                        alt={`Image ${currentImageIndex}`}
                        style={{
                          width: "100%",
                          height: "500px",
                          borderRadius: "3px",
                          objectFit: "cover",
                          zIndex: 999,
                        }}
                      />
                    </Image.PreviewGroup>

                    {/* Next Button */}
                    <IconButton
                      onClick={handleNext}
                      style={{
                        position: "absolute",
                        top: "50%",
                        right: "10px",
                        transform: "translateY(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        zIndex: 1000,
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </div>
                )}
              </DialogContent>
            </Dialog>


          </Container>
          <Container fluid>
            <Row>
              <Col item xs={12} md={8}>
                <Typography variant="h5">
                  {spaceData.location}
                  <p style={{ fontSize: "18px" }}>
                    10 người • {spaceData.area}
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
                      <div style={{ display: "flex", alignItems: "center" }} onClick={handleProfileOfOwner}>
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
                        <div style={{ lineHeight: "0.3" }}>
                          <p style={{ color: "gray", fontSize: "14px" }}>Được đăng bởi:</p>
                          {spaceData.userId?.username || "Unknown"}
                        </div>
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
                            <b style={{ fontSize: "12px" }}>
                              Nhắn tin cho chủ không gian
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
                <Typography variant="h6" className="pb-2" sx={{ fontSize: "20px", fontWeight: "700" }} gutterBottom>
                  Thông tin cơ bản
                </Typography>
                <Row>
                  <Col md={6}>
                    <div style={{ display: "flex" }}>
                      <MuiIcons.AccessTime sx={{ fontSize: "30px" }} />
                      <div style={{ lineHeight: "1.3", marginLeft: "10px" }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "14px" }}>
                          Giờ checkin/out tiêu chuẩn
                        </Typography>

                        <Typography variant="body2" color="textSecondary" style={{ marginTop: "5px", fontSize: "14px" }}>
                          Check in sau 14:00 và check-out trước 12:00 ngày hôm sau
                        </Typography>

                      </div>
                    </div>

                    <div style={{ display: "flex", margin: "25px 0" }}>
                      <MuiIcons.AlarmOn sx={{ fontSize: "30px" }} />
                      <div style={{ lineHeight: "1.3", marginLeft: "10px" }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "14px" }}>
                          Cho phép đặt theo giờ
                        </Typography>

                        <Typography variant="body2" color="textSecondary" style={{ marginTop: "5px", fontSize: "14px" }}>
                          Không gian  cho phép đặt theo giờ cho khách hàng có nhu cầu sử dụng trong thời gian ngắn
                        </Typography>

                      </div>
                    </div>

                    <div style={{ display: "flex" }}>
                      <MuiIcons.EventAvailable sx={{ fontSize: "30px" }} />
                      <div style={{ lineHeight: "1.3", marginLeft: "10px" }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "14px" }}>
                          Khung giờ hỗ trợ checkin
                        </Typography>

                        <Typography variant="body2" color="textSecondary" style={{ marginTop: "5px", fontSize: "14px" }}>
                          Hỗ trợ tất cả khung giờ

                        </Typography>

                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ display: "flex" }}>
                      <MuiIcons.EditCalendar sx={{ fontSize: "30px" }} />
                      <div style={{ lineHeight: "1.3", marginLeft: "10px" }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "14px" }}>
                          Giờ checkin/out theo ngày
                        </Typography>
                        <Typography variant="body2" color="textSecondary" style={{ marginTop: "5px", fontSize: "14px" }}>
                          Nhận phòng 9:00<br></br>
                          Trả phòng trước 21:00
                        </Typography>

                      </div>
                    </div>

                    <div style={{ display: "flex", marginTop: "20px" }}>
                      <MuiIcons.Key sx={{ fontSize: "30px" }} />
                      <div style={{ lineHeight: "1.3", marginLeft: "10px" }}>
                        <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "14px" }}>
                          Hình thức checkin
                        </Typography>
                        <Typography variant="body2" color="textSecondary" style={{ marginTop: "5px", fontSize: "14px" }}>
                          Tự checkin
                        </Typography>

                      </div>
                    </div>
                  </Col>
                </Row>
                <Divider
                  sx={{
                    bgcolor: "gray",
                    margin: "20px auto",
                    width: "100%",
                  }}
                />
                <Typography variant="h6" className="pb-2" sx={{ fontSize: "20px", fontWeight: "700" }} gutterBottom>
                  Giới thiệu về không gian
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {spaceData.description}
                </Typography>
                <Divider
                  sx={{
                    bgcolor: "gray",
                    margin: "20px auto",
                    width: "100%",
                  }}
                />
                <Typography variant="h6" className="pb-2" sx={{ fontSize: "20px", fontWeight: "700" }} gutterBottom>
                  Tiện nghi</Typography>

                <List>
                  {spaceData?.appliancesId?.appliances?.length > 0 ? (
                    <Grid container >
                      {spaceData.appliancesId.appliances?.map((appliance) => {
                        const IconAppliances = MuiIcons[appliance.iconName];
                        return (
                          <Grid item xs={6} key={appliance._id}> {/* Mỗi item chiếm 50% chiều rộng */}
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
                    <Typography variant="body2">
                      No appliances available
                    </Typography>
                  )}
                </List>
                <Divider
                  sx={{
                    bgcolor: "gray",
                    margin: "20px auto",
                    width: "100%",
                  }}
                />
                <Typography variant="h6" className="pb-2" sx={{ fontSize: "20px", fontWeight: "700" }} gutterBottom>
                  Nội quy
                </Typography>
                <List>
                  {spaceData.rulesId && (spaceData.rulesId.rules.length > 0 || spaceData.rulesId.customeRules.length > 0) ? (
                    <Grid container>
                      {[...spaceData.rulesId.rules, ...spaceData.rulesId.customeRules].map((rule, index) => (
                        <Grid item xs={6} key={index}>
                          <ListItem>
                            <ListItemIcon>
                              <BlockIcon /> {/* Icon ví dụ */}
                            </ListItemIcon>
                            <ListItemText primary={rule} />
                          </ListItem>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <ListItem>
                      <ListItemText primary="No rules available" />
                    </ListItem>
                  )}
                </List>
                <Divider
                  sx={{
                    bgcolor: "gray",
                    margin: "20px auto",
                    width: "100%",
                  }}
                />
                <Typography variant="h6" className="pb-2" sx={{ fontSize: "20px", fontWeight: "700" }} gutterBottom>
                Vị trí không gian
                </Typography>
                <MapShopDetail lat={spaceData?.latLng?.[0]} lng={spaceData?.latLng?.[1]} />
                <Divider
                  sx={{
                    bgcolor: "gray",
                    margin: "20px auto",
                    width: "100%",
                  }}
                />
                <Typography variant="h6" className="pb-2" sx={{ fontSize: "20px", fontWeight: "700" }} gutterBottom>
                  Đánh giá
                </Typography>

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
                    {priceFormatter(spaceData.pricePerHour)} VND / giờ
                  </Typography>



                  {/* Nút đặt phòng */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: "#F53D6B", color: "#fff", mb: 2 }}
                    onClick={() => nav(`/booking/${spaceData?._id}`)}
                  >
                    <Typography variant="button">Đặt phòng </Typography>
                  </Button>

                  {/* Chi tiết giá */}


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

         
        </>
      )}
      {visible && <Reports visible={visible} setVisible={setVisible} />}
      <Drawer anchor="bottom" open={openDrawer} onClose={toggleDrawer(false)} sx={{
        '& .MuiDrawer-paper': {
          width: '50vw',
          left: '25vw',
          right: 'auto',
        }, zIndex: 9
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
          setCategoryId={spaceData.categoriesId._id}
        />
      )}
      <Similar spaceData={spaceData} />
    </Container>
  );
}

export default SpaceDetails;
