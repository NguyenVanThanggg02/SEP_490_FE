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
  FormControl,
  InputLabel,
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
  const [bankAccounts, setBankAccounts] = useState([])
  const [selectedBankAccountId, setSelectedBankAccountId] = useState(undefined)
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
  const [showFeeWarning, setShowFeeWarning] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  
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

  async function fetchBankAccounts() {
    if (!user) return
    try {
      const response = await axios.get(`http://localhost:9999/users/${user.id}`);
      setBankAccounts(response.data.bankAccounts.map(bankAccount => { return { beneficiaryBankCode: bankAccount.bank.bankName, beneficiaryAccountNumber: bankAccount.accountNumber, id: bankAccount._id } }));
    } catch (error) {
      console.log(error)
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  useEffect(() => {
    if (user) fetchHistory();
  }, [user, pagination.page]);

  useEffect(() => {
    if (transactionType === 'Rút tiền') {
      fetchBankAccounts()
    }
  }, [transactionType])

  const handleCreateTransaction = async () => {
    if (!amount || Number(amount) <= 0) {
      return;
    }

    if (transactionType === "Rút tiền") {
      setShowFeeWarning(true); 
    } else {
      performTransaction(); 
    }
  };

  const performTransaction = async () => {
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
        const bankSelected = bankAccounts.filter(bankAccount => bankAccount.id === selectedBankAccountId);
        if (bankSelected.length === 0) {
          return;
        }
        const response = await axios.post('http://localhost:9999/transaction/create',
          { amount, userId: user.id, type: transactionType, beneficiaryAccountNumber: bankSelected[0].beneficiaryAccountNumber, beneficiaryBankCode: bankSelected[0].beneficiaryBankCode });
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
  const filteredTransactions = data?.transactionList?.filter((transaction) => {
    const matchesStatus =
      !filterStatus || transaction.status === filterStatus;
    const matchesType =
      !filterType || transaction.type === filterType;
    return matchesStatus && matchesType;
  });
  
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
          sx={{ height: "55px" }}
        >
          + Tạo Giao Dịch
        </Button>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={3}
        >
          <Box display="flex" gap={2} sx={{marginTop:'25px'}}>
            <FormControl fullWidth sx={{ width: "400px" }}>
              <InputLabel id="filter-status-label">
                Lọc theo trạng thái
              </InputLabel>
              <Select
                labelId="filter-status-label"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                fullWidth
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Thành công">Thành công</MenuItem>
                <MenuItem value="Thất bại">Thất bại</MenuItem>
                <MenuItem value="Khởi tạo">Khởi tạo</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="filter-type-label">
                Lọc theo loại giao dịch
              </InputLabel>
              <Select
                labelId="filter-type-label"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                fullWidth
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Nạp tiền">Nạp tiền</MenuItem>
                <MenuItem value="Rút tiền">Rút tiền</MenuItem>
                <MenuItem value="Hoàn tiền">Hoàn tiền</MenuItem>
                <MenuItem value="Cộng tiền">Cộng tiền</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

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
  {filteredTransactions?.map((transaction) => (
    <Grid item xs={12} sm={6} md={4} key={transaction.transactionId}>
      <Card
        elevation={3}
        sx={{
          borderLeft: `4px solid ${
            transaction.status === "Thành công" ? "#4caf50" : "#f44336"
          }`,
          height: "145px",
        }}
      >
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {transaction.type === "Nạp tiền" || transaction.type === "Cộng tiền" ? (
            <ArrowDownward sx={{ color: "#4caf50" }} />
          ) : (
            <ArrowUpward sx={{ color: "#f44336" }} />
          )}
          <Box>
            <Typography variant="h6" gutterBottom>
              {transaction.type}{" "}
              <span style={{ margin: "0 5px" }}>
                  {transaction.type === "Cộng tiền" || transaction.type === 'Hoàn tiền' ? "+" : "-"}
              </span>
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
        open={showFeeWarning}
        onClose={() => setShowFeeWarning(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold" align="center">
            Lưu ý phí giao dịch
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="textSecondary" align="center">
            Sau khi trừ phí giao dịch (5%), bạn sẽ nhận lại 95% là:{" "}
            <span style={{ color: "#1e88e5", fontWeight: "bold" }}>
              {formatMoney(amount * 0.95)}
            </span>
            số tiền yêu cầu rút. Bạn có chắc chắn muốn tiếp tục không?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFeeWarning(false)} color="error">
            Hủy
          </Button>
          <Button
            onClick={() => {
              setShowFeeWarning(false);
              performTransaction();
            }}
            color="primary"
            variant="contained"
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for creating transaction */}
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
          {transactionType === "Rút tiền" && bankAccounts.length > 0 && (
            <>
            <TextField
                label="Thực nhận (chiết khấu 5%)"
                type="number"
                InputProps={{
                  readOnly: true,
                }}
                value={Math.floor(amount ? amount * 95 / 100 : 0)}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="select-label">Chọn tài khoản</InputLabel>
                <Select
                  value={selectedBankAccountId}
                  onChange={(e) => setSelectedBankAccountId(e.target.value)}
                  fullWidth
                  label="Chọn tài khoản"
                >
                  {bankAccounts.map((bankAccount) => (
                    <MenuItem
                      value={bankAccount.id}
                      key={bankAccount.id}
                    >{`${bankAccount.beneficiaryBankCode} - ${bankAccount.beneficiaryAccountNumber}`}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          {transactionType === "Rút tiền" && bankAccounts.length <= 0 && (
            <Typography sx={{ color: "red" }}>
              Hãy thêm thông tin tài khoản ngân hàng trước
            </Typography>
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
          {transactionType === "Rút tiền" && bankAccounts.length <= 0 ? (
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                window.location.href = "/profile";
              }}
            >
              Thêm ngay
            </Button>
          ) : (
            <LoadingButton
              onClick={handleCreateTransaction}
              loading={loading}
              color="primary"
              variant="contained"
              disabled={
                !amount ||
                Number(amount) <= 0 ||
                (transactionType === "Rút tiền" && !selectedBankAccountId)
              }
            >
              Xác nhận
            </LoadingButton>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddFunds;