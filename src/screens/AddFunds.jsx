import React, { useState, useEffect } from 'react';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Paper, TextField, Dialog, DialogTitle, DialogContent, Select, MenuItem, DialogActions, Box, TablePagination, Pagination } from '@mui/material';
import axios from 'axios';
import { useUser } from '../hooks/useUser';
import { toast } from 'react-toastify';
import { formatMoney } from '../utils/moneyFormatter';
import { LoadingButton } from '@mui/lab';

const AddFunds = () => {
  const [data, setData] = useState();
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('Nạp tiền');
  const [beneficiaryAccountNumber, setBeneficiaryAccountNumber] = useState('');
  const [beneficiaryBankCode, setBeneficiaryBankCode] = useState('MOMO');
  const [loading, setLoading] = useState(false);
  const { user } = useUser()
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalElement: undefined,
    totalPage: undefined,
    limit: 10
  })

  async function fetchHistory() {
    if (!user) return
    try {
      const response = await axios.get('http://localhost:9999/transaction/list', {
        params: {
          userId: user.id,
          page: pagination.page,
          limit: pagination.limit
        }
      });
      setData(response.data);
      setPagination(prev => {
        return {
          ...prev,
          totalPage: response.data.pagination.totalPage,
          totalElement: response.data.pagination.totalElement
        }
      })
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.log(error)
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  // Fetch transfer history data
  useEffect(() => {
    if (!user) return;
    fetchHistory();
  }, [user]);

  // Handle Create Transaction and Redirect
  const handleCreateTransaction = async () => {
    if (!amount || Number(amount) <= 0) {
      return;
    }
    setLoading(true);
    if (transactionType === "Nạp tiền") {
      try {
        const response = await axios.post('http://localhost:9999/transaction/create', { amount, userId: user.id, type: transactionType });
        const { payUrl } = response.data;
        if (payUrl) {
          window.location.href = payUrl;
        } else {
          toast.error("Thao tác thất bại, vui lòng thử lại sau");
        }
      } catch (error) {
        toast.error(error?.response?.data.message || "Thao tác thất bại, vui lòng thử lại sau");
      } finally {
        setLoading(false);
      }
    }

    if (transactionType === "Rút tiền") {
      try {
        const response = await axios.post('http://localhost:9999/transaction/create', { amount, userId: user.id, type: transactionType, beneficiaryAccountNumber, beneficiaryBankCode });
        toast.success(response.data?.message)
        fetchHistory()
        setDialogOpen(false)
      } catch (error) {
        toast.error(error?.response?.data.message || "Thao tác thất bại, vui lòng thử lại sau");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // if (pagination.totalElement) {
    fetchHistory()
    // }
  }, [pagination.page])

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Danh sách giao dịch
      </Typography>

      <Box display="flex" alignItems="center" justifyContent={"space-between"} fullWidth>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
          style={{ marginBottom: '20px' }}
        >
          Khởi tạo giao dịch
        </Button>
        <Typography variant="h6" gutterBottom>
          {
            data?.balanceAmount !== undefined && <>{`Số dư ví khả dụng: ${formatMoney(data.balanceAmount)}`}</>
          }
        </Typography>

      </Box>

      <TableContainer component={Paper}>
        <Table stickyHeader >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Loại giao dịch</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Số tiền</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ngày giao dịch</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.transactionList && data.transactionList.length > 0 && data.transactionList.map((transaction, index) => (
              <TableRow key={transaction.transactionId} hover >
                <TableCell>{pagination.limit * (pagination.page - 1) + index + 1}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{formatMoney(transaction.amount)}</TableCell>
                <TableCell>{transaction.createdAt}</TableCell>
                <TableCell>{transaction.status}</TableCell>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Tạo giao dịch mới</DialogTitle>
        <DialogContent>
          <Select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            fullWidth
          >
            <MenuItem value="Nạp tiền">Nạp tiền</MenuItem>
            <MenuItem value="Rút tiền">Rút tiền</MenuItem>
          </Select>
          <TextField
            label="Số tiền"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          {
            transactionType === "Rút tiền" && <>
              <TextField
                label="Số tài khoản ngân hàng"
                type="text"
                value={beneficiaryAccountNumber}
                onChange={(e) => setBeneficiaryAccountNumber(e.target.value)}
                fullWidth
                margin="normal"
              />
              <Select
                value={beneficiaryBankCode}
                onChange={(e) => setBeneficiaryBankCode(e.target.value)}
                fullWidth
            >
                <MenuItem value="MOMO">Momo</MenuItem>
                <MenuItem value="Vietcombank">Vietcombank</MenuItem>
                <MenuItem value="BIDV">BIDV</MenuItem>
                <MenuItem value="Vietinbank">Vietinbank</MenuItem>
              </Select></>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary" variant='outlined'>
            Hủy
          </Button>
          <LoadingButton onClick={handleCreateTransaction} color="primary" loading={loading} variant='contained'>
            Xác nhận
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddFunds;
