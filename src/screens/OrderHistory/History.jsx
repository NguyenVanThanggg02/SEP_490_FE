import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, Grid, Typography, TextField, Button, Select, MenuItem, Dialog, DialogContent, DialogActions, FormControl, InputLabel } from "@mui/material";
import axios from "axios";
import { formatNumberToVND } from "../../utils/numberFormatter";
import '../../style/History.css';
import { Row } from "react-bootstrap";
import { Paginator } from "primereact/paginator";
import { toast } from "react-toastify";
import { formatMoney } from "../../utils/moneyFormatter";

const History = () => {
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Tất cả");
  const [rentalType, setRentalType] = useState("Tất cả"); // Thêm state cho rentalType
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]); // State cho danh sách đã lọc
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(6);
  const [, setCurrentPage] = useState(1);
  const productsOnPage = filteredBookings.slice(first, first + rows);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const availableReasons = [
    "Thay đổi lịch trình hoặc kế hoạch",
    "Không còn nhu cầu sử dụng dịch vụ",
    "Vấn đề với dịch vụ khách hàng",
  ];
  const [bookingCheckCancel, setBookingCheckCancel] = useState({
    bookingId: undefined,
    contentDialog: undefined,
  })
  const [openDialog, setOpenDialog] = useState(undefined)

  const handleOpenDialog = async (bookingId) => {
    if (!user) return;
    try {
      const response = await axios
        .post(`http://localhost:9999/bookings/cancel-booking-precheck`, {
          userId: user,
          bookingId: bookingId
        });
      if (response.data) {
        if (!response.data.isAllowCancel) {
          toast.error("Không thể hủy đặt không gian");
          loadHistory();
          return;
        } else {
          setBookingCheckCancel({
            contentDialog: `Bạn có muốn hủy đặt không gian và nhận lại ${formatMoney(response.data.amount)}?`,
            bookingId: bookingId,
          })
          setOpenDialog(true);
        }
      } else {
        toast.error("Có lỗi xảy ra vui lòng thử lại sau")
        return;
      }
    } catch (e) {
      toast.error("Có lỗi xảy ra vui lòng thử lại sau")
    }
  };
  const handleCloseDialog = () => {
    setBookingCheckCancel(undefined)
    setOpenDialog(false);
  };

  const user = localStorage.getItem("userId");

  const loadHistory = () => {
    axios
      .get(`http://localhost:9999/bookings/bookingByUserId/${user}`)
      .then((res) => {
        const updatedBookings = res.data.map((booking) => ({
          ...booking,
          status: booking.reasonOwnerRejected ? "canceled" : booking.status,
        }));
        updatedBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    if (user) {
      loadHistory()
    }
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

      setFilteredBookings(filteredData);
  };

  const handleCancelBooking = () => {
    const reason = selectedReason === 'Khác' ? customReason : selectedReason;

    axios
      .post(`http://localhost:9999/bookings/cancel-booking`, {
        userId: user,
        bookingId: bookingCheckCancel.bookingId,
        cancelReason: reason,
      })
      .then((_res) => {
        toast.success('Hủy đặt không gian thành công');
        loadHistory();
      })
      .catch((_err) => {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
      });

    handleCloseDialog();
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
                              src={item.items[0].spaceId.images[0].url}
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
                              {item.items[0].spaceId.name}
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
                          disabled={!item.isAllowCancel}
                          style={{
                            marginTop: "auto",
                            marginLeft: "auto",
                          }}
                          onClick={() => handleOpenDialog(item._id)}
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
          style={{ backgroundColor: "white" }}
          first={first}
          rows={rows}
          totalRecords={filteredBookings.length}
          onPageChange={onPageChange}
        />
      </Row>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
        <DialogContent>
          <Typography>{bookingCheckCancel?.contentDialog}</Typography>
          <FormControl  fullWidth margin="normal">
            <InputLabel>Lý do hủy</InputLabel>
            <Select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              {availableReasons.map((reason, index) => (
                <MenuItem key={index} value={reason}>
                  {reason}
                </MenuItem>
              ))}
              <MenuItem value="Khác">Khác</MenuItem>
            </Select>
          </FormControl>
          {selectedReason === "Khác" && (
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Nhập lý do hủy..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" variant="outlined">
            Hủy
          </Button>
          <Button onClick={handleCancelBooking} color="primary" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default History;
