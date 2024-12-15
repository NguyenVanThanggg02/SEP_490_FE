import React, { useEffect, useState } from 'react'
import { Box, Button, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { Col, Container, Row } from 'react-bootstrap'
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Pane, Spinner } from "evergreen-ui";
import { Link } from "react-router-dom";
import { ExclamationCircleFill } from 'react-bootstrap-icons';
import { Paginator } from 'primereact/paginator';
import { toast } from 'react-toastify';
const ManaReport = () => {
    const [spaceReported, setspaceReported] = useState([]);
    const [complaint, setComplaint] = useState("");
    const [dialogComplaint,setDialogComplaint ] = useState(false);
    const [selectedReportId, setSelectedReportId] = useState(null); // Report ID lưu tạm
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(8);
    const [curentPage, setCurrentPage] = useState(1);
    const listPostedOnPage = spaceReported.slice(first, first + rows);
    const userId = localStorage.getItem('userId');
    useEffect(() => {
        axios
        .get(`http://localhost:9999/reports/${userId}`)
            .then((response) => {
                const sortedSpaces = response.data.sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                setspaceReported(sortedSpaces);
            })
            .catch((error) => {
                console.error("Error fetching spaces:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const openComplaintDialog = (reportId) => {
        setSelectedReportId(reportId); // Lưu ID báo cáo hiện tại
        setComplaint(""); // Reset input
        setDialogComplaint(true); // Hiển thị dialog
      };
    
    const updateComplaint = async () => {
        if (!complaint.trim()) {
            toast.error("Lý do khiếu nại không được để trống.");
            return;
          }
        try {
          const response = await axios.put(
            `http://localhost:9999/reports/complaint/${selectedReportId}`,
            { complaint: complaint.trim()}
          );
            toast.success("Gửi đơn khiếu nại thành công!");
            setDialogComplaint(false); // Đóng dialog
            setSelectedReportId(null); // Reset reportId

        } catch (error) {
          console.error("Lỗi khi cập nhật complaint:", error.response?.data);
        }
      };
    const onPageChange = async (event) => {
        setFirst(event?.first);
        setCurrentPage(event.page + 1);
        setRows(event?.rows);
    };
    if (loading) {
        return (
            <Pane
                display="flex"
                alignItems="center"
                justifyContent="center"
                height={400}
            >
                <Spinner />
            </Pane>
        );
    }
    return (
        <Container fluid>
            <Row className="pb-5">
                <Typography variant="h4" className="text-center">
                    Danh sách không gian bị tố cáo
                </Typography>
            </Row>
            <Row className="pb-5">
                <Col md={6} style={{ marginLeft: "auto", flexDirection: "row" }}>
                    <TextField
                        id="outlined-basic"
                        placeholder="Tên không gian"
                        variant="outlined"
                        size="small"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: "350px" }}
                    />
                </Col>
            </Row>
            <Row>
            {listPostedOnPage.length === 0 ? (
                    <Typography variant="body1" align="center">
                        Không có tố cáo.
                    </Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Tên</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Ảnh</TableCell>
                                <TableCell sx={{ fontWeight: 700, width: '180px' }}>Người tố cáo</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Lý do tố cáo</TableCell>
                                <TableCell sx={{ fontWeight: 700, width: '80px' }}>Lượt tố cáo thành công</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Trạng thái không gian</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Trạng thái báo cáo</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Trạng thái khiếu nại</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Nội dung đã khiếu nại</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {listPostedOnPage.map((lpost, index) => (
                                <TableRow key={lpost._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{lpost?.spaceId?.name}</TableCell>
                                    <TableCell>
                                        <img
                                            src={lpost?.spaceId?.images?.[0]?.url || "path/to/default/image.jpg"}
                                            alt={lpost?.spaceId?.name}
                                            style={{ width: "100px", height: "auto" }}
                                        />
                                    </TableCell>
                                    <TableCell>{lpost?.userId?.fullname}</TableCell>
                                    <TableCell>
                                        {lpost.reasonId.map((reason) => reason.text.join(", ")).join("; ")}
                                        {lpost.customReason && `; ${lpost.customReason}`}
                                    </TableCell>
                                    <TableCell>{lpost?.spaceId?.reportCount}</TableCell>
                                    <TableCell sx={{ color: lpost?.spaceId?.censorship === 'Chấp nhận' ? 'green' : 'red' }}>
                                        {lpost?.spaceId?.censorship}
                                    </TableCell>
                                    <TableCell sx={{ color: lpost.statusReport === 'Từ chối' ? 'error.main' : lpost.statusReport === 'Chấp nhận' ? 'success.main' : 'warning.main' }}>
                                        {lpost.statusReport}
                                    </TableCell>
                                    <TableCell sx={{ color: lpost.statusComplaint === 'Từ chối' ? 'error.main' : lpost.statusComplaint === 'Chấp nhận' ? 'success.main' : 'warning.main' }}>
                                        {lpost.statusComplaint}
                                    </TableCell>
                                    <TableCell>
                                        {lpost.complaint}
                                    </TableCell>
                                    <TableCell>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <Link to={`/spaces/${lpost?.spaceId?._id}`} style={{ textDecoration: "none" }}>
                                                <Button size="small" variant="outlined" sx={{ textTransform: "none" }}>
                                                    Xem phòng
                                                </Button>
                                            </Link>
                                            <Button size="small" variant="contained" color="info" sx={{ textTransform: "none" }} 
                                            onClick={()=>openComplaintDialog(lpost._id)}>
                                                Khiếu nại
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Row>
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
                    totalRecords={spaceReported.length}
                    onPageChange={onPageChange}
                />
            </Row>
        </Container>
    );
};
export default ManaReport;