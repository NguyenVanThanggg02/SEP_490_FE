import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TransactionBarChart from './Dashboard/TransactionBarChart';
import StatCard from './Dashboard/StatCard';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatMoney } from '../utils/moneyFormatter';
import { ChartApproveStatus } from './Dashboard/ChartApproveStatus';
import { BookingTypeChart } from './Dashboard/BookingTypeChart';

const HomeAdmin = () => {

  const [userData, setUserData] = useState()
  const [spaceData, setSpaceData] = useState()
  const [transactionData, setTransactionData] = useState()
  const [spaceCensorship, setSpaceCensorship] = useState()
  const [bookingRentalType, setBookingRentalType] = useState()

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:9999/dashboard');
      setUserData(response.data.user)
      setSpaceData(response.data.space)
      setTransactionData({
        ...response.data.transaction,
        content: `${formatMoney(response.data.transaction.revenue6Months)} - ${formatMoney(response.data.transaction.revenue)}`,
        subContent: `Doanh thu 6 tháng - Tổng doanh thu`
      })
      setSpaceCensorship(response.data.spaceCensorship)
      setBookingRentalType(response.data.bookingRentalType)
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Tổng quan
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {
          userData && <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...userData} />
          </Grid>
        }
        {
          spaceData && <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...spaceData} />
          </Grid>
        }
        {
          spaceCensorship && <Grid size={{ xs: 12, lg: 6 }}>
            {<ChartApproveStatus {...spaceCensorship} />}
          </Grid>
        }
        {
          bookingRentalType &&
          <Grid size={{ xs: 12, lg: 6 }}>
            <BookingTypeChart {...bookingRentalType} />
          </Grid>
        }
        <Grid size={{ xs: 12, lg: 6 }}>
          {transactionData && <TransactionBarChart {...transactionData} />}
        </Grid>
      </Grid>
    </Box>
  );
};

// StatItem component for displaying statistics
const StatItem = ({ icon, value, change, label }) => (
  <div className="stat-item">
    <i className={icon}></i>
    <div className="value">{value}</div>
    <div className="change">
      {change} <i className={change.includes('-') ? "fas fa-arrow-down" : "fas fa-arrow-up"}></i>
    </div>
    <div>{label}</div>
  </div>
);

export default HomeAdmin;
