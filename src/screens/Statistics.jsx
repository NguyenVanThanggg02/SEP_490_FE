import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { formatNumberToVND } from '../utils/numberFormatter';

const getTotalPlusTrans = (plusTransId) => {
  return plusTransId.reduce((acc, currVal) => {
    return acc + Number(currVal.amount);
  }, 0);
};

const currDate = new Date();
export default function Statistics() {
  const userId = localStorage.getItem('userId');
  const [filter, setFilter] = useState({
    month: currDate.getMonth() + 1,
    year: currDate.getFullYear(),
  });
  const [loading, setLoading] = useState(false);
  const [filteredStat, setFilteredStat] = useState([]);
  const onTimeChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const spacesWithStat = useMemo(
    () =>
      filteredStat.map((space) => {
        const bookings = space?.bookings;
        // make sure that space have bookings field
        if (!bookings) return new Error('Space not have the bookings field');
        // if bookings is empty=> 0
        if (bookings.length === 0)
          return { _id: space._id, name: space.name, avenue: 0, numOfBook: 0 };
        // have some bookings
        const avenue = bookings.reduce((acc, booking) => {
          // if dont have plusTransId
          if (!booking?.plusTransId) return acc;
          const avenueInThisBook = getTotalPlusTrans(booking.plusTransId);
          return acc + avenueInThisBook;
        }, 0);

        const numOfBook = bookings.length;
        return {
          _id: space._id,
          name: space.name,
          avenue,
          numOfBook,
        };
      }),
    [filteredStat]
  );

  const bestSpaces = useMemo(() => {
    let bestAvenueSpace = spacesWithStat[0];
    let bestNumOfBookSpace = spacesWithStat[0];

    for (let i = 1; i < spacesWithStat.length; i++) {
      if (spacesWithStat[i].avenue > bestAvenueSpace.avenue) {
        bestAvenueSpace = spacesWithStat[i];
      }
      if (spacesWithStat[i].numOfBook > bestNumOfBookSpace.numOfBook) {
        bestNumOfBookSpace = spacesWithStat[i];
      }
    }
    return { avenue: bestAvenueSpace, numOfBook: bestNumOfBookSpace };
  }, [spacesWithStat]);

  const totalStats = useMemo(() => {
    let totalAvenue = 0;
    let totalNumOfBook = 0;

    for (let i = 0; i < spacesWithStat.length; i++) {
      totalAvenue += spacesWithStat[i].avenue;
      totalNumOfBook += spacesWithStat[i].numOfBook;
    }
    return { avenue: totalAvenue, numOfBook: totalNumOfBook };
  }, [spacesWithStat]);

  const statsForEachSpaceInMonth = useMemo(() => {
    return filteredStat.map((space) => {
      const bookings = space?.bookings;
      // make sure that space have bookings field
      if (!bookings) return new Error('Space not have the bookings field');
      // if bookings is empty=> 0
      if (bookings.length === 0)
        return { _id: space._id, name: space.name, avenue: 0, numOfBook: 0 };
      // have some bookings
      const stat = bookings.reduce(
        (acc, booking) => {
          // if dont have plusTransId or plusTransId is emty=>0
          if (!booking?.plusTransId) return acc;
          // have some trans plus
          // check filter month and year for avenue
          const avenue = booking.plusTransId.reduce((acc, tran) => {
            const tranDate = new Date(tran.createdAt);
            console.log('tranDate', tranDate.getMonth());

            if (
              tranDate.getMonth() + 1 === filter.month &&
              tranDate.getFullYear() === filter.year
            ) {
              console.log('plus', tran);
              return acc + tran.amount;
            }
            return acc;
          }, 0);
          // check filter month and year for booking
          const bookingDate = new Date(booking.createdAt);
          let numOfBook = 0;
          if (
            bookingDate.getMonth() + 1 === filter.month &&
            bookingDate.getFullYear() === filter.year
          ) {
            numOfBook += 1;
          }

          return {
            avenue: acc.avenue + avenue,
            numOfBook: acc.numOfBook + numOfBook,
          };
        },
        {
          avenue: 0,
          numOfBook: 0,
        }
      );

      return {
        _id: space._id,
        name: space.name,
        ...stat,
      };
    });
  }, [filteredStat, filter.month, filter.year]);
  console.log('statsForEachSpaceInMonth', statsForEachSpaceInMonth);
  const totalStatsInMonth = useMemo(() => {
    let totalAvenueInMonth = 0;
    let totalNumOfBookInMonth = 0;

    for (let i = 0; i < statsForEachSpaceInMonth.length; i++) {
      totalAvenueInMonth += statsForEachSpaceInMonth[i].avenue;
      totalNumOfBookInMonth += statsForEachSpaceInMonth[i].numOfBook;
    }
    return { avenue: totalAvenueInMonth, numOfBook: totalNumOfBookInMonth };
  }, [filteredStat, filter]);

  const totalAvenueInDayOfMonth = useMemo(() => {
    const haveBookingSpaces = filteredStat.filter(
      (space) => space?.bookings?.length
    );
    const flatBookings = haveBookingSpaces.flatMap((space) => space.bookings);

    return flatBookings.reduce((acc, booking) => {
      if (!booking.plusTransId) return acc;
      const haveSomePlus = booking.plusTransId.reduce((acc, tran) => {
        const tranDate = new Date(tran.createdAt);
        if (
          tranDate.getMonth() + 1 === filter.month &&
          tranDate.getFullYear() === filter.year
        ) {
          const datePart = tran.createdAt.split('T')[0];
          const exist = acc.find((obj) => obj.date === datePart);
          console.log('exist', tran, exist);
          if (exist) {
            const other = acc.filter((obj) => obj.date !== datePart);
            return [...other, { date: datePart, num: tran.amount + exist.num }];
          }
          return [...acc, { date: datePart, num: tran.amount }];
        }
        return acc;
      }, []);
      console.log('haveSomePlus', haveSomePlus);

      return [...acc, ...haveSomePlus];
    }, []);
  }, [filteredStat, filter]);

  const fillOtherDay = useMemo(() => {
    return [...Array(31).keys()].map((_, i) => {
      const currDay = i + 1;
      const foundObj = totalAvenueInDayOfMonth.find((obj) => {
        const foundDay = Number(obj.date.split('-')[2]);
        return currDay === foundDay;
      });

      return { day: currDay, num: foundObj ? foundObj.num : 0 };
    });
  }, [totalAvenueInDayOfMonth]);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        if (filter.month && filter.year) {
          setLoading(true);
          const res = await axios.get(
            `http://localhost:9999/spaces/statistic/${userId}`
          );

          console.log('res after filter', res);

          if (Array.isArray(res.data.data)) {
            setFilteredStat(res.data.data);
          } else {
            setFilteredStat([]);
          }
        }
      } catch (error) {
        toast.error('Get spaces with booking detail failed');
        console.error('Error fetching data: ', error);
        setFilteredStat([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, [userId]);

  if (!filteredStat?.length) return <p>Bạn không có không gian nào cho thuê</p>;
  return (
    <Stack justifyContent={'center'} alignItems={'center'}>
      <Paper sx={{ p: 2, width: { xs: '100%', lg: '1200px' } }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={2}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            {/* filter */}
            <FormControl fullWidth>
              <InputLabel id="year-select-label">Năm</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={filter.year}
                label="year"
                name="year"
                onChange={onTimeChange}
              >
                {[...Array(12).keys()].map((_, i) => {
                  return (
                    <MenuItem value={currDate.getFullYear() - i}>
                      {currDate.getFullYear() - i}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="month-select-label">Tháng</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={filter.month}
                label="month"
                name="month"
                onChange={onTimeChange}
              >
                <MenuItem value={'all'}>All</MenuItem>

                {[...Array(12).keys()].map((month, i) => {
                  return <MenuItem value={i + 1}>{i + 1}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Stack>
          {loading ? <p>Loading...</p> : null}
          {/* statistics charts */}
          <Stack spacing={2}>
            {/* some stat overall */}
            <Stack direction={'row'} spacing={2} justifyContent={'center'}>
              <Paper sx={{ flex: 1, p: 2 }}>
                <Typography>Doanh thu tổng: {formatNumberToVND(totalStats.avenue)} VND</Typography>
                <Typography>Lượt đặt tổng: {totalStats.numOfBook}</Typography>
              </Paper>
              <Paper sx={{ flex: 1, p: 2 }}>
                <Typography>
                  Không gian có doanh thu cao nhất: {bestSpaces.avenue.name}
                </Typography>
                <Typography>
                  Không gian có lượt đặt cao nhất: {bestSpaces.numOfBook.name}
                </Typography>
              </Paper>
              <Paper sx={{ flex: 1, p: 2 }}>
                <Typography>
                  Doanh thu T{filter.month}/{filter.year}: 
                  {formatNumberToVND(totalStatsInMonth.avenue)} VND
                </Typography>
                <Typography>
                  Lượt đặt T{filter.month}/{filter.year}:{' '}
                  {totalStatsInMonth.numOfBook}
                </Typography>
              </Paper>
            </Stack>
            {/* line char for daily avenue in month  */}
            <Stack>
              <LineChart
                dataset={fillOtherDay}
                xAxis={[
                  {
                    dataKey: 'day',
                  },
                ]}
                series={[{ dataKey: 'num', label: 'Doanh thu' }]}
                height={300}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: true, horizontal: true }}
              />
            </Stack>
            {/* stats for each space */}
            <Stack direction={'row'} spacing={2}>
              <BarChart
                dataset={statsForEachSpaceInMonth}
                xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                series={[{ dataKey: 'avenue', label: 'Doanh thu' }]}
                width={500}
                height={300}
              />
              <BarChart
                dataset={statsForEachSpaceInMonth}
                xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
                series={[{ dataKey: 'numOfBook', label: 'Lượt đặt' }]}
                width={500}
                height={300}
              />
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
