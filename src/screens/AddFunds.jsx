import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  DialogActions,
  Divider,
  IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useUser } from '../hooks/useUser';
import { formatMoney } from '../utils/moneyFormatter';
import { LoadingButton } from '@mui/lab';
import { Visibility, VisibilityOff, ArrowUpward, ArrowDownward } from '@mui/icons-material';

const AddFunds = () => {
  const [data, setData] = useState();
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('Nạp tiền');
  const [beneficiaryAccountNumber, setBeneficiaryAccountNumber] = useState('');
  const [beneficiaryBankCode, setBeneficiaryBankCode] = useState('MOMO');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalElement: undefined,
    totalPage: undefined,
    limit: 9,
  });
  const [isBalanceVisible, setIsBalanceVisible] = useState(false); 
  
  const fetchHistory = async () => {
    if (!user) return;
    try {
      const response = await axios.get('http://localhost:9999/transaction/list', {
        params: {
          userId: user.id,
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      setData(response.data);
      setPagination((prev) => ({
        ...prev,
        totalPage: response.data.pagination.totalPage,
        totalElement: response.data.pagination.totalElement,
      }));
    } catch (error) {
      console.error(error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
    }
  };

  useEffect(() => {
    if (user) fetchHistory();
  }, [user, pagination.page]);

  const handleCreateTransaction = async () => {
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);
    try {
      const payload =
        transactionType === 'Nạp tiền'
          ? { amount, userId: user.id, type: transactionType }
          : { amount, userId: user.id, type: transactionType, beneficiaryAccountNumber, beneficiaryBankCode };

      const response = await axios.post('http://localhost:9999/transaction/create', payload);
      if (transactionType === 'Nạp tiền' && response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        toast.success(response.data?.message);
        fetchHistory();
        setDialogOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data.message || 'Thao tác thất bại, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        gutterBottom
        color="primary"
        fontWeight="bold"
        align="center"
      >
        Lịch Sử Giao Dịch
      </Typography>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={3}
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => setDialogOpen(true)}
        >
          + Tạo Giao Dịch
        </Button>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h6">
            {data?.balanceAmount !== undefined && (
              <span style={{ color: "#1e88e5", fontWeight: "bold" }}>
                Số dư:{" "}
                {isBalanceVisible
                  ? formatMoney(data.balanceAmount)
                  : "********"}{" "}
                {/* Hiển thị hoặc ẩn số dư */}
              </span>
            )}
          </Typography>
          <IconButton
            onClick={() => setIsBalanceVisible(!isBalanceVisible)}
            color="primary"
          >
            {isBalanceVisible ? <Visibility /> : <VisibilityOff />}{" "}
            {/* Icon mắt */}
          </IconButton>
        </Box>
      </Box>
      <Grid container spacing={3}>
        {data?.transactionList &&
          data.transactionList.map((transaction) => (
            <Grid item xs={12} sm={6} md={4} key={transaction.transactionId}>
              <Card
                elevation={3}
                sx={{
                  borderLeft: `4px solid ${
                    transaction.status === "Thành công" ? "#4caf50" : "#f44336"
                  }`,
                  height:'145px'
                }}
              >
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  {transaction.type === "Nạp tiền" ||
                  transaction.type === "Cộng tiền" ? (
                    <ArrowDownward sx={{ color: "#4caf50" }} />
                  ) : (
                    <ArrowUpward sx={{ color: "#f44336" }} />
                  )}
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {transaction.type} -{" "}
                      <span style={{ color: "#ff9800" }}>
                        {formatMoney(transaction.amount)}
                      </span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ngày: {transaction.createdAt}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color={
                        transaction.status === "Thành công"
                          ? "#4caf50"
                          : "#f44336"
                      }
                    >
                      Trạng thái: {transaction.status}
                    </Typography>
                    {transaction.reasonRejected && (
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="#CC33FF"
                      >
                        Lý do: {transaction.reasonRejected}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
      {pagination.totalPage && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pagination.totalPage}
            page={pagination.page}
            onChange={(_, newPage) =>
              setPagination((prev) => ({ ...prev, page: newPage }))
            }
            color="primary"
          />
        </Box>
      )}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" align="center">
            Tạo Giao Dịch
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ padding: "16px" }}>
          <Select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            fullWidth
            margin="dense"
            sx={{ marginBottom: "16px" }}
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
            margin="dense"
            sx={{ marginBottom: "16px" }}
          />
          {transactionType === "Rút tiền" && (
            <>
              <TextField
                label="Số tài khoản ngân hàng"
                value={beneficiaryAccountNumber}
                onChange={(e) => setBeneficiaryAccountNumber(e.target.value)}
                fullWidth
                margin="dense"
                sx={{ marginBottom: "16px" }}
              />
              <Select
                value={beneficiaryBankCode}
                onChange={(e) => setBeneficiaryBankCode(e.target.value)}
                fullWidth
                margin="dense"
              >
                <MenuItem value="MOMO">Momo</MenuItem>
                <MenuItem value="Vietcombank">Vietcombank</MenuItem>
                <MenuItem value="BIDV">BIDV</MenuItem>
                <MenuItem value="Vietinbank">Vietinbank</MenuItem>
              </Select>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={() => setDialogOpen(false)}
            color="error"
            variant="outlined"
          >
            Hủy
          </Button>
          <LoadingButton
            onClick={handleCreateTransaction}
            loading={loading}
            color="primary"
            variant="contained"
          >
            Xác nhận
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddFunds;
