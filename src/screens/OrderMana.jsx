import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button } from '@mui/material';
const paginationModel = { page: 0, pageSize: 5 };
const OrderMana = () => {
    const userId = localStorage.getItem('userId');
    const [order, setOrder] = useState([]);
    const fetchOrderData = async () => {
        const response = await axios.get(`http://localhost:9999/bookings/spaces/${userId}`);
        setOrder(response.data);
    };
    fetchOrderData();
    console.log(order);
    useEffect(() => {
        if (userId) {
            fetchOrderData();
        }
    }, [userId]);
    const updateBookingStatus = async (id, status, cancelReason = "") => {
        try {
            await axios.put(`http://localhost:9999/bookings/updatestatus/${id}`, {
                ownerApprovalStatus: status,
                cancelReason,
            });
            fetchOrderData(); // Cập nhật lại danh sách đơn hàng sau khi thay đổi trạng thái
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái đơn hàng", error);
        }
    };
    const columns = [
        { field: 'id', headerName: 'ID', width: 70, disableColumnMenu: true, resizable: false },
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
                const handleAccept = async () => {
                    try {
                        await updateBookingStatus(params.row.id, "accepted");
                        console.log(`Chấp nhận đơn hàng ${params.row.id}`);
                    } catch (error) {
                        console.error("Lỗi khi chấp nhận đơn hàng", error);
                    }
                };
                const handleReject = async () => {
                    const reason = prompt("Nhập lý do từ chối:");
                    if (reason) {
                        try {
                            await updateBookingStatus(params.row.id, "declined", reason);
                            console.log(`Từ chối đơn hàng ${params.row.id}`);
                        } catch (error) {
                            console.error("Lỗi khi từ chối đơn hàng", error);
                        }
                    }
                };
                return (
                    <div>
                        <Button variant="contained" color="success" onClick={handleAccept} sx={{ marginRight: 1 }}>
                            Chấp nhận
                        </Button>
                        <Button variant="contained" color="error" onClick={handleReject}>
                            Từ chối
                        </Button>
                    </div>
                );
            },
        },
    ];
    const rows = order.map((orderItem, index) => ({
        id: orderItem._id,
        trangthai: orderItem.ownerApprovalStatus,
        khach: orderItem.userId ? orderItem.userId.fullname : 'Không có tên khách', // Giả sử `userId` là đối tượng với trường `name`
        sdt: orderItem.userId ? orderItem.userId.phone : 'Không có SĐT', // Giả sử `userId` có trường `phone`
        ngayden: new Date(orderItem.startDate).toLocaleDateString(), // Chuyển đổi ngày
        ngaydatphong: new Date(orderItem.createdAt).toLocaleDateString(), // Chuyển đổi ngày
        gia: orderItem.totalAmount,
        danhgia: orderItem.rating || '', // Giả sử có trường `rating` cho đánh giá
        hanhdong: '', // Thêm hành động nếu cần, ví dụ: "Chấp nhận" hoặc "Hủy"
    }));
    return (
        <Paper sx={{ height: 400, width: '68%', margin: "0 auto" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                getRowId={(row) => row.id}  // Thiết lập getRowId để sử dụng _id làm id
                sx={{ border: 0 }}
            />
        </Paper>
    );
};
export default OrderMana;