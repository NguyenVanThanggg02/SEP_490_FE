import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { CheckCircle, Eye, HouseAddFill, Person, PersonLinesFill } from "react-bootstrap-icons";
import axios from "axios";
import CommunityStandards from "./CommunityStandards";
import DetailForAdmin from "./DetailForAdmin";
import { Paginator } from "primereact/paginator";
import { Grid, Card, CardMedia, CardContent, Button, Typography, Box, IconButton, FormControl, Select, MenuItem, InputLabel, TextField, Autocomplete, Tooltip, TableCell, TableRow, TableBody, TableHead, TableContainer, Paper, Table, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { dateFormatterDDMMYYY } from "../utils/dateFormatter";
import { BlockOutlined } from "@mui/icons-material";

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

  const handleReject = (postId, selectedReasons, customReason) => {
    axios
      .put(`http://localhost:9999/spaces/update-censorship/${postId}`, {
        censorship: "Từ chối",
        reasons: selectedReasons,
        customReason: customReason ? [customReason] : [],

      })
      .then(() => {
        setReportPosts((prevSpaces) =>
          prevSpaces.map((space) =>
            space._id === postId ? { ...space, censorship: "Từ chối" } : space
          )
        );
      })
      .catch((error) => {
        console.error("Error updating censorship:", error);
      });
  };

  const openRejectDialog = (postId) => {
    setCurrentPostId(postId);
    setVisible(true);
  };

  const handleViewDetail = (postId) => {
    setSelectedSpaceId(postId);
    setShowDetail(true);
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
    console.log("Duyệt khiếu nại ID:", reportId);
    setDialogState({
      open: true,
      type: "appeal",
      id: reportId,
    });
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
                    <TableCell sx={{ fontWeight: 700 }}>Chủ không gian</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Khách tố cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Lý do báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Số lượt báo cáo</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportPosts?.length > 0 &&
                    reportPosts.map((report, index) => (
                      <TableRow key={report._id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{report.spaceId.name}</TableCell>
                        <TableCell>{report.userId?.spaceId?.userId}</TableCell>
                        <TableCell>{report.userId.fullname}</TableCell>
                        <TableCell>
                          {report.reasonId.map((reason) => reason.text.join(", ")).join("; ")}
                          {report.customReason && `; ${report.customReason}`}
                        </TableCell>
                        <TableCell>{report.spaceId.reportCount}</TableCell>
                        <TableCell>
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
          {visible && (
            <CommunityStandards
              visible={visible}
              setVisible={setVisible}
              handleReject={handleReject}
              postId={currentPostId}
            />
          )}
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
    </Container>
    
  );
};

export default PostReportMana;