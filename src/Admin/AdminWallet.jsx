import {
  CheckCircle,
  Search as SearchIcon,
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
import { Constants } from '../utils/constants';
import RedeemIcon from '@mui/icons-material/Redeem';
import { useUser } from '../hooks/useUser';

export const AdminWallet = () => {
  const typeOfTransactions = [
    'Tất cả',
    'Tăng số dư ví admin',
    'Giảm số dư ví admin',
  ];
  const [timeFilter, setTimeFilter] = useState({
    startTime: dayjs().subtract(15, 'day'),
    endTime: dayjs(),
  });
  const [typeOfTransaction, setTypeOfTransaction] = useState(
    typeOfTransactions[0]
  );
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
  const { user } = useUser();

  async function fetchHistory() {
    try {
      const response = await axios.get(
        'http://localhost:9999/transaction/admin/wallet',
        {
          params: {
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
  }, [pagination.page, timeFilter.startTime, timeFilter.endTime, typeOfTransaction]);

  const [open, setOpen] = useState(false);
  const handleOpenDialog = () => {
    setWithdrawAmount(0)
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const [withdrawAmount, setWithdrawAmount] = useState(0);

  async function approveTransaction() {
    try {
      const response = await axios.post(
        `${Constants.apiHost}/transaction/admin/wallet-withdraw`,
        {
          userId: user.id,
          amount: withdrawAmount,
        }
      );
      toast.success(response.data.message);
      handleCloseDialog();
      fetchHistory();
    } catch (error) {
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
        <Typography variant="h4">Quản lý ví admin</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: "space-between", alignItems: "center", mt: 2 }}>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>

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
                sx={{
                  mr: 2, mb: 2,
                  '& .MuiInputBase-root': {
                    fontSize: '0.875rem',
                    height: '35px',
                  },
                  '& .MuiOutlinedInput-root': {
                    padding: '0 8px 0 0',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputBase-input': {
                    width: "120px"
                  },
                  '& .MuiInputAdornment-root': {
                    marginLeft: "0px"
                  }
                }}
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
                sx={{
                  mr: 2, mb: 2,
                  '& .MuiInputBase-root': {
                    fontSize: '0.875rem',
                    height: '35px',
                  },
                  '& .MuiOutlinedInput-root': {
                    padding: '0 8px 0 0',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputBase-input': {
                    width: "120px"
                  },
                  '& .MuiInputAdornment-root': {
                    marginLeft: "0px"
                  }
                }}
              />
              <FormControl sx={{ mr: 2, mb: 2 }}>
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
                  sx={{
                    '&.MuiInputBase-root': {
                      fontSize: '0.875rem',
                      height: '35px',
                      width: '200px'
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.875rem',
                    },
                  }}
                >
                  {typeOfTransactions.map((typeOfTransaction, i) => (
                    <MenuItem key={i} value={typeOfTransaction}>
                      {typeOfTransaction}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </LocalizationProvider>
          <Stack
            direction={'row'}
            spacing={2}
            alignItems={'center'}
            justifyContent={'space-between'}>
            <Typography
              variant="h5"
            >
              <Typography component='span' style={{ color: 'black' }}>Số dư ví: </Typography>
              <Typography component='span' style={{ color: 'green', fontWeight: 700 }}>{data ? formatMoney(data.availableAmount) : "..."}</Typography>
            </Typography>

            <Tooltip title="Nhận tiền" arrow>
              <IconButton color="secondary" onClick={handleOpenDialog}>
                <RedeemIcon />
              </IconButton>
            </Tooltip>
          </Stack>

        </Box>

        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mã giao dịch</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Loại giao dịch</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số tiền</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày giao dịch</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nội dung giao dịch</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.transactionList &&
                data.transactionList.length > 0 &&
                data.transactionList.map((transaction, index) => (
                  <TableRow key={transaction.transactionId} hover>
                    <TableCell>{pagination.limit * (pagination.page - 1) + index + 1}</TableCell>
                    <TableCell>{transaction.orderId}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell>{formatMoney(transaction.amount)}</TableCell>
                    <TableCell>{transaction.createdAt}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {
          pagination.totalPage &&
          <Container sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
            <Pagination
              count={pagination.totalPage} // Total number of pages
              page={pagination.page} // Current page
              onChange={(_, newPage) => { setPagination(prev => { return { ...prev, page: newPage } }) }}
              color="primary"
              sx={{ justifyContent: "center" }}
            />
          </Container>
        }
      </Box>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Nhận tiền từ ví</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <TextField
              label="Số tiền"
              fullWidth
              margin="dense"
              type='number'
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="outlined"
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              approveTransaction();
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
