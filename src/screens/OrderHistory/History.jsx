import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Grid, Typography, TextField, Button, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { formatNumberToVND } from "../../utils/numberFormatter";
import '../../style/History.css';

const History = () => {
  const [date, setDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [service, setService] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [rentalType, setRentalType] = useState("Tất cả"); // Thêm state cho rentalType
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]); // State cho danh sách đã lọc
  
  const user = localStorage.getItem("userId");

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
          filteredData = filteredData.filter((item) => new Date(item.endDate) <= new Date(date));
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
                value={rentalType} // Cập nhật giá trị ở đây
                onChange={(e) => setRentalType(e.target.value)} // Cập nhật state ở đây
                fullWidth
                variant="outlined"
              >
                <MenuItem value="Tất cả">Tất cả</MenuItem>
                <MenuItem value="hour">Giờ</MenuItem>
                <MenuItem value="day">Ngày</MenuItem>
                <MenuItem value="week">Tuần</MenuItem>
                <MenuItem value="month">Tháng</MenuItem>
                {/* Thêm các tùy chọn khác nếu cần */}
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
                style={{height:'55px'}}
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
                {filteredBookings.length === 0 ? (
                  <Grid item md={12}>
                    <Typography variant="body1" className="no-data">
                      Bạn chưa đặt lịch nào !!!
                    </Typography>
                  </Grid>
                ) : (
                  filteredBookings.map((item) => (
                    <Grid item md={6} key={item._id}>
                      <Card
                        variant="outlined"
                        style={{
                          padding: "15px",
                          marginBottom: "10px",
                          borderRadius: "8px",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                          height: "214px",
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item md={4}>
                            <img
                              src={item.items[0].spaceId.images[0].url}
                              alt="Ảnh không gian"
                              style={{
                                height: "150px",
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
                              {item.items[0].spaceId.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ fontWeight: "bold" }}
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
                              style={{ color: "gray" }}
                            >
                              Thời gian đặt: {formatDate(item.startDate)}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ color: "gray" }}
                            >
                              Thời gian trả: {formatDate(item.endDate)}
                            </Typography>
                            {item.selectedSlots.map((slot, index) => (
                              <div key={index}>
                                <Typography
                                  variant="body2"
                                  style={{ color: "gray" }}
                                >
                                  Thời gian: {slot.startTime} - {slot.endTime}
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
                              }}
                            >
                              Trạng thái:{" "}
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
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
