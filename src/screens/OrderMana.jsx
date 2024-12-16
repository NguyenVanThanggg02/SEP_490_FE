import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Avatar,
  Box,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatNumberToVND } from '../utils/numberFormatter';
import { Paginator } from 'primereact/paginator';
import { Row } from 'react-bootstrap';
import { Constants } from '../utils/constants';

const OrderMana = () => {
  const userId = localStorage.getItem('userId');
  const [order, setOrder] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reasonOwnerRejected, setReasonOwnerRejected] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(9);
  const [curentPage, setCurrentPage] = useState(1);
  const ordersOnPage = order.slice(first, first + rows);

  const onPageChange = async (event) => {
    setFirst(event?.first);
    setCurrentPage(event.page + 1);
    setRows(event?.rows);
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(`${Constants.apiHost}/bookings/spaces/${userId}`);
        const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp giảm dần
        setOrder(sortedOrders);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setOrder([]);
        } else {
          console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
        }
      }
    };
  
    fetchOrderData();
  }, [userId]);
  

  const updateBookingStatus = async (id, status, reasonOwnerRejected = '') => {
    try {
      await axios.put(`${Constants.apiHost}/bookings/updatestatus/${id}`, {
        ownerApprovalStatus: status,
        reasonOwnerRejected: reasonOwnerRejected,
      });

      setOrder((prevOrder) =>
        prevOrder.map((orderItem) =>
          orderItem._id === id
            ? { ...orderItem, ownerApprovalStatus: status }
            : orderItem
        )
      );

      console.log(`Cập nhật trạng thái đơn hàng ${id}: ${status}`);
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái đơn hàng', error);
    }
  };

  const handleOpenDialog = (orderId) => {
    setSelectedOrderId(orderId);
    setReasonOwnerRejected('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
  };

  const handleConfirmReject = async () => {
    if (reasonOwnerRejected.trim() === '') {
      toast.warning('Vui lòng nhập lý do từ chối.');
      return;
    }
    await updateBookingStatus(selectedOrderId, 'declined', reasonOwnerRejected);
    handleCloseDialog();
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'awaiting payment':
        return 'Đang chờ';
      case 'completed':
        return 'Đã đặt';
      case 'canceled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", mb: 3, color: "#333", textAlign: "center" }}
      >
        Danh sách lịch book
      </Typography>
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {ordersOnPage.map((orderItem) => (
          <Grid item xs={12} sm={6} md={4} key={orderItem._id}>
            <Card
              sx={{
                borderRadius: "16px",
                height: "345px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.15)",
                },
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={orderItem.userId?.avatar || "/default-avatar.png"}
                    alt={orderItem.userId?.fullname || "Không có tên"}
                    sx={{ width: 48, height: 48, marginRight: 2 }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      {orderItem.userId?.fullname || "Không có tên"}
                    </Typography>
                    {orderItem.userId?.phone ? (
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        SĐT: {orderItem.userId.phone}
                      </Typography>
                    ) : orderItem.userId?.gmail ? (
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        Email: {orderItem.userId.gmail}
                      </Typography>
                    ) : (
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                        Không có thông tin liên hệ
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          orderItem.status === "completed"
                            ? "green"
                            : orderItem.status === "canceled"
                              ? "red"
                              : "orange",
                        fontWeight: "bold",
                      }}
                    >
                      {translateStatus(orderItem.status)}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="body1">
                  <strong>Tên không gian: </strong>
                  <strong>
                    <i>
                      {orderItem.spaceId
                        ? orderItem.spaceId.name
                        : "Không có tên"}
                    </i>
                  </strong>
                </Typography>
                <Typography
                  variant="body2"
                  style={{ fontWeight: "bold", fontSize: "15px" }}
                >
                  Hình thức thuê:{" "}
                  {orderItem.rentalType === "hour"
                    ? "Giờ"
                    : orderItem.rentalType === "day"
                      ? "Ngày"
                      : orderItem.rentalType === "week"
                        ? "Tuần"
                        : orderItem.rentalType === "month"
                          ? "Tháng"
                          : "Khác"}
                </Typography>
                <Typography variant="body1">
                  <strong>Ngày đặt phòng: </strong>
                  {new Date(orderItem.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="body1">
                  <strong>Ngày đến: </strong>
                  {new Date(orderItem.startDate).toLocaleDateString()}
                </Typography>
                {orderItem.selectedSlots.map((slot, index) => (
                  <div key={index}>
                    <Typography variant="body1">
                      <span style={{ fontWeight: "bold" }}>Thời gian: </span>
                      {slot.startTime} - {slot.endTime}
                    </Typography>
                  </div>
                ))}
                <Typography variant="body1">
                  <strong>Giá đặt phòng: </strong>
                  {formatNumberToVND(orderItem.totalAmount)} VNĐ
                </Typography>
                {orderItem.status ==="canceled" && (
                <Typography variant="body1">
                  <strong>Lý do hủy: </strong>
                  {orderItem?.cancelReason}
                </Typography>
                )}
              </CardContent>
              {/* <CardContent sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => updateBookingStatus(orderItem._id, "accepted")}
                  sx={{
                    borderRadius: "24px",
                    marginRight: 1,
                    paddingX: 3,
                    paddingY: 1,
                  }}
                  disabled={
                    orderItem.ownerApprovalStatus === "accepted" ||
                    orderItem.ownerApprovalStatus === "declined"
                  }
                >
                  Chấp nhận
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleOpenDialog(orderItem._id)}
                  sx={{
                    borderRadius: "24px",
                    paddingX: 3,
                    paddingY: 1,
                  }}
                  disabled={
                    orderItem.ownerApprovalStatus === "accepted" ||
                    orderItem.ownerApprovalStatus === "declined"
                  }
                >
                  Từ chối
                </Button>
              </CardContent> */}
            </Card>
          </Grid>
        ))}

        {/* Dialog for rejecting orders */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              width: "400px",
            },
          }}
        >
          <DialogTitle>Từ chối lịch book</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Lý do từ chối"
              type="text"
              fullWidth
              variant="outlined"
              value={reasonOwnerRejected}
              onChange={(e) => setReasonOwnerRejected(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ borderRadius: "16px" }}>
              Hủy
            </Button>
            <Button
              onClick={handleConfirmReject}
              color="error"
              sx={{ borderRadius: "16px" }}
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
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
          totalRecords={order.length}
          onPageChange={onPageChange}
        />
      </Row>
    </>
  );
};

export default OrderMana;
