import { Button, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";

const Message = () => {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const location = useLocation();
  const [space, setSpace] = useState({});
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = location.state || {}; // Lấy id từ state
  // const {id} = useParams()
  const userId = localStorage.getItem("userId");

  const fetchSpaceById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:9999/spaces/${id}`);
      setSpace(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSendMessage = async () => {
    if (!message) {
      alert("Vui lòng nhập nội dung tin nhắn");
      return;
    }
    try {
      await axios.post(`http://localhost:9999/message`, {
        userId: localStorage.getItem("userId"),
        receiverId: space.userId,
        messageContent: message,
        spaceId: id,
      });
      alert("Gửi tin nhắn thành công");
      setMessage("");
    } catch (err) {
      alert("Gửi tin nhắn thất bại");
    }
  };

  useEffect(() => {
    if (space.userId) {
      const receiverId = space.userId;
      console.log(receiverId);

      axios
        .get(`http://localhost:9999/message/${userId}/${receiverId}/${id}`)
        .then((res) => {
          console.log(res.data);
          setMessage(res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [space, userId, id]);

  useEffect(() => {
    fetchSpaceById(id);
  }, []);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpenDrawer(open);
  };

  const drawerContent = () => (
    <Box
      sx={{
        width: 400,
        padding: "20px",
        backgroundColor: "#FFFFFF", // Màu nền trắng
        borderRadius: "10px", // Bo tròn các góc
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Thêm bóng
        textAlign: "center", // Căn giữa văn bản
      }}
      role="presentation"
    >
      <h2
        className="pt-4 pb-3"
        style={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}
      >
        Đặt phòng, đặt chỗ
      </h2>
      <img
        src={space.images[0]}
        alt=""
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
          borderRadius: "10px", // Bo tròn hình ảnh
        }}
      />
      <h4 style={{ marginTop: "15px", marginBottom: "10px" }}>{space.name}</h4>
      <p style={{ fontSize: "13px", color: "#555" }}>{space.description}</p>
      <h4
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "15px",
          fontWeight: "bold",
        }}
      >
        Giá phòng
        <span style={{ fontWeight: "bold", color: "#333" }}>
          {space.pricePerHour}/giờ
        </span>
      </h4>
      <Link
        to={`/spaces/${id}`}
        style={{ textDecoration: "none", color: "black" }}
      >
        <Button
          variant="outlined"
          sx={{
            backgroundColor: "white",
            color: "black",
            display: "block",
            margin: "0 auto",
            fontSize: "18px",
            padding: "10px 20px",
            width: "100%",
            border: "1px solid black", // Đặt viền màu đen
            borderRadius: "5px", // Bo tròn nút
            marginTop: "20px",
            "&:hover": {
              backgroundColor: "#F7F7F7", // Màu nền khi hover
            },
          }}
        >
          Yêu cầu đặt phòng
        </Button>
      </Link>
    </Box>
  );

  return (
    <Container fluid>
      <Row>
        <Col md={3} style={{ border: "solid 2px #ECECEC", height: "88vh" }}>
          <h4 className="pt-4">Tin nhắn</h4>
          <Button
            variant="contained"
            size="small"
            className="me-4 rounded-5 pt-2 pb-1 px-3 mb-4"
          >
            Tất cả
          </Button>
          <Button
            variant="outlined"
            size="small"
            className="me-4 rounded-5  pt-2 pb-1 px-3 mb-4"
          >
            Chưa đọc
          </Button>
          <Row style={{ height: "13%" }}>
            <Row
              style={{
                margin: "0 auto",
                width: "90%",
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
              }}
            >
              <Col md={3} style={{ padding: "10px 5px" }}>
                <div
                  style={{
                    position: "relative",
                    width: "60px",
                    height: "60px",
                  }}
                >
                  {/* space image */}
                  <img
                    src={space.images[0]}
                    alt="background"
                    style={{
                      objectFit: "cover",
                      width: "60px",
                      height: "60px",
                      borderRadius: "12px",
                    }}
                  />
                  {/* user Avatar  */}
                  <img
                    src={space.images[1]}
                    alt="avatar"
                    style={{
                      position: "absolute",
                      bottom: "-10px",
                      left: "70%",
                      transform: "translateX(-50%)",
                      objectFit: "cover",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      border: "2px solid white",
                    }}
                  />
                </div>
              </Col>
              <Col md={9}>
                <h4>Tên Space Owner</h4>
                <p>thời gian</p>
              </Col>
            </Row>
          </Row>
        </Col>
        <Col
          md={9}
          style={{
            border: "solid 2px #ECECEC",
            height: "88vh",
            position: "relative",
          }}
        >
          <Row
            className="pt-4 pb-4 "
            style={{ borderBottom: "solid 2px #ECECEC" }}
          >
            <Col md={9} className="d-flex align-items-center ps-5">
              <div style={{ display: "flex" }}>
                <img
                  src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                  alt="avatarSpaceOwner2"
                  style={{
                    objectFit: "cover",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
              </div>
              <h3 style={{ margin: 0 }}>Tên space</h3>
            </Col>
            <Col md={3} className="text-end">
              <Button
                variant="contained"
                color="#ECECEC"
                onClick={toggleDrawer(true)}
              >
                Hiển thị thông tin phòng{" "}
              </Button>
            </Col>
          </Row>

          <p className="text-center">
            <b>Hôm nay</b>
          </p>
          <Row style={{}}>
            {/* Tin nhắn của mình */}
            <Col md={12} className="d-flex mb-3">
              <div
                className="d-flex pe-5"
                style={{
                  alignItems: "flex-start",
                  flexDirection: "column",
                  marginLeft: "auto",
                }}
              >
                {/* Tên và thời gian */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "98%",
                  }}
                >
                  <p style={{ marginLeft: "auto", marginBottom: 0 }}>
                    thời gian nhắn{" "}
                  </p>
                </div>
                {/* Tin nhắn đáp */}
                <div
                  style={{
                    backgroundColor: "#f1f1f1",
                    borderRadius: "20px",
                    padding: "10px 15px",
                    maxWidth: "600px",
                    display: "flex",
                    height: "70px",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    T là người thuê đây chúng tôi có thể giúp bạn giải đáp thắc
                    mắc của mình khônggg
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* Chat Messages */}
          <Row style={{ paddingBottom: "60px" }}>
            {/* Tin nhắn */}
            <Col md={12} className="d-flex mb-3 ps-5">
              {/* Avatar */}
              <img
                src={space.images[0]}
                alt="avatar"
                style={{
                  objectFit: "cover",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <div
                className="d-flex"
                style={{ alignItems: "flex-start", flexDirection: "column" }}
              >
                {/* Tên và thời gian */}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p style={{ margin: 0 }}>
                    <b>Tên Space Owner</b>{" "}
                    <span className="ps-2">thời gian nhắn</span>
                  </p>
                </div>
                {/* Tin nhắn đáp */}
                <div
                  style={{
                    backgroundColor: "#f1f1f1",
                    borderRadius: "20px",
                    padding: "10px 15px",
                    maxWidth: "600px",
                    display: "flex",
                    height: "80px",
                  }}
                >
                  <p style={{ margin: 0 }}>
                    Xinaaaaaaaaaaaaaaaaaaaaaaaaaaaaa chào Toàn... chúng tôi có
                    thể giúp bạn giải đáp thắc mắc của mình khônggg?
                  </p>
                </div>
              </div>
            </Col>
          </Row>

          {/* input Messages */}
          <Row
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              padding: "10px",
            }}
          >
            <p className="text-center">
              Bây giờ là "cho thời gian thực của space owner vào đây" theo múi
              giờ của Chủ nhà/Người tổ chức.
            </p>

            <Col md={12}>
              <TextField
                id="outlined-basic"
                label="Nhập tin nhắn"
                variant="outlined"
                // value={message}
                onChange={(e) => setMessage(e.target.value)}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SendIcon onClick={handleSendMessage} />
                    </InputAdornment>
                  ),
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Drawer */}
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        {drawerContent()}
      </Drawer>
    </Container>
  );
};

export default Message;
