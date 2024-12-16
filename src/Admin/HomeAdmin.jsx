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
import { ProfitChart } from './Dashboard/ProfitChart';
import { Constants } from '../utils/constants';

const HomeAdmin = () => {

  const [userData, setUserData] = useState()
  const [spaceData, setSpaceData] = useState()
  const [transactionData, setTransactionData] = useState()
  const [spaceCensorship, setSpaceCensorship] = useState()
  const [bookingRentalType, setBookingRentalType] = useState()
  const [profit, setProfit] = useState()

  const fetchData = async () => {
    try {
      const response = await axios.post(`${Constants.apiHost}/dashboard`);
      setUserData(response.data.user)
      setSpaceData(response.data.space)
      setTransactionData({
        ...response.data.transaction,
        content: `${formatMoney(response.data.transaction.revenue6Months)} - ${formatMoney(response.data.transaction.revenue)}`,
        subContent: `Doanh thu các tháng - Tổng doanh thu`
      })
      setSpaceCensorship(response.data.spaceCensorship)
      setBookingRentalType(response.data.bookingRentalType)
      setProfit(response.data.profit)
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTransactionBarChartMonthRangeChange = async (startMonth, endMonth) => {
    const response = await axios.post(`${Constants.apiHost}/dashboard`, { transactionFilter: { from: startMonth, to: endMonth } });
    setTransactionData({
      ...response.data.transaction,
      content: `${formatMoney(response.data.transaction.revenue6Months)} - ${formatMoney(response.data.transaction.revenue)}`,
      subContent: `Doanh thu các tháng - Tổng doanh thu`
    })
  }

  const handlBookingRentalTypeMonthRangeChange = async (startMonth, endMonth) => {
    const response = await axios.post(`${Constants.apiHost}/dashboard`, { bookingRentalTypeFilter: { from: startMonth, to: endMonth } });
    setBookingRentalType(response.data.bookingRentalType)
  }
  const handleProfitMonthRangeChange = async (startMonth, endMonth) => {
    const response = await axios.post(`${Constants.apiHost}/dashboard`, { profitFilter: { from: startMonth, to: endMonth } });
    setProfit(response.data.profit)
  }
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
          profit &&
          <Grid size={{ xs: 12, sm: 12, lg: 12, xl: 4 }}>
            <ProfitChart {...profit} handleMonthRangeChange={handleProfitMonthRangeChange} total={formatMoney(profit.total)} />
          </Grid>
        }
        {
          userData && <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard {...userData} />
          </Grid>
        }
        {
          spaceData && <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <StatCard {...spaceData} />
          </Grid>
        }
        
        {
          bookingRentalType &&
          <Grid size={{ xs: 12, lg: 6 }}>
              <BookingTypeChart {...bookingRentalType} handleMonthRangeChange={handlBookingRentalTypeMonthRangeChange} />
          </Grid>
        }
        <Grid size={{ xs: 12, lg: 6 }}>
          {transactionData && <TransactionBarChart {...transactionData} handleMonthRangeChange={handleTransactionBarChartMonthRangeChange} />}
        </Grid>
        {
          spaceCensorship && <Grid size={{ xs: 12, lg: 6 }}>
            {<ChartApproveStatus {...spaceCensorship} />}
          </Grid>
        }
      </Grid>
    </Box>
  );
};

export default HomeAdmin;
