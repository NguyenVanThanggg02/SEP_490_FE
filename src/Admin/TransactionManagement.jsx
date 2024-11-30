import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  Search as SearchIcon,
  BlockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { Paginator } from "primereact/paginator";
import { Row } from "react-bootstrap";
import { formatMoney } from "../utils/moneyFormatter"; // Giả sử bạn có hàm này để định dạng tiền

export const TransactionManagement = () => {
  const [searchParams, setSearchParams] = useState("");
  const [reasonRejected, setReasonRejected] = useState("");
  const [data, setData] = useState();
  const [system, setsystem] = useState([]);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [rows, setRows] = useState(9);
  const [first, setFirst] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedType, setSelectedType] = useState(""); // Thêm biến trạng thái cho loại giao dịch

  const productsOnPage = data?.transactionList?.slice(first, first + rows);
  const [, setCurrentPage] = useState(1);

  const onPageChange = (event) => {
    setFirst(event?.first);
    setCurrentPage(event.page + 1);
    setRows(event?.rows);
  };

  const fetchHistory = async () => {
    try {
      const params = {};
      if (searchParams) params.searchParams = searchParams;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedType) params.type = selectedType;

      const response = await axios.get(
        "http://localhost:9999/transaction/admin/list",
        { params }
      );

      const filteredData = response.data.transactionList.filter(
        (transaction) => {
          const transactionDate = new Date(transaction.createdAt);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          if (start && transactionDate < start) return false;
          if (end && transactionDate > end) return false;
          return true;
        }
      );

      setData({ ...response.data, transactionList: filteredData });
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  };
  const formatTransactionDate = (date) => {
    const formattedDate = new Date(date);
    return `${formattedDate.getDate()}/${formattedDate.getMonth() + 1}/${formattedDate.getFullYear()}`;
  };

  useEffect(() => {
    fetchHistory();
  }, [searchParams, startDate, endDate, selectedStatus, selectedType]); // Gọi lại hàm khi có thay đổi

  useEffect(() => {
    fetchSystem();
  }, []);

  const fetchSystem = () => {
    axios
      .get(`http://localhost:9999/system`)
      .then((response) => {
        console.log(response.data);

        const systemData = response.data.find(
          (item) => item.code === "system_account_balance"
        );
        if (systemData) {
          setsystem(systemData.value);
          console.log(systemData.value);
        } else {
          console.log("Không tìm thấy thông tin số dư");
        }
      })
      .catch((error) => {
        console.error("Có lỗi xảy ra:", error);
      });
  };

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const handleOpenDialog = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };
  const handleOpenDialog2 = (transaction) => {
    setSelectedTransaction(transaction);
    setOpen2(true);
  };
  const handleCloseDialog2 = () => {
    setOpen2(false);
  };
  const [withdrawTransaction, setWithDrawTransaction] = useState();
  async function initWithdrawTransaction(transactionId) {
    try {
      setWithDrawTransaction(undefined);
      const response = await axios.post(
        "http://localhost:9999/transaction/admin/confirm",
        {
          transactionId,
          result: "Đồng ý - Khởi tạo",
        }
      );
      setWithDrawTransaction(response.data);
      handleOpenDialog();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau"
      );
    }
  }
  const handleClickApproveButton = async (transactionId) => {
    await initWithdrawTransaction(transactionId);
  };
  async function approveTransaction() {
    try {
      const response = await axios.post(
        "http://localhost:9999/transaction/admin/confirm",
        {
          transactionId: withdrawTransaction.transactionId,
          result: "Đồng ý - Xác nhận",
        }
      );
      toast.success(response.data.message);
      handleCloseDialog();
      setWithDrawTransaction(null);
      fetchHistory();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau"
      );
    }
  }
  async function rejectTransaction() {
    try {
      const response = await axios.post(
        "http://localhost:9999/transaction/admin/confirm",
        {
          transactionId: selectedTransaction.transactionId,
          result: "Từ chối - Xác nhận",
          reasonRejected: reasonRejected,
        }
      );
      toast.success(response.data.message);
      handleCloseDialog2();
      fetchHistory();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau"
      );
    }
  }

  return (
    <Box
      sx={{
        mt: 4,
      }}
    >
      <Box
        sx={{
          mt: 4,
          p: 4,
          backgroundColor: "#f3f4f6",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 3,
            color: "#333",
            textAlign: "center",
          }}
        >
          Quản lý giao dịch
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">
            {system !== undefined && (
              <span style={{ color: "#1e88e5", fontWeight: "bold" }}>
                Số dư: {isBalanceVisible ? formatMoney(system) : "********"}{" "}
              </span>
            )}
          </Typography>
          <IconButton
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            color="primary"
          >
            {isBalanceVisible ? <Visibility /> : <VisibilityOff />}{" "}
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            p: 2,
            backgroundColor: "#ffffff",
            borderRadius: 1,
            border: "1px solid #e0e0e0",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <InputBase
            placeholder="Tìm kiếm giao dịch...."
            value={searchParams}
            onChange={(event) => setSearchParams(event.target.value)}
            sx={{
              flex: 1,
              fontSize: "1rem",
              padding: "3px 0",
              pl: 2,
            }}
          />
          <IconButton
            onClick={fetchHistory}
            sx={{
              color: "#1565c0",
              "&:hover": { backgroundColor: "rgba(21, 101, 192, 0.1)" },
            }}
          >
            <SearchIcon />
          </IconButton>
          {searchParams && (
            <Button
              onClick={() => setSearchParams("")}
              variant="outlined"
              color="secondary"
              size="small"
            >
              Xóa tìm kiếm
            </Button>
          )}
        </Box>
        <Grid item xs={12} sm={12} md={12} sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Bộ lọc trạng thái */}
            <FormControl sx={{ width: "30.5%" }}>
              <InputLabel id="status-filter-label">
                Lọc theo trạng thái
              </InputLabel>
              <Select
                labelId="status-filter-label"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                label="Lọc theo trạng thái"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Khởi tạo">Khởi tạo </MenuItem>
                <MenuItem value="Thành công">Thành công</MenuItem>
                <MenuItem value="Thất bại">Thất bại</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "30.5%" }}>
              <InputLabel id="type-filter-label">
                Lọc theo loại giao dịch
              </InputLabel>
              <Select
                labelId="type-filter-label"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Lọc theo loại giao dịch"
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Nạp tiền">Nạp tiền</MenuItem>
                <MenuItem value="Trừ tiền">Trừ tiền</MenuItem>
                <MenuItem value="Cộng tiền">Cộng tiền</MenuItem>
                <MenuItem value="Hoàn tiền">Hoàn tiền</MenuItem>
                <MenuItem value="Rút tiền">Rút tiền</MenuItem>
              </Select>
            </FormControl>
            {/* Bộ lọc ngày */}
            <Box sx={{ display: "flex", gap: 4, flexGrow: 1 }}>
              <TextField
                label="Từ ngày"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDate || ""}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{ width: "46%" }}
              />
              <TextField
                label="Đến ngày"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate || ""}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ width: "46%" }}
              />
            </Box>
          </Box>
        </Grid>
        {productsOnPage?.length > 0 ? (
          <Grid container spacing={3}>
            {productsOnPage.map((transaction) => (
              <Grid item xs={12} sm={6} md={4} key={transaction.transactionId}>
                <Box
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: 2,
                    p: 3,
                    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #e0e0e0",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.15)",
                    },
                    height: "325px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar
                      alt="avatar"
                      src={transaction.userInfoAvatar || "/default-avatar.png"}
                      sx={{ width: 56, height: 56, ml: -1.5 }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        color: "#2c387e",
                        ml: -1.2,
                      }}
                    >
                      {`${transaction.userInfo}`}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#616161", mb: 0.5 }}
                  >
                    Mã giao dịch: <strong>{transaction.orderId}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Loại giao dịch:{" "}
                    <Chip
                      label={transaction.type}
                      sx={{
                        fontWeight: "bold",
                        color: "#ffffff",
                        backgroundColor:
                          transaction.type === "Rút tiền"
                            ? "#f57c00"
                            : transaction.type === "Trừ tiền"
                              ? "#d32f2f"
                              : transaction.type === "Hoàn tiền"
                                ? "#1976d2"
                                : "#2e7d32",
                      }}
                      size="small"
                    />
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "bold",
                      color: "#1565c0",
                      mb: 1,
                    }}
                  >
                    Số tiền: {formatMoney(transaction.amount)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575", mb: 1 }}>
                    Ngày giao dịch: {transaction.createdAt}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        transaction.status === "Khởi tạo"
                          ? "#f57c00"
                          : transaction.status === "Thành công"
                            ? "#2e7d32"
                            : "#d32f2f",
                      fontWeight: "bold",
                    }}
                  >
                    Trạng thái: {transaction.status}
                  </Typography>
                  {transaction.status === "Khởi tạo" &&
                    transaction.type === "Rút tiền" && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                        }}
                      >
                        <Tooltip title="Đồng ý giao dịch">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleClickApproveButton(
                                transaction.transactionId
                              )
                            }
                            sx={{ mr: 1 }}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Từ chối giao dịch">
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDialog2(transaction)}
                          >
                            <BlockOutlined />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 5,
              color: "#9e9e9e",
              fontSize: "1.2rem",
            }}
          >
            Không có dữ liệu giao dịch.
          </Box>
        )}
      </Box>
      <Dialog open={open} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Chuyển khoản giao dịch rút tiền</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: "100%",
                  mt: "-50px",
                }}
              >
                <TextField
                  label="Ngân hàng"
                  fullWidth
                  margin="dense"
                  value={withdrawTransaction?.beneficiaryBankCode || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Số tài khoản"
                  fullWidth
                  margin="dense"
                  value={withdrawTransaction?.beneficiaryAccountNumber || ""}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Số tiền (sau khi trừ phí 5%)"
                  fullWidth
                  margin="dense"
                  value={
                    withdrawTransaction?.amount
                      ? formatMoney(withdrawTransaction.amount)
                      : ""
                  }
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={
                    withdrawTransaction?.qrUrl
                      ? withdrawTransaction.qrUrl
                      : "/logo.png"
                  }
                  alt="QR Code"
                  width="500"
                  height="500"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="outlined"
          >
            Chưa thanh toán
          </Button>
          <Button
            onClick={() => {
              approveTransaction();
            }}
            color="primary"
            variant="contained"
          >
            Xác nhận đã thanh toán
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open2} onClose={handleCloseDialog2} fullWidth>
        <DialogContent sx={{ justifyContent: "center" }}>
          <Typography>Nhập lý do từ chối:</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do từ chối"
            type="text"
            fullWidth
            variant="outlined"
            value={reasonRejected}
            onChange={(e) => setReasonRejected(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleCloseDialog2}
            color="primary"
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={rejectTransaction}
            color="secondary"
            variant="contained"
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paginator
          style={{ backgroundColor: "white" }}
          first={first}
          rows={rows}
          totalRecords={data?.transactionList?.length}
          onPageChange={onPageChange}
        />
      </Row>
    </Box>
  );
};
