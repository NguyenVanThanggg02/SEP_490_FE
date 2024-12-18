import {
  BlockOutlined,
  CheckCircle,
  Search as SearchIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
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
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { formatMoney } from '../utils/moneyFormatter';
import { formatNumberToVND } from '../utils/numberFormatter';
import { Constants } from '../utils/constants';

export const TransactionManagement = () => {
  const typeOfTransactions = [
    'Tất cả',
    // 'Nạp tiền',
    'Trừ tiền',
    'Cộng tiền',
    'Hoàn tiền',
    'Rút tiền',
  ];
  const [searchParams, setSearchParams] = useState('');
  const [timeFilter, setTimeFilter] = useState({
    startTime: dayjs().subtract(15, 'day'),
    endTime: dayjs(),
  });
  const [typeOfTransaction, setTypeOfTransaction] = useState(
    typeOfTransactions[0]
  );
  const handleSearchChange = (event) => {
    setSearchParams(event.target.value);
  };
  const onTypeOfTransactionChange = (event) => {
    setTypeOfTransaction(event.target.value);
  };
  const [data, setData] = useState();
  const [pagination, setPagination] = useState({
    page: 1,
    totalElement: undefined,
    totalPage: undefined,
    limit: 10
  })
  async function fetchHistory() {
    try {
      const response = await axios.get(
        `${Constants.apiHost}/transaction/admin/list`,
        {
          params: {
            searchParams,
            ...timeFilter,
            typeOfTransaction,
            page: pagination.page,
            limit: pagination.limit
          },
        }
      );
      setData(response.data);
      setPagination(prev => {
        return {
          ...prev,
          totalPage: response.data.pagination.totalPage,
          totalElement: response.data.pagination.totalElement
        }
      })
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  }
  useEffect(() => {
    fetchHistory();
  }, [pagination.page]);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [system, setsystem] = useState([]);
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
        `${Constants.apiHost}/transaction/admin/confirm`,
        {
          transactionId,
          result: 'Đồng ý - Khởi tạo',
        }
      );
      setWithDrawTransaction(response.data);
      handleOpenDialog();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau'
      );
    }
  }
  const handleClickApproveButton = async (transactionId) => {
    await initWithdrawTransaction(transactionId);
  };
  async function approveTransaction() {
    try {
      const response = await axios.post(
        `${Constants.apiHost}/transaction/admin/confirm`,
        {
          transactionId: withdrawTransaction.transactionId,
          result: 'Đồng ý - Xác nhận',
        }
      );
      toast.success(response.data.message);
      handleCloseDialog();
      setWithDrawTransaction(null);
      fetchHistory();
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau'
      );
    }
  }
  async function rejectTransaction() {
    try {
      const response = await axios.post(
        `${Constants.apiHost}/transaction/admin/confirm`,
        {
          transactionId: selectedTransaction.transactionId,
          result: 'Từ chối - Xác nhận',
        }
      );
      toast.success(response.data.message);
      handleCloseDialog2();
      fetchHistory();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau'
      );
    }
  }

  useEffect(() => {
    fetchSystem();
  }, []);

  const fetchSystem = () => {
    axios
      .get(`${Constants.apiHost}/system`)
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

  return (
    <Box>
      <Box
        sx={{
          mt: "24px",
          p: 2,
          display: "flex",
          flexDirection: "column",
          maxHeight: "100%",
          overflowY: "auto",
        }}
      >
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
        <Stack
          spacing={2}
          direction={"row"}
          alignItems={"center"}
          sx={{
            mb: 2,
          }}
        >
          <Stack
            direction={"row"}
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.1)",
              borderRadius: 1,
              width: "50%",
            }}
          >
            <InputBase
              placeholder="Nhập để tìm kiếm..."
              value={searchParams}
              onChange={handleSearchChange}
              sx={{ marginLeft: 1, flex: 1, height: "55px" }}
            />
          </Stack>
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Từ ngày"
                maxDate={timeFilter.endTime}
                views={["year", "month", "day"]}
                value={timeFilter.startTime}
                onChange={(newValue) => {
                  if (newValue.isValid()) {
                    setTimeFilter((prev) => ({ ...prev, startTime: newValue }));
                  }
                }}
                disableFuture
                format="DD/MM/YYYY"
                sx={{ width: "100%" }}
              />
              <DatePicker
                label="Tới ngày"
                minDate={timeFilter.startTime}
                views={["year", "month", "day"]}
                value={timeFilter.endTime}
                onChange={(newValue) => {
                  if (newValue.isValid()) {
                    setTimeFilter((prev) => ({
                      ...prev,
                      endTime: newValue,
                    }));
                  }
                }}
                disableFuture
                format="DD/MM/YYYY"
                sx={{ width: "100%" }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel id="type-of-transact-select-label">
                Giao dịch
              </InputLabel>
              <Select
                labelId="type-of-transact-select-label"
                id="type-of-transact-select"
                name="transactId"
                value={typeOfTransaction}
                label="Giao dịch"
                onChange={onTypeOfTransactionChange}
              >
                {typeOfTransactions.map((transaction, i) => (
                  <MenuItem key={i} value={transaction}>
                    {transaction === 'Cộng tiền' ? 'Trừ tiền' :
                    transaction === 'Trừ tiền' ? 'Cộng tiền' :
                    transaction}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          {/* <IconButton sx={{ padding: 0 }} onClick={fetchHistory}>
            <SearchIcon /> */}
          <Button
            variant="outlined"
            color="secondary"
            onClick={fetchHistory}
            sx={{ height: "55px" }}
          >
            <SearchIcon />
            Tìm kiếm
          </Button>
          {/* </IconButton> */}
        </Stack>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tiêu đề</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mã giao dịch</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Loại giao dịch</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số tiền</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày giao dịch</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.transactionList &&
                data.transactionList.length > 0 &&
                data.transactionList
                  .filter(
                    (transaction) =>
                      transaction.type.trim().toUpperCase() !== "NẠP TIỀN"
                  )
                  .map((transaction, index) => (
                    <TableRow key={transaction.transactionId} hover>
                      <TableCell>
                        {pagination.limit * (pagination.page - 1) + index + 1}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "pre-wrap" }}>
                        {transaction.type.trim().toUpperCase() === "CỘNG TIỀN"
                          ? "TRẢ TIỀN CHO CHỦ"
                          : transaction.type.trim().toUpperCase() === "TRỪ TIỀN"
                            ? "CÓ BOOKING"
                            : transaction.type.trim().toUpperCase() ===
                                "HOÀN TIỀN"
                              ? "TRẢ TIỀN CHO GIAO DỊCH HỦY"
                              : transaction.type.trim().toUpperCase() ===
                                  "RÚT TIỀN"
                                ? "GIAO DỊCH RÚT TIỀN"
                                : transaction.userInfo}
                      </TableCell>
                      <TableCell>{transaction.orderId}</TableCell>
                      <TableCell>
                        {transaction.type.trim().toUpperCase() === "CỘNG TIỀN"
                          ? "TRỪ TIỀN HỆ THỐNG"
                          : transaction.type.trim().toUpperCase() === "TRỪ TIỀN"
                            ? "CỘNG TIỀN VÀO HỆ THỐNG"
                            : transaction.type.trim().toUpperCase() ===
                                "HOÀN TIỀN"
                              ? "TRỪ TIỀN HỆ THỐNG"
                              : transaction.type.trim().toUpperCase() ===
                                  "RÚT TIỀN"
                                ? "TRỪ TIỀN HỆ THỐNG"
                                : transaction.type}
                      </TableCell>
                      <TableCell>{formatMoney(transaction.amount)}</TableCell>
                      <TableCell>{transaction.createdAt}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                      <TableCell>
                        {transaction.status === "Khởi tạo" &&
                          transaction.type === "Rút tiền" && (
                            <Box>
                              <Tooltip title="Đồng ý giao dịch">
                                <IconButton
                                  color="primary"
                                  onClick={() => {
                                    handleClickApproveButton(
                                      transaction.transactionId
                                    );
                                  }}
                                >
                                  <CheckCircle />
                                </IconButton>
                              </Tooltip>
                              {/* <Tooltip title="Từ chối giao dịch">
                                <IconButton
                                  color="secondary"
                                  onClick={() => {
                                    handleOpenDialog2(transaction);
                                  }}
                                >
                                  <BlockOutlined />
                                </IconButton>
                              </Tooltip> */}
                            </Box>
                          )}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        {pagination.totalPage && (
          <Container
            sx={{ display: "flex", justifyContent: "center", mt: 1.5 }}
          >
            <Pagination
              count={pagination.totalPage} // Total number of pages
              page={pagination.page} // Current page
              onChange={(_, newPage) => {
                setPagination((prev) => {
                  return { ...prev, page: newPage };
                });
              }}
              color="primary"
              sx={{ justifyContent: "center" }}
            />
          </Container>
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
                  label="Số tiền"
                  fullWidth
                  margin="dense"
                  value={formatNumberToVND(withdrawTransaction?.amount || "")}
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

      <Dialog open={open2} onClose={handleCloseDialog2} maxWidth="md">
        <DialogContent sx={{ justifyContent: "center" }}>
          <Typography>Xác nhận từ chối giao dịch</Typography>
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
            onClick={() => {
              rejectTransaction();
            }}
            color="primary"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
