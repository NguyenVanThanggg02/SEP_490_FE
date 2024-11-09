import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Grid, Typography, TextField, Button, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { formatNumberToVND } from "../../utils/numberFormatter";
import '../../style/History.css';
import { Row } from "react-bootstrap";
import { Paginator } from "primereact/paginator";
import CancelBooking from "./CancelBooking";

const History = () => {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [rentalType, setRentalType] = useState("Tất cả"); // Thêm state cho rentalType
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]); // State cho danh sách đã lọc
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(6);
  const [curentPage, setCurrentPage] = useState(1);
  const productsOnPage = filteredBookings.slice(first, first + rows);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [visible, setVisible] = useState(false);

  const user = localStorage.getItem("userId");
  const statusBook = bookings.map((m) => m.status);
  useEffect(() => {
    axios
      .get(`http://localhost:9999/bookings/bookingByUserId/${user}`)
      .then((res) => {
        setBookings(res.data);
        setFilteredBookings(res.data); // Đặt danh sách đã lọc bằng danh sách đặt ban đầu
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [user]);

  const handleSearch = () => {
      let filteredData = bookings;

      if (date) {
          filteredData = filteredData.filter((item) => new Date(item.startDate) <= new Date(date));
      }

      // Lọc theo rentalType
      if (rentalType && rentalType !== "Tất cả") {
          filteredData = filteredData.filter((item) => item.rentalType === rentalType);
      }

      if (status && status !== "Tất cả") {
        filteredData = filteredData.filter((item) => item.status === status);
    }

      // Cập nhật state của bookings đã lọc
      setFilteredBookings(filteredData);
      console.log(filteredData); // In ra kết quả lọc
  };

  const formatDate = (inputDate) => {
      const dateObject = new Date(inputDate);
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObject.getFullYear();
      return `${day}-${month}-${year}`;
  };
  const onPageChange = async (event) => {
    setFirst(event?.first);
    setCurrentPage(event.page + 1);
    setRows(event?.rows);
  };

  const handleViewToCancel = (bookingId) => {
    const booking = bookings.find((b) => b._id === bookingId);
    setSelectedBooking(booking);
    setVisible(true);
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
    setFilteredBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking._id === bookingId
          ? { ...booking, status: newStatus }
          : booking
      )
    );
  };

  return (
    <div className="container containerhistory">
      <Card className="cardhistory" elevation={3}>
        <CardHeader
          title="Lịch sử đặt"
          style={{ backgroundColor: "#2196F3", color: "white" }}
        />
        <CardContent>
          <Grid container spacing={2} mb={3}>
            <Grid item md={2}>
              <TextField
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item md={3}>
              <Select
                value={rentalType}
                onChange={(e) => setRentalType(e.target.value)}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="Tất cả">Tất cả</MenuItem>
                <MenuItem value="hour">Giờ</MenuItem>
                <MenuItem value="day">Ngày</MenuItem>
                <MenuItem value="week">Tuần</MenuItem>
                <MenuItem value="month">Tháng</MenuItem>
              </Select>
            </Grid>
            <Grid item md={3}>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                fullWidth
                variant="outlined"
              >
                <MenuItem value="Tất cả">Tất cả</MenuItem>
                <MenuItem value="awaiting payment">Chờ thanh toán</MenuItem>
                <MenuItem value="completed">Đã thanh toán</MenuItem>
                <MenuItem value="canceled">Đã huỷ</MenuItem>
              </Select>
            </Grid>
            <Grid item md={2} container alignItems="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                style={{ height: "55px" }}
              >
                Tìm kiếm
              </Button>
            </Grid>
          </Grid>

          <Card className="cardhistory" elevation={2}>
            <CardHeader
              title="Danh sách đặt"
              style={{ backgroundColor: "#e3f2fd" }}
            />
            <CardContent>
              <Grid container spacing={2}>
                {productsOnPage.length === 0 ? (
                  <Grid item md={12}>
                    <Typography variant="body1" className="no-data">
                      Bạn chưa đặt lịch nào !!!
                    </Typography>
                  </Grid>
                ) : (
                  productsOnPage.map((item) => (
                    <Grid item md={6} key={item._id}>
                      <Card
                        variant="outlined"
                        style={{
                          padding: "15px",
                          marginBottom: "10px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          height: "250px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item md={4}>
                            <img
                              src={item?.items?.[0]?.spaceId?.images?.[0]?.url}
                              alt="Ảnh không gian"
                              style={{
                                height: "170px",
                                width: "100%",
                                borderRadius: "8px",
                                objectFit: "cover",
                              }}
                            />
                          </Grid>
                          <Grid item md={8}>
                            <Typography
                              variant="h6"
                              style={{ color: "#1976d2", fontWeight: "bold" }}
                            >
                              {item.items[0]?.spaceId.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ fontWeight: "bold", fontSize: "15px" }}
                            >
                              Thuê theo:{" "}
                              {item.rentalType === "hour"
                                ? "Giờ"
                                : item.rentalType === "day"
                                  ? "Ngày"
                                  : item.rentalType === "week"
                                    ? "Tuần"
                                    : item.rentalType === "month"
                                      ? "Tháng"
                                      : "Khác"}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ fontWeight: "bold" }}
                            >
                              Giá: {formatNumberToVND(item.totalAmount)} VND
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ color: "gray", fontSize: "15px" }}
                            >
                              <span style={{ fontWeight: "bold" }}>
                                Thời gian đặt:{" "}
                              </span>
                              {formatDate(item.startDate)}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ color: "gray", fontSize: "15px" }}
                            >
                              <span style={{ fontWeight: "bold" }}>
                                Thời gian trả:{" "}
                              </span>
                              {formatDate(item.endDate)}
                            </Typography>
                            {item.selectedSlots.map((slot, index) => (
                              <div key={index}>
                                <Typography
                                  variant="body2"
                                  style={{ color: "gray", fontSize: "15px" }}
                                >
                                  <span style={{ fontWeight: "bold" }}>
                                    Thời gian:{" "}
                                  </span>
                                  {slot.startTime} - {slot.endTime}
                                </Typography>
                              </div>
                            ))}
                            <Typography
                              variant="body2"
                              style={{
                                color:
                                  item.status === "Đã hoàn tất"
                                    ? "green"
                                    : "red",
                                fontSize: "15px",
                              }}
                            >
                              <span style={{fontWeight:'bold'}}>Trạng thái: </span>
                              {item.status === "awaiting payment"
                                ? "Chờ thanh toán"
                                : item.status === "completed"
                                  ? "Đã thanh toán"
                                  : item.status === "canceled"
                                    ? "Đã huỷ"
                                    : "Khác"}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled={item.status === "canceled"}
                          style={{
                            marginTop: "auto",
                            marginLeft: "auto",
                          }}
                          onClick={() => handleViewToCancel(item._id)}
                        >
                          Huỷ lịch
                        </Button>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Paginator
          style={{ backgroundColor: "#f9f9f9" }}
          first={first}
          rows={rows}
          totalRecords={filteredBookings.length}
          onPageChange={onPageChange}
        />
      </Row>
      {visible && (
        <CancelBooking
          visible={visible}
          setVisible={setVisible}
          booking={selectedBooking}
          updateBookingStatus={updateBookingStatus}
        />
      )}
    </div>
  );
};

export default History;
