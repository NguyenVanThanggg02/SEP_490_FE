import {
  BlockOutlined,
  CheckCircle,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
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

export const TransactionManagement = () => {
  const typeOfTransactions = [
    'Tất cả',
    'Nạp tiền',
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

  async function fetchHistory() {
    try {
      const response = await axios.get(
        'http://localhost:9999/transaction/admin/list',
        {
          params: {
            searchParams,
            ...timeFilter,
            typeOfTransaction,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  }
  useEffect(() => {
    fetchHistory();
  }, []);

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
        'http://localhost:9999/transaction/admin/confirm',
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
        'http://localhost:9999/transaction/admin/confirm',
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
        'http://localhost:9999/transaction/admin/confirm',
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

  return (
    <Box>
      <Box
        sx={{
          mt: '24px',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '100%',
          overflowY: 'auto',
        }}
      >
        <Stack
          spacing={2}
          direction={'row'}
          alignItems={'center'}
          sx={{
            mb: 2,
          }}
        >
          <Stack
            direction={'row'}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              borderRadius: 1,
              width: '300px',
            }}
          >
            <InputBase
              placeholder="Nhập để tìm kiếm..."
              value={searchParams}
              onChange={handleSearchChange}
              sx={{ marginLeft: 1, flex: 1, height:'55px' }}
            />
          </Stack>
          <Stack
            direction={'row'}
            spacing={2}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Từ ngày"
                maxDate={timeFilter.endTime}
                views={['year', 'month', 'day']}
                value={timeFilter.startTime}
                onChange={(newValue) => {
                  if (newValue.isValid()) {
                    setTimeFilter((prev) => ({ ...prev, startTime: newValue }));
                  }
                }}
                disableFuture
                format="DD/MM/YYYY"
              />
              <DatePicker
                label="Tới ngày"
                minDate={timeFilter.startTime}
                views={['year', 'month', 'day']}
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
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel id="type-of-transact-select-label">
                Loại giao dịch
              </InputLabel>
              <Select
                labelId="type-of-transact-select-label"
                id="type-of-transact-select"
                name="transactId"
                value={typeOfTransaction}
                label="Loại giao dịch"
                onChange={onTypeOfTransactionChange}
              >
                {typeOfTransactions.map((typeOfTransaction, i) => (
                  <MenuItem key={i} value={typeOfTransaction}>
                    {typeOfTransaction}
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
              sx={{height:"55px"}}
            >
              <SearchIcon />Tìm kiếm
            </Button>
          {/* </IconButton> */}
        </Stack>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
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
                data.transactionList.map((transaction, index) => (
                  <TableRow key={transaction.transactionId} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ whiteSpace: 'pre-wrap' }}>
                      {transaction.userInfo}
                    </TableCell>
                    <TableCell>{transaction.orderId}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{formatMoney(transaction.amount)}</TableCell>
                    <TableCell>{transaction.createdAt}</TableCell>
                    <TableCell>{transaction.status}</TableCell>
                    <TableCell>
                      {' '}
                      {transaction.status === 'Khởi tạo' &&
                        transaction.type === 'Rút tiền' && (
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
                            <Tooltip title="Từ chối giao dịch">
                              <IconButton
                                color="secondary"
                                onClick={() => {
                                  handleOpenDialog2(transaction);
                                }}
                              >
                                <BlockOutlined />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Chuyển khoản giao dịch rút tiền</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '100%',
                  mt: '-50px',
                }}
              >
                <TextField
                  label="Ngân hàng"
                  fullWidth
                  margin="dense"
                  value={withdrawTransaction?.beneficiaryBankCode || ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Số tài khoản"
                  fullWidth
                  margin="dense"
                  value={withdrawTransaction?.beneficiaryAccountNumber || ''}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  label="Số tiền"
                  fullWidth
                  margin="dense"
                  value={formatNumberToVND(withdrawTransaction?.amount || '')}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src={
                    withdrawTransaction?.qrUrl
                      ? withdrawTransaction.qrUrl
                      : '/logo.png'
                  }
                  alt="QR Code"
                  width="500"
                  height="500"
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
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
        <DialogContent sx={{ justifyContent: 'center' }}>
          <Typography>Xác nhận từ chối giao dịch</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
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
