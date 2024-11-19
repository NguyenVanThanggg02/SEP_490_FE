import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { toast } from 'react-toastify';

const paginationModel = { page: 0, pageSize: 5 };

const OrderMana = () => {
    const userId = localStorage.getItem('userId');
    const [order, setOrder] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [reasonOwnerRejected, setreasonOwnerRejected] = useState("");

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/bookings/spaces/${userId}`);
                setOrder(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setOrder([]);
                } else {
                    console.error("Lỗi khi lấy dữ liệu đơn hàng:", error);
                }
            }
        };

        fetchOrderData();
    }, [userId]);

    const updateBookingStatus = async (id, status, reasonOwnerRejected = "") => {
        try {
            await axios.put(`http://localhost:9999/bookings/updatestatus/${id}`, {
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
            console.error("Lỗi khi cập nhật trạng thái đơn hàng", error);
        }
    };

    const handleOpenDialog = (orderId) => {
        setSelectedOrderId(orderId);
        setreasonOwnerRejected("");
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedOrderId(null);
    };

    const handleConfirmReject = async () => {
        if (reasonOwnerRejected.trim() === "") {
            toast.warning("Vui lòng nhập lý do từ chối.");
            return;
        }
        await updateBookingStatus(selectedOrderId, "declined", reasonOwnerRejected);
        handleCloseDialog();
    };
    
    const translateStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Đang chờ';
            case 'accepted':
                return 'Chấp nhận';
            case 'declined':
                return 'Từ chối';
            default:
                return 'Không xác định';
        }
    };
    
    const columns = [
        { field: 'trangthai', headerName: 'Trạng thái', width: 100, disableColumnMenu: true, resizable: false },
        { field: 'khach', headerName: 'Khách', width: 130, disableColumnMenu: true, resizable: false },
        { field: 'sdt', headerName: 'SĐT', width: 90, disableColumnMenu: true, sortable: false, resizable: false },
        { field: 'ngayden', headerName: 'Ngày đến', width: 160, disableColumnMenu: true, resizable: false },
        { field: 'ngaydatphong', headerName: 'Ngày đặt phòng', width: 160, disableColumnMenu: true, resizable: false },
        { field: 'gia', headerName: 'Giá đặt phòng', width: 120, disableColumnMenu: true, resizable: false },
        { field: 'danhgia', headerName: 'Đánh giá', width: 200, disableColumnMenu: true, resizable: false, sortable: false },
        {
            field: 'hanhdong',
            headerName: 'Hành động',
            width: 250,
            disableColumnMenu: true,
            sortable: false,
            renderCell: (params) => {
                const isDisabled = params.row.trangthai === "Chấp nhận" || params.row.trangthai === "Từ chối";

                const handleAccept = async () => {
                    await updateBookingStatus(params.row.id, "accepted");
                    console.log(`Chấp nhận đơn hàng ${params.row.id}`);
                };

                return (
                    <div>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleAccept}
                            sx={{ marginRight: 1 }}
                            disabled={isDisabled}
                        >
                            Chấp nhận
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleOpenDialog(params.row.id)}
                            disabled={isDisabled}
                        >
                            Từ chối
                        </Button>
                    </div>
                );
            },
        },
    ];

    const rows = order?.map((orderItem, index) => ({
        id: orderItem._id,
        trangthai: translateStatus(orderItem.ownerApprovalStatus),
        khach: orderItem.userId ? orderItem.userId.fullname : 'Không có tên khách',
        sdt: orderItem.userId ? orderItem.userId.phone : 'Không có SĐT',
        ngayden: new Date(orderItem.startDate).toLocaleDateString(),
        ngaydatphong: new Date(orderItem.createdAt).toLocaleDateString(),
        gia: orderItem.totalAmount,
        danhgia: orderItem.rating || '',
        hanhdong: '',
    }));

    return (
      <Paper sx={{ height: 400, width: "68%", margin: "0 auto" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row.id}
          sx={{ border: 0 }}
        />
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          sx={{
            "& .MuiDialog-paper": {
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
              onChange={(e) => setreasonOwnerRejected(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleConfirmReject} color="error">
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
};

export default OrderMana;
