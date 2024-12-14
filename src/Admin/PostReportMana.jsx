import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { CheckCircle, Eye, HouseAddFill, Person, PersonLinesFill } from "react-bootstrap-icons";
import axios from "axios";
import CommunityStandards from "./CommunityStandards";
import DetailForAdmin from "./DetailForAdmin";
import { Paginator } from "primereact/paginator";
import { Grid, Card, CardMedia, CardContent, Button, Typography, Box, IconButton, FormControl, Select, MenuItem, InputLabel, TextField, Autocomplete, Tooltip, TableCell, TableRow, TableBody, TableHead, TableContainer, Paper, Table, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { BlockOutlined, Preview } from "@mui/icons-material";
import { Image } from "antd";
import { toast } from "react-toastify";

const PostReportMana = () => {
  const [reportPosts, setReportPosts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [currentPostId, setCurrentPostId] = useState(null);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [rows, setRows] = useState(9);
  const [first, setFirst] = useState(0);
  // const productsOnPage = spaces.slice(first, first + rows);
  const [, setCurrentPage] = useState(1);
  const [selectedOwner, setSelectedOwner] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dialogState, setDialogState] = useState({
    open: false,
    type: "",
    id: "",
  });
  const [dialogDetailSpace, setDialogDetailSpace] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rejectReason, setRejectReason] = useState(""); // Lưu lý do từ chối
  const [showRejectField, setShowRejectField] = useState(false);
  const uniqueOwners = Array.from(
    new Set(["Tất cả", ...reportPosts.map((space) => space.userId?.fullname || "Không rõ")])
  );

  const filteredSpaces = reportPosts
    .filter((space) => {
      const createdAt = new Date(space.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(new Date(endDate).setHours(23, 59, 59, 999)) : null;

      return (
        (!selectedOwner || selectedOwner === "Tất cả" || space.userId?.fullname === selectedOwner) &&
        (!selectedStatus || space.censorship === selectedStatus) &&
        (!start || createdAt >= start) &&
        (!end || createdAt <= end)
      );
    })
    .sort((a, b) => {
      if (startDate || endDate) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });



  const productsOnPage = filteredSpaces.slice(first, first + rows);

  useEffect(() => {
    axios
      .get("http://localhost:9999/reports")
      .then((response) => {
        const sortedSpaces = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setReportPosts(sortedSpaces);
      })
      .catch((error) => {
        console.error("Error fetching spaces:", error);
      });
  }, []);

  const handleShowDetail = async (spaceId, reportId) => {
    console.log(spaceId);
    console.log(reportId);

    try {
      const responseSpace = await axios.get(`http://localhost:9999/spaces/${spaceId}`);
      setSelectedSpaceId(spaceId);
      setSelectedSpace(responseSpace.data);
      setDialogDetailSpace(true);

      const responseReport = await axios.get(`http://localhost:9999/reports/getreport/${reportId}`);
      setSelectedReport(responseReport.data);
    } catch (error) {
      console.error("Error fetching space details:", error);
    }
  };

  const handleAccept = (reportId) => {
    const selectedSpaceREPORT = reportPosts.find((report) => report._id === reportId);

    if (selectedSpaceREPORT.statusReport === "Chấp nhận") {
      return;
    }

    axios
      .put(`http://localhost:9999/reports/reportstatus/${reportId}`, {
        statusReport: "Chấp nhận",
      })
      .then(() => {
        setReportPosts((prevSpaces) =>
          prevSpaces.map((report) =>
            report._id === reportId ? { ...report, statusReport: "Chấp nhận" } : report
          )
        );
        toast.success("Đã chấp nhận đơn tố cáo")
        setDialogDetailSpace(false);
      })
      .catch((error) => {
        console.error("Error updating statusReport:", error);
      });
  };

  const handleReject = (reportId) => {
    axios
      .put(`http://localhost:9999/reports/reportsreject/${reportId}`, {
        reportRejectionReason: rejectReason,
      })
      .then(() => {
        setReportPosts((prevReports) =>
          prevReports.map((report) =>
            report._id === reportId
              ? { ...report, statusReport: "Từ chối", reportRejectionReason: rejectReason }
              : report
          )
        );
        setRejectReason("");
        setShowRejectField(false);
      })
      .catch((error) => {
        console.error("Error updating censorship:", error);
      });
  };

  const handleBackToList = () => {
    setShowDetail(false);
  };
  const onPageChange = (event) => {
    setFirst(event?.first);
    setCurrentPage(event.page + 1);
    setRows(event?.rows);
  };


  // Xử lý mở dialog cho báo cáo
  const handleApproveReport = (reportId) => {
    // Logic để hiển thị dialog cho báo cáo
    console.log("Duyệt báo cáo ID:", reportId);
    setDialogState({
      open: true,
      type: "report",
      id: reportId,
    });
  };

  // Xử lý mở dialog cho khiếu nại
  const handleApproveAppeal = (reportId) => {
    // Logic để hiển thị dialog cho khiếu nại
    setDialogState({
      open: true,
      type: "appeal",
      id: reportId,
    });
  };
  const handleRejectButtonClick = () => {
    setShowRejectField(true);  // Hiển thị TextField khi nhấn nút
  };

  return (
    <Container fluid className="py-4">
      {!showDetail ? (
        <>
          <Row>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginBottom: "30px" }}
            >
              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth>
                  <Autocomplete
                    value={selectedOwner}
                    options={uniqueOwners}
                    onChange={(event, newValue) => {
                      setSelectedOwner(newValue || "");
                      setFirst(0);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Chủ cho thuê"
                        variant="outlined"
                      />
                    )}
                    sx={{
                      borderRadius: "8px",
                      boxShadow: 3,
                      "&:hover": { boxShadow: 6 },
                    }}
                    disableClearable
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option} value={option}>
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          <HouseAddFill
                            style={{ fontSize: "40px", marginRight: "10px" }}
                          />
                          {option}
                        </Typography>
                      </MenuItem>
                    )}
                    isOptionEqualToValue={(option, value) => option === value} // Handles value comparison
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="status-filter-label">
                    Lọc theo trạng thái
                  </InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    label="Lọc theo trạng thái"
                    sx={{
                      borderRadius: "8px",
                      boxShadow: 3,
                      "&:hover": { boxShadow: 6 },
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    <MenuItem value="Chấp nhận">Chấp nhận</MenuItem>
                    <MenuItem value="Từ chối">Từ chối</MenuItem>
                    <MenuItem value="Chờ duyệt">Chờ duyệt</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={6}>
                <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                  <TextField
                    label="Từ ngày"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate || ""}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{
                      borderRadius: "8px",
                      boxShadow: 3,
                      "&:hover": { boxShadow: 6 },
                      width: "100%",
                    }}
                  />
                  <TextField
                    label="Đến ngày"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate || ""}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{
                      borderRadius: "8px",
                      boxShadow: 3,
                      "&:hover": { boxShadow: 6 },
                      width: "100%",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tên không gian</TableCell>
                    <TableCell sx={{ fontWeight: 700,width: '150px' }}>Chủ không gian</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Khách tố cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Lý do báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Kiến nghị báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700,width: '80px'  }}>Lượt báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trạng thái báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700  }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsOnPage?.length > 0 &&
                    productsOnPage.map((report, index) => (
                      <TableRow key={report._id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{report.spaceId.name}</TableCell>
                        <TableCell>{report.spaceId?.userId?.fullname}</TableCell>
                        <TableCell>{report.userId?.fullname}</TableCell>
                        <TableCell>
                          {report.reasonId.map((reason) => reason.text.join(", ")).join("; ")}
                          {report.customReason && `; ${report.customReason}`}
                        </TableCell>
                        <TableCell>Để lí do kiến nghịnghị</TableCell>
                        <TableCell>{report.spaceId.reportCount}</TableCell>
                        <TableCell sx={{ color: report.statusReport === 'Từ chối' ? 'error.main' : report.statusReport === 'Chấp nhận' ? 'success.main' : 'warning.main' }}>
                          {report.statusReport}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Xem không gian">
                            <IconButton
                              color="secondary"
                              onClick={() => handleShowDetail(report.spaceId._id, report._id)}
                            >
                              <Preview />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Duyệt báo cáo">
                            <IconButton
                              color="primary"
                              onClick={() => handleApproveReport(report._id)}
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Duyệt khiếu nại">
                            <IconButton
                              color="secondary"
                              onClick={() => handleApproveAppeal(report._id)}
                            >
                              <BlockOutlined />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Row>
        </>
      ) : (
        <DetailForAdmin id={selectedSpaceId} onBack={handleBackToList} />
      )}
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!showDetail && (
          <Paginator
            style={{ backgroundColor: "white" }}
            first={first}
            rows={rows}
            totalRecords={filteredSpaces.length}
            onPageChange={onPageChange}
          />
        )}
      </Row>
      <Dialog
        open={dialogState.open}
        onClose={() => setDialogState({ open: false, type: "", id: "" })}
      >
        <DialogTitle>
          {dialogState.type === "report" ? "Duyệt Báo Cáo" : "Duyệt Khiếu Nại"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn {dialogState.type === "report" ? "duyệt báo cáo" : "duyệt khiếu nại"} này không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              // Logic xử lý đồng ý
              console.log("Đồng ý:", dialogState);
              setDialogState({ open: false, type: "", id: "" });
            }}
            color="primary"
          >
            Đồng ý
          </Button>
          <Button
            onClick={() => {
              // Logic xử lý từ chối
              console.log("Từ chối:", dialogState);
              setDialogState({ open: false, type: "", id: "" });
            }}
            color="secondary"
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={dialogDetailSpace}
        onClose={() => setDialogDetailSpace(false)} // Đóng dialog
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Thông Tin Chi Tiết Không Gian</DialogTitle>
        <DialogContent>
          {selectedSpace && (
            <Box sx={{ marginTop: '30px' }}>
              <Card>
                <Row gutter={[16, 16]}>
                  {selectedSpace?.images?.map((item) => (
                    <Col span={6} key={item._id}>
                      <Image.PreviewGroup
                        preview={{
                          onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`),
                        }}
                      >
                        <Image
                          src={item.url}
                          alt={`Image ${item._id}`}
                          style={{
                            width: '100%',
                            height: '200px',
                            borderRadius: '3px',
                            objectFit: 'cover',
                          }}
                        />
                      </Image.PreviewGroup>
                    </Col>
                  ))}
                </Row>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {selectedSpace.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Giá theo giờ:</strong> {selectedSpace.pricePerHour != null ? `${selectedSpace.pricePerHour}` : 'Không có giá theo giờ'} <br />
                    <strong>Giá theo ngày:</strong> {selectedSpace.pricePerDay != null ? `${selectedSpace.pricePerDay}` : 'Không có giá theo ngày'} <br />
                    <strong>Giá theo tháng:</strong> {selectedSpace.pricePerMonth != null ? `${selectedSpace.pricePerMonth}` : 'Không có giá theo tháng'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Mô tả:</strong> {selectedSpace.description || 'Không có mô tả'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Diện tích:</strong> {selectedSpace.area || 'Không có diện tích'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Tiện ích:</strong>
                    {selectedSpace?.appliancesId?.appliances && selectedSpace.appliancesId.appliances.length > 0 ? (
                      <ul>
                        {selectedSpace.appliancesId.appliances.map((appliance, index) => (
                          <li key={index}>
                            {appliance.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'Không có tiện ích'
                    )}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Quy tắc:</strong>
                    {selectedSpace.rulesId ? (
                      <ul>
                        {[...selectedSpace?.rulesId?.rules, ...selectedSpace?.rulesId?.customeRules].map((rule, index) => (
                          <li key={index}>{rule}</li>
                        ))}
                      </ul>
                    ) : (
                      'Không có quy tắc'
                    )}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Vị trí:</strong> {selectedSpace.location || 'Không có vị trí'}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    <strong>Vị trí chi tiết:</strong> {selectedSpace.detailAddress || 'Không có vị trí chi tiết'}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Box style={{ marginRight: "auto" }}>
            <Button variant="contained" color="success" onClick={() => handleAccept(selectedReport?._id)}>
              Chấp nhận báo cáo
            </Button>
            <Button variant="contained" color="error" className="ms-2" onClick={handleRejectButtonClick}>
              Từ chối báo cáo
            </Button>
            {showRejectField && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập lý do từ chối"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </Box>
            )}
            {showRejectField && rejectReason && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleReject(selectedReport?._id)}
                style={{ marginLeft: '10px' }}
              >
                Xác nhận
              </Button>
            )}
          </Box>

          <Button onClick={() => setDialogDetailSpace(false)} color="primary">
            Đóng
          </Button>
        </DialogActions>

      </Dialog>
    </Container>

  );
};

export default PostReportMana;