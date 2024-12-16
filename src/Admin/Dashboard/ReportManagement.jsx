import { Delete, Visibility } from '@mui/icons-material';
import { IconButton, Paper, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';
import { Table } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Box } from 'react-bootstrap-icons';
import { Constants } from '../../utils/constants';

const ReportManagement = () => {

    const [report, setReport] = useState([]);
    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await axios.get(`${Constants.apiHost}/reports`);
                setReport(response.data.data);
            } catch (error) {
                console.error('Error fetching report:', error);
            }
        };
        fetchReport();
    }, []);
    return (
        <Container>
            <TableContainer component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Tiêu đề bài viết</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Người đăng</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Lý do báo cáo</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Ngày báo cáo</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {report &&
                            report.length > 0 &&
                            report.map((report, index) => (
                                <TableRow key={report.reportId} hover>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell sx={{ whiteSpace: 'pre-wrap' }}>
                                        {report.postTitle}
                                    </TableCell>
                                    <TableCell>{report.reportedBy}</TableCell>
                                    <TableCell>{report.reason}</TableCell>
                                    <TableCell>{report.reportedAt}</TableCell>
                                    <TableCell>{report.status}</TableCell>
                                    <TableCell>
                                        <Box>
                                            {report.status === 'Chưa xử lý' && (
                                                <>
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton
                                                            color="primary"
                                                        >
                                                            <Visibility />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa bài viết">
                                                        <IconButton
                                                            color="secondary"
                                                        >
                                                            <Delete />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Container>
    );
};

export default ReportManagement;