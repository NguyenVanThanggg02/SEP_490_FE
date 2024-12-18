import React, { useEffect, useState } from "react";
import axios from "axios";
import '../style/SpaceDetail.css'; // Đảm bảo đường dẫn đúng
import {
  Typography, Button, List, ListItem, ListItemIcon, ListItemText, Divider, Container, FormControl, Select, MenuItem, InputLabel, TextField, Box, Drawer, Card, CardContent, Grid,
  CardMedia,
  IconButton,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";
import * as MuiIcons from '@mui/icons-material'; // Import all MUI icons
import BlockIcon from "@mui/icons-material/Block";

import { Link, useNavigate, useParams } from "react-router-dom";
import { Dialog, DialogContent } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Image } from 'antd';

import { FlagFill, ListCheck, PinMapFill, PlusCircle, Textarea } from "react-bootstrap-icons";
import AddIcon from "@mui/icons-material/Add";
import SelectSpaceToCompare from "./SelectSpaceToCompare";
import Similar from "./Similar";
import { priceFormatter } from "../utils/numberFormatter";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close"; // Import Close icon
import { MapShopDetail } from "../components/MapShopDetail";
import Reviews from './Reviews';
import { userChats } from "../Api/ChatRequests";
import { toast } from "react-toastify";
import { Constants } from "../utils/constants";
function SpaceDetails({ onSelectChat }) {
  const { id } = useParams();
  const [spaceData, setSpaceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [visibleCompare, setVisibleCompare] = useState(false);
  const [valueFromChild, setValueFromChild] = useState('');
  const [compare, setCompare] = useState({});
  const [openGallery, setOpenGallery] = useState(false);
  const [category, setCategory] = useState(null)
  const [openGalleryPreview, setOpenGalleryPreview] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [chat, setChat] = useState(null);

  const nav = useNavigate()
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
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
        const response = await axios.get(`${Constants.apiHost}/spaces/${id}`);
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
    const getChats = async () => {
      try {
        const { data } = await userChats(userId);

        const existingChat = data.find(
          (chat) =>
            chat._id &&
            chat.members.includes(userId) &&
            chat.members.includes(spaceData?.userId?._id)
        );

        if (existingChat) {
          setChat(existingChat);
          console.log("Existing chat found:", existingChat);
        } else {
          console.log("No existing chat found with userId and spaceId");
        }
      } catch (error) {
        console.log("Error fetching chats:", error);
      }
    };

    getChats();
  }, [userId, spaceData?.userId?._id]);

  useEffect(() => {
    const fetchSpaceDataToCompare = async () => {
      try {
        const response = await axios.get(`${Constants.apiHost}/spaces/${valueFromChild}`);
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
        `${Constants.apiHost}/spaces/${id}/favorite`
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

  if (spaceData.censorship !== 'Chấp nhận' && spaceData?.userId?._id !== userId && role === 0) {
    nav('/notfound');
    return null;
  }

  const mainImage = spaceData?.images?.[0]?.url;
   const otherImages = spaceData?.images ? spaceData.images.slice(1, 5).map(image => image.url) : [];

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
  const handleProfileOfOwner = () => {
    nav(`/host_profile/${spaceData?.userId?._id}`);
  }
  const handleDeleteIdSoToCompare = () => {
    setValueFromChild('');
  }

  const handleCreateChat = async () => {
    const chatData = chat
      ? {
          _id: chat._id,
          members: [userId, spaceData?.userId?._id],
        }
      : null;

    onSelectChat(chatData);
    try {
      if (chatData) {
        // Cập nhật chat hiện tại với ID sản phẩm
        const updateChatResponse = await axios.put(
          `${Constants.apiHost}/chat/${chatData._id}`,
          { spacesId: id } // Sử dụng id từ useParams
        );
        console.log("Chat updated with product ID:", updateChatResponse.data);
      } else {
        // Tạo một chat mới
        const createChatResponse = await axios.post(
          `${Constants.apiHost}/chat`,
          {
            senderId: userId,
            receiverId: spaceData.userId._id,
            spacesId: id, // Sử dụng id từ useParams
          }
        );
        console.log("Chat created:", createChatResponse.data);
      }
      nav(`/chat`);
    } catch (error) {
      console.error("Error creating or finding chat:", error);
    }
  };

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
  const displayName = spaceData.userId?.fullname || spaceData.userId?.username || "Unknown";
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
              image={compare?.images?.[0]?.url || "default-image"}
              title="image spaceCompare"
              style={{ objectFit: "cover" }}
            />
            <CardContent>
            <Typography gutterBottom variant="h6" component="div"style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
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


  const chatData = chat
    ? {
        _id: chat._id,
        members: [localStorage.getItem("userId"), spaceData?.userId?._id],
      }
    : null;

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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "15px",
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "26px" }}
              >
                {spaceData.name}
              </Typography>
              {spaceData && spaceData.censorship === "Chấp nhận" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  {userId && (
                    <div
                      onClick={changeFavorite}
                      style={{ marginRight: "10px" }}
                    >
                      {spaceData.favorite ? (
                        <FavoriteIcon
                          style={{ color: "#FF385C", fontSize: "40px" }}
                        />
                      ) : (
                        <FavoriteBorderIcon style={{ fontSize: "40px" }} />
                      )}
                    </div>
                  )}
                  <div
                    onClick={toggleDrawer(true)}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <PlusCircle
                      style={{
                        color: "blue",
                        fontSize: "33px",
                        marginRight: "5px",
                      }}
                    />
                    So sánh
                  </div>
                </div>
              )}
            </div>
            <Grid
              container
              spacing={0.8}
              style={{ position: "relative", marginBottom: "20px" }}
            >
              <Grid item xs={12} md={6}>
                {mainImage && (
                  <img
                    src={`${mainImage}`}
                    alt="Hình chính"
                    style={{
                      width: "100%",
                      height: "405px",
                      borderRadius: "3px",
                      objectFit: "cover",
                    }}
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
                        style={{
                          width: "100%",
                          height: "200px",
                          borderRadius: "3px",
                          objectFit: "cover",
                        }}
                        loading="lazy"
                        onClick={handleOpenGallery}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              {images.length > 4 && (
                <Grid
                  container
                  justifyContent="flex-end"
                  style={{ position: "absolute", top: "89%", right: "1%" }}
                >
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
              <DialogContent
                style={{ position: "relative", textAlign: "center" }}
              >
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
                {images.length > 0 &&
                  currentImageIndex >= 0 &&
                  currentImageIndex < images.length && (
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
                          onChange: (current, prev) =>
                            console.log(
                              `current index: ${current}, prev index: ${prev}`
                            ),
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
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "20px", fontWeight: "700" }}
                  >
                    Thể loại: {spaceData?.categoriesId?.name}
                  </Typography>

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
                      <div
                        style={{ display: "flex", alignItems: "center" }}
                        onClick={handleProfileOfOwner}
                      >
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
                          <p style={{ color: "gray", fontSize: "14px" }}>
                            Được đăng bởi:
                          </p>
                          {displayName}
                        </div>
                      </div>
                      {userId && (
                        <Link
                          onClick={handleCreateChat}
                          state={{ id }}
                          className={
                            userId === spaceData.userId?._id ? "d-none" : ""
                          }
                        >
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
                      )}
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
                <Typography
                  variant="h6"
                  className="pb-2"
                  sx={{ fontSize: "20px", fontWeight: "700" }}
                  gutterBottom
                >
                  Chính sách hoàn tiền và lưu ý khi đặt không gian
                </Typography>

                <Row>
                  <Col md={12}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "14px" }}
                    >
                      Quý khách sẽ được hoàn lại toàn bộ số tiền đã thanh toán
                      trong các trường hợp sau đây:
                    </Typography>
                    <div style={{ display: "flex" }}>
                      <MuiIcons.AccessTime sx={{ fontSize: "30px" }} />
                      <div style={{ lineHeight: "1.3", marginLeft: "10px" }}>
                        <Typography variant="subtitle1">
                          <strong>Đặt theo slot:</strong> Nếu quý khách hủy đặt
                          phòng ít nhất{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="secondary"
                            fontWeight="bold"
                            sx={{
                              animation: "blink 0.5s infinite",
                              color: "#005005",
                            }}
                          >
                            5 giờ
                          </Typography>{" "}
                          trước thời gian bắt đầu sử dụng.
                        </Typography>
                      </div>
                    </div>

                    <div style={{ display: "flex", margin: "25px 0" }}>
                      <MuiIcons.AlarmOn sx={{ fontSize: "30px" }} />
                      <div style={{ lineHeight: "1.3", marginLeft: "10px" }}>
                        <Typography variant="body1">
                          <strong>Đặt theo ngày:</strong> Nếu quý khách hủy đặt
                          phòng ít nhất{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="secondary"
                            fontWeight="bold"
                            sx={{
                              animation: "blink 0.5s infinite",
                              color: "#005005",
                            }}
                          >
                            24 giờ
                          </Typography>{" "}
                          trước ngày bắt đầu sử dụng.
                        </Typography>
                      </div>
                    </div>

                    <div style={{ display: "flex" }}>
                      <MuiIcons.EventAvailable sx={{ fontSize: "30px" }} />
                      <div style={{ lineHeight: "1.3", marginLeft: "10px" }}>
                        <Typography variant="body1">
                          <strong>Đặt theo tháng:</strong> Nếu quý khách hủy đặt
                          phòng ít nhất{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="secondary"
                            fontWeight="bold"
                            sx={{
                              animation: "blink 0.5s infinite",
                              color: "#005005",
                            }}
                          >
                            7 ngày
                          </Typography>{" "}
                          trước ngày bắt đầu sử dụng.
                        </Typography>
                      </div>
                    </div>
                    <Typography
                      variant="h6"
                      color="secondary"
                      gutterBottom
                    ></Typography>
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                      Trong một số trường hợp đặc biệt, quý khách vẫn có thể
                      được hoàn lại một phần tiền đã thanh toán như sau:
                    </Typography>
                    <div style={{ display: "flex" }}>
                      <MuiIcons.EditCalendar sx={{ fontSize: "30px" }} />
                      <div style={{ lineHeight: "1.3", marginLeft: "10px" }}>
                        <Typography variant="body1">
                          <strong>Đặt theo tháng:</strong>
                          <br />- Nếu quý khách hủy từ{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="secondary"
                            fontWeight="bold"
                            sx={{
                              animation: "blink 0.5s infinite",
                              color: "#FF6F00",
                            }}
                          >
                            1-7 ngày
                          </Typography>{" "}
                          trước ngày bắt đầu sử dụng, chúng tôi sẽ hoàn lại{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="primary"
                            fontWeight="bold"
                          >
                            80%
                          </Typography>{" "}
                          số tiền đã thanh toán.
                        </Typography>
                        <Typography variant="body1">
                          - Nếu quý khách hủy trong{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="secondary"
                            fontWeight="bold"
                            sx={{
                              animation: "blink 0.5s infinite",
                              color: "#FF6F00",
                            }}
                          >
                            tuần đầu tiên
                          </Typography>{" "}
                          của thời gian sử dụng, chúng tôi sẽ hoàn lại{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="primary"
                            fontWeight="bold"
                          >
                            60%
                          </Typography>
                          .
                        </Typography>
                        <Typography variant="body1">
                          - Nếu quý khách hủy trong{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="secondary"
                            fontWeight="bold"
                            sx={{
                              animation: "blink 0.5s infinite",
                              color: "#FF6F00",
                            }}
                          >
                            tuần thứ hai
                          </Typography>{" "}
                          của thời gian sử dụng, chúng tôi sẽ hoàn lại{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="primary"
                            fontWeight="bold"
                          >
                            30%
                          </Typography>
                          .
                        </Typography>
                        <Typography variant="body1">
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{
                              color: "red",
                              display: "inline",
                            }}
                          >
                            {" "}
                            <MuiIcons.Warning /> Chú ý :
                          </Typography>{" "}
                          Sau{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="secondary"
                            fontWeight="bold"
                            sx={{
                              animation: "blink 0.5s infinite",
                              color: "#FF6F00",
                            }}
                          >
                            tuần thứ hai
                          </Typography>{" "}
                          của thời gian sử dụng, chúng tôi rất tiếc{" "}
                          <Typography
                            variant="body1"
                            component="span"
                            color="primary"
                            fontWeight="bold"
                            sx={{
                              color: "red",
                              animation: "blink 0.5s infinite",
                            }}
                          >
                            không thể hoàn lại
                          </Typography>{" "}
                          tiền cho quý khách.
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
                <Typography
                  variant="h6"
                  className="pb-2"
                  sx={{ fontSize: "20px", fontWeight: "700" }}
                  gutterBottom
                >
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
                <Typography
                  variant="h6"
                  className="pb-2"
                  sx={{ fontSize: "20px", fontWeight: "700" }}
                  gutterBottom
                >
                  Tiện nghi
                </Typography>

                <List>
                  {spaceData?.appliancesId?.appliances?.length > 0 ? (
                    <Grid container>
                      {spaceData.appliancesId.appliances?.map((appliance) => {
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
                    {spaceData.area}m2
                  </b>
                </div>
                <Divider
                  sx={{
                    bgcolor: "gray",
                    margin: "20px auto",
                    width: "100%",
                  }}
                />
                <Typography
                  variant="h6"
                  className="pb-2"
                  sx={{ fontSize: "20px", fontWeight: "700" }}
                  gutterBottom
                >
                  Nội quy
                </Typography>
                <List>
                  {spaceData.rulesId &&
                  (spaceData.rulesId.rules.length > 0 ||
                    spaceData.rulesId.customeRules.length > 0) ? (
                    <Grid container>
                      {[
                        ...spaceData.rulesId.rules,
                        ...spaceData.rulesId.customeRules,
                      ].map((rule, index) => (
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
                <Typography
                  variant="h6"
                  className="pb-2"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "primary.main",
                    textTransform: "uppercase",
                    padding: "8px",
                  }}
                  gutterBottom
                >
                  <PinMapFill style={{ color: "#f70a8d" }} /> Vị trí không gian:{" "}
                  {spaceData?.location || ""}
                </Typography>

                {spaceData.detailAddress && (
                  <Typography
                    variant="h6"
                    className="pb-2"
                    sx={{
                      fontSize: "20px",
                      fontWeight: "700",
                      padding: "8px",

                      color: "text.secondary",
                    }}
                    gutterBottom
                  >
                    <ListCheck style={{ color: "#f70a8d" }} /> Mô tả chi tiết:{" "}
                    {spaceData?.detailAddress || ""}
                  </Typography>
                )}

                <MapShopDetail
                  lat={spaceData?.latLng?.[0]}
                  lng={spaceData?.latLng?.[1]}
                />
                <Divider
                  sx={{
                    bgcolor: "gray",
                    margin: "20px auto",
                    width: "100%",
                  }}
                />
                <Reviews />
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
                  {spaceData.pricePerHour !== 0 &&
                    spaceData.pricePerHour !== null && (
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                      >
                        {priceFormatter(spaceData.pricePerHour)} VND / giờ
                      </Typography>
                    )}

                  {spaceData.pricePerDay !== 0 &&
                    spaceData.pricePerDay !== null && (
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                      >
                        {priceFormatter(spaceData.pricePerDay)} VND / Ngày
                      </Typography>
                    )}

                  {/* {spaceData.pricePerWeek !== 0 &&
                    spaceData.pricePerWeek !== null && (
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                      >
                        {priceFormatter(spaceData.pricePerWeek)} VND / Tuần
                      </Typography>
                    )} */}

                  {spaceData.pricePerMonth !== 0 &&
                    spaceData.pricePerMonth !== null && (
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
                      >
                        {priceFormatter(spaceData.pricePerMonth)} VND / Tháng
                      </Typography>
                    )}

                  {/* Nút đặt phòng */}
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ backgroundColor: "#F53D6B", color: "#fff", mb: 2 }}
                    onClick={() => {
                      if (!userId) {
                        toast.warning("Vui lòng đăng nhập để đặt phòng.");
                        nav("/login");
                      } else {
                        nav(`/booking/${spaceData?._id}`);
                      }
                    }}
                    className={userId === spaceData.userId?._id ? "d-none" : ""}
                  >
                    <Typography variant="button">Đặt phòng</Typography>
                  </Button>
                  {/* Community Standards Information */}
                  {spaceData.censorship === "Từ chối" &&
                    spaceData.communityStandardsId && (
                      <Box
                        mt={2}
                        sx={{
                          backgroundColor: "#f9f9f9",
                          padding: "10px",
                          borderRadius: "5px",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                          border: "2px solid #4CAF50",
                          transition: "all 0.3s ease-in-out",
                          ":hover": {
                            backgroundColor: "#eaf1e4",
                            borderColor: "#388e3c",
                            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                          },
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            color: "#4CAF50",
                          }}
                        >
                          Lý do từ chối
                        </Typography>
                        {spaceData.communityStandardsId.reasons &&
                          spaceData.communityStandardsId.reasons.length > 0 && (
                            <ul>
                              {spaceData.communityStandardsId.reasons.map(
                                (reason, index) => (
                                  <li key={index}>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "black" }}
                                    >
                                      {reason}
                                    </Typography>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                        {spaceData.communityStandardsId.customReason &&
                          spaceData.communityStandardsId.customReason.length >
                            0 && (
                            <ul>
                              {spaceData.communityStandardsId.customReason.map(
                                (customReason, index) => (
                                  <li key={index}>
                                    <Typography
                                      variant="body2"
                                      sx={{ color: "black" }}
                                    >
                                      {customReason}
                                    </Typography>
                                  </li>
                                )
                              )}
                            </ul>
                          )}
                      </Box>
                    )}
                </Box>
              </Col>
            </Row>
          </Container>
          {/* Display Images */}
        </>
      )}
      <Drawer
        anchor="bottom"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "50vw",
            left: "25vw",
            right: "auto",
          },
          zIndex: 9,
        }}
      >
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
      {spaceData.censorship === "Chấp nhận" && (
        <Similar spaceData={spaceData} />
      )}
    </Container>
  );
}

export default SpaceDetails;
