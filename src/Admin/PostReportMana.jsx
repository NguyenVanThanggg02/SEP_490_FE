import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Eye, HouseAddFill } from "react-bootstrap-icons";import axios from "axios";
import DetailForAdmin from "./DetailForAdmin";
import { Paginator } from "primereact/paginator";
import { Grid, Card, CardMedia, CardContent, Button, Typography, Box, IconButton, FormControl, Select, MenuItem, InputLabel, TextField, Autocomplete,
   Tooltip, TableCell, TableRow, TableBody, TableHead, TableContainer, Paper, Table, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
  import { BlockOutlined, CheckCircle, Preview, Visibility } from "@mui/icons-material";
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
    rejectionComplaint: "",
  });
  const [dialogDetailSpace, setDialogDetailSpace] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rejectReason, setRejectReason] = useState(""); // Lưu lý do từ chối
  const [showRejectField, setShowRejectField] = useState(false);
  const uniqueOwners = Array.from(
    new Set([ "Tất cả", ...reportPosts.map((space) => space.userId?.fullname || "Không rõ")])
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

  const handleAccept = (postId) => {
    const selectedSpace = reportPosts.find((space) => space._id === postId);

    if (selectedSpace.censorship === "Chấp nhận") {
      return;
    }

    axios
      .put(`http://localhost:9999/spaces/update/${postId}`, {
        censorship: "Chấp nhận",
      })
      .then(() => {
        setReportPosts((prevSpaces) =>
          prevSpaces.map((space) =>
            space._id === postId ? { ...space, censorship: "Chấp nhận" } : space
          )
        );
      })
      .catch((error) => {
        console.error("Error updating censorship:", error);
      });
  };

  const handleReject = (reportId) => {
    axios
      .put(`http://localhost:9999/spaces/update-censorship/${reportId}`, {
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

  const handleApproveComplaint = (reportId) => {
    // Logic để hiển thị dialog cho báo cáo
    setDialogState({
      open: true,
      type: "approve",
      id: reportId,
    });
  };
  
  // Xử lý mở dialog cho khiếu nại
  const handleRejectComplaint = (reportId) => {
    // Logic để hiển thị dialog cho khiếu nại
    setDialogState({
      open: true,
      type: "reject",
      id: reportId,
      rejectionReason: "",
    });
  };
  const handleRejectButtonClick = () => {
    setShowRejectField(true);  // Hiển thị TextField khi nhấn nút
  };

  const handleAcceptComplaint = async () => {
    if (dialogState.type === "reject") {
      // Kiểm tra xem lý do từ chối có trống không
      if (!dialogState.rejectionReason.trim()) {
        toast.warning("Lý do từ chối không được để trống");
        return;
      }
      try {
        // Gửi yêu cầu từ chối đến API sử dụng axios
        const response = await axios.put(`http://localhost:9999/reports/reportsrejectcomplaint/${dialogState.id}`, {
          reportRejectionComplaint: dialogState.rejectionReason, // Gửi lý do từ chối
        });
        if (response.status === 200) {
          // Đóng dialog và reset trạng thái
          toast.success("Từ chối khiếu nại thành công"); // Hiển thị thông báo từ API
          setDialogState({ open: false, type: "", id: "", rejectionReason: "" });
        } else {
          toast.error(response.data.message); // Nếu có lỗi từ API
        }
      } catch (error) {
        console.error("Error rejecting complaint:", error);
        toast.error("Đã xảy ra lỗi khi từ chối khiếu nại");
      }
    } else if (dialogState.type === "approve") {
      try {
        const { id } = dialogState;
        // Gọi API để chấp nhận khiếu nại
        const response = await axios.put(`http://localhost:9999/reports/complaintaccept/${id}`);
        if (response.status === 200) {
          toast.success("Khiếu nại đã được chấp nhận!");
        }
        setDialogState({ open: false, type: "", id: "" });
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi xử lý yêu cầu!");
        setDialogState({ open: false, type: "", id: "" });
      }
    }
  };
  const handleShowDetail = async (spaceId) => {
    try {
      const response = await axios.get(`http://localhost:9999/spaces/${spaceId}`);
      setSelectedSpaceId(spaceId); // Lưu ID space
      setSelectedSpace(response.data); // Lưu thông tin chi tiết của space
      setDialogDetailSpace(true); // Hiển thị dialog
    } catch (error) {
      console.error("Error fetching space details:", error);
    }
  };
  const otherImages = selectedSpace?.images
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
                  <TableCell sx={{ fontWeight: 700,padding: 0 }}>STT</TableCell>
                    <TableCell sx={{ fontWeight: 700,padding: 0,textAlign:"center",width: '230px' }}>Tên không gian</TableCell>
                    <TableCell sx={{ fontWeight: 700,width: '155px',padding: 0,textAlign:"center" }}>Chủ không gian</TableCell>
                    <TableCell sx={{ fontWeight: 700,padding: 0,textAlign:"center",width: '155px' }}>Khách tố cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700,padding: 0,textAlign:"center",width: '380px' }}>Lý do báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700,padding: 0,textAlign:"center",width: '380px' }}>Khiếu nại báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700,width: '80px' ,padding: 0,textAlign:"center" }}>Lượt báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700,width: '110px' ,padding: 0,textAlign:"center" }}>Trạng thái báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700 ,padding: 0,textAlign:"center" }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productsOnPage?.length > 0 &&
                    productsOnPage.map((report, index) => (
                      <TableRow key={report._id} hover>
                        <TableCell sx={{textAlign:"center",padding:"16px 10px"}}>{index + 1}</TableCell>
                        <TableCell>{report.spaceId.name}</TableCell>
                        <TableCell>{report.spaceId?.userId?.fullname}</TableCell>
                        <TableCell>{report.userId?.fullname}</TableCell>
                        <TableCell>
                          {report.reasonId.map((reason) => reason.text.join(", ")).join("; ")}
                          {report.customReason && `; ${report.customReason}`}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                            {/* Dòng hiển thị kiến nghị */}
                            <Typography variant="body2" sx={{ flexGrow: 1 }}>
                              {report?.complaint} {/* Thay bằng dữ liệu kiến nghị */}
                            </Typography>
                            {/* Đường kẻ dọc */}
                            <Divider orientation="vertical" flexItem sx={{ backgroundColor: "black", mx: 1 }} />
                            {/* Dòng chứa các nút */}
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                              <Tooltip title="Chấp nhận KN">
                                <IconButton
                                  color="primary"
                                  onClick={() => handleApproveComplaint(report._id)}
                                  size="small"
                                  style={{ padding: 4 }}
                                  disabled={report.statusReport === "Từ chối"}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Từ chối KN">
                                <IconButton
                                  color="secondary"
                                  onClick={() => handleRejectComplaint(report._id)}
                                  size="small"
                                  style={{ padding: 4 }}
                                  disabled={report.statusReport === "Từ chối"}
                                >
                                  <BlockOutlined fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{textAlign:"center",padding:"16px 10px"}}>{report.spaceId.reportCount}</TableCell>
                        <TableCell sx={{ color: report.statusReport === 'Từ chối' ? 'error.main' : report.statusReport === 'Chấp nhận' ? 'success.main' : 'warning.main' }}>
                          {report.statusReport}
                        </TableCell>
                        <TableCell sx={{margin:"0 auto"}}>
                        <Tooltip title="Xem không gian">
                            <IconButton
                              color="secondary"
                              onClick={() => handleShowDetail(report.spaceId._id, report._id)}
                            >
                              <Visibility />
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
        lose={() => setDialogState({ open: false, type: "", id: "", rejectionReason: "" })}
      >
        <DialogTitle>
        {dialogState.type === "approve" ? "Chấp nhận khiếu nại" : "Từ chối khiếu nại"}
                </DialogTitle>
        <DialogContent>
          <Typography>
          Bạn có chắc chắn muốn {dialogState.type === "approve" ? "Chấp nhận khiếu nại " : "Từ chối khiếu nại "} này không?
          </Typography>
          {dialogState.type === "reject" && (
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Lý do từ chối"
              variant="outlined"
              value={dialogState.rejectionReason}
              onChange={(e) => setDialogState({ ...dialogState, rejectionReason: e.target.value })}
              style={{ marginTop: 16 }}
            />)}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAcceptComplaint}
            color="primary"
          >
            Đồng ý
          </Button>
          <Button
            onClick={() => setDialogState({ open: false, type: "", id: "", rejectionReason: "" })}
            color="secondary"
          >
            Hủy
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
          <Button variant="contained" color="success" onClick={() => handleAccept(selectedReport?._id)} 
          disabled={selectedReport?.statusReport === "Từ chối"||selectedReport?.statusReport === "Chấp nhận"}>
              Chấp nhận báo cáo
            </Button>
            <Button variant="contained" color="error" className="ms-2" onClick={handleRejectButtonClick} 
            disabled={selectedReport?.statusReport === "Từ chối"||selectedReport?.statusReport === "Chấp nhận"}>
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