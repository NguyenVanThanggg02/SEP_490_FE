import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import StickyHeadTable from '../components/StickyHeaderTable';
import { formatNumberToVND } from '../utils/numberFormatter';
import { Constants } from '../utils/constants';

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

  // cal best stats
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

  // filter based on month, space have its own stats
  const calStatsForEachSpaceInMonth = (filteredStat, filter) => {
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
  };

  const statsForEachSpaceInMonth = useMemo(
    () => calStatsForEachSpaceInMonth(filteredStat, filter),
    [filteredStat, filter.month, filter.year]
  );

  // filter based on month, each month have its total stats this total stats is sum of stats of space in this month
  const calTotalStatsInMonth = (filteredStat, filter) => {
    let totalAvenueInMonth = 0;
    let totalNumOfBookInMonth = 0;

    const statsForEachSpaceInMonth = calStatsForEachSpaceInMonth(
      filteredStat,
      filter
    );

    for (let i = 0; i < statsForEachSpaceInMonth.length; i++) {
      totalAvenueInMonth += statsForEachSpaceInMonth[i].avenue;
      totalNumOfBookInMonth += statsForEachSpaceInMonth[i].numOfBook;
    }
    return { avenue: totalAvenueInMonth, numOfBook: totalNumOfBookInMonth };
  };

  const totalStatsInMonth = useMemo(
    () => calTotalStatsInMonth(filteredStat, filter),
    [filteredStat, filter]
  );

  // filter based on year, each month have its total stats this total stats is sum of stats of space in this month
  const totalStatsEachMonthInYear = useMemo(() => {
    return [...Array(12).keys()].map((i) => {
      const month = i + 1;
      const cusFilter = { month, year: filter.year };
      const stats = calTotalStatsInMonth(filteredStat, cusFilter);
      return {
        ...cusFilter,
        ...stats,
      };
    });
  }, [filteredStat, filter.year]);

  // filter based on year, for each month, space have its own stats
  const statsForEachSpaceEachMonthInYear = useMemo(() => {
    return [...Array(12).keys()].map((i) => {
      const month = i + 1;
      const cusFilter = { month, year: filter.year };
      const stats = calStatsForEachSpaceInMonth(filteredStat, cusFilter);
      return {
        ...cusFilter,
        statsSpaces: stats,
      };
    });
  }, [filteredStat, filter.year]);

  // filter based on year, each spaces have its total stats this total stats is sum of stats of this space in each month
  function calculateTotalAvenueAndBookings(data, year) {
    const result = {};

    data.forEach((entry) => {
      if (entry.year === year) {
        entry.statsSpaces.forEach((space) => {
          const spaceId = space._id;
          if (!result[spaceId]) {
            result[spaceId] = {
              _id: space._id,
              name: space.name,
              avenue: space.avenue,
              numOfBook: space.numOfBook,
            };
          } else {
            result[spaceId].avenue += space.avenue;
            result[spaceId].numOfBook += space.numOfBook;
          }
        });
      }
    });

    return Object.values(result);
  }
  const statsForEachSpaceInYear = useMemo(
    () =>
      calculateTotalAvenueAndBookings(
        statsForEachSpaceEachMonthInYear,
        filter.year
      ),
    [filteredStat, filter.year]
  );

  const totalStatsInYear = useMemo(
    () =>
      statsForEachSpaceInYear.reduce(
        (acc, statsSpace) => {
          const { numOfBook, avenue } = statsSpace;
          acc.numOfBook = acc.numOfBook + numOfBook;
          acc.avenue = acc.avenue + avenue;

          return acc;
        },
        { numOfBook: 0, avenue: 0 }
      ),
    [statsForEachSpaceInYear]
  );

  // filter based on month, each day on month have its total stats
  const totalAvenueInDayOfMonth = useMemo(() => {
    const haveBookingSpaces = filteredStat.filter(
      (space) => space?.bookings?.length
    );
    const flatBookings = haveBookingSpaces.flatMap((space) => space.bookings);

    const totalAvenueInBooKings=flatBookings.reduce((acc, booking) => {
      if (!booking.plusTransId) return acc;
      const haveSomePlus = booking.plusTransId.reduce((acc, tran) => {
        const tranDate = new Date(tran.createdAt);
        if (
          tranDate.getMonth() + 1 === filter.month &&
          tranDate.getFullYear() === filter.year
        ) {
          const VNtime=new Date(tran.createdAt).toLocaleString('vi-VN')
          const VNDate=VNtime.split(' ')[1]
          const VNDatePart=`${VNDate.split('/')[2]}-${VNDate.split('/')[1]}-${VNDate.split('/')[0]}`
          console.log('time to test',tran.createdAt,VNDatePart, tran.createdAt)
          const datePart = VNDatePart
          const exist = acc.find((obj) => {
            
              console.log('inside find exist', obj, datePart, tran)
            return obj.date === datePart});
          if (exist) {
            const other = acc.filter((obj) => obj.date !== datePart);
            return [
              ...other,
              { date: datePart, avenue: tran.amount + exist.avenue },
            ];
          }
          return [...acc, { date: datePart, avenue: tran.amount }];
        }
        return acc;
      }, []);

      return [...acc, ...haveSomePlus];
    }, []);
    console.log('totalAvenueInBooKings',totalAvenueInBooKings); 

    return totalAvenueInBooKings.reduce((acc, dateObj) => {
      const founddateObj=acc.find(currdateObj => currdateObj.date === dateObj.date);
      if(founddateObj){
        const otherdateObj=acc.filter(currdateObj => currdateObj.date !== dateObj.date)
        return [...otherdateObj, {date:dateObj.date,avenue: founddateObj.avenue+dateObj.avenue}];
      } else {
        return [...acc,{date:dateObj.date,avenue: dateObj.avenue}]
      }
    },[])
  }, [filteredStat, filter]);

  const fillOtherDay = useMemo(() => {
    return [...Array(31).keys()].map((_, i) => {
      const currDay = i + 1;
      const foundObj = totalAvenueInDayOfMonth.find((obj) => {
        const foundDay = Number(obj.date.split('-')[2]);
        return currDay === foundDay;
      });

      return { day: currDay, avenue: foundObj ? foundObj.avenue : 0 };
    });
  }, [totalAvenueInDayOfMonth]);

  console.log('filter', totalStatsInMonth, totalAvenueInDayOfMonth);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        if (filter.month && filter.year) {
          setLoading(true);
          const res = await axios.get(
            `${Constants.apiHost}/spaces/statistic/${userId}`
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
                <Typography><b>Doanh thu tổng:</b> {formatNumberToVND(totalStats.avenue)} VND</Typography>
                <Typography><b>Lượt đặt tổng:</b> {formatNumberToVND(totalStats.numOfBook)} Đơn</Typography>
              </Paper>
              <Paper sx={{ flex: 2, p: 2 }}>
                <Typography>
                  <b>Không gian có doanh thu cao nhất:</b> {bestSpaces.avenue.name}
                </Typography>
                <Typography>
                  <b>Không gian có lượt đặt cao nhất:</b> {bestSpaces.numOfBook.name}
                </Typography>
              </Paper>
              <Paper sx={{ flex: 1, p: 2 }}>
                <Typography>
                  {filter.month !== 'all' ? (
                    <>
                      <strong>Doanh thu T{filter.month}/{filter.year}:</strong> {totalStatsInMonth.avenue} VND
                    </>
                  ) : (
                    <>
                      <strong>Doanh thu năm {filter.year}:</strong> {totalStatsInYear.avenue} VND
                    </>
                  )}
                </Typography>
                <Typography>
                  {filter.month !== 'all' ? (
                    <>
                      <strong>Số đơn T{filter.month}/{filter.year}:</strong> {totalStatsInMonth.numOfBook} đơn
                    </>
                  ) : (
                    <>
                      <strong>Số đơn năm {filter.year}:</strong> {totalStatsInYear.numOfBook} đơn
                    </>
                  )}
                </Typography>
              </Paper>
            </Stack>
            {/* line char for daily avenue in month  */}
            <Stack>
              <LineChart
                dataset={
                  filter.month !== 'all'
                    ? fillOtherDay
                    : totalStatsEachMonthInYear
                }
                xAxis={[
                  {
                    dataKey: filter.month !== 'all' ? 'day' : 'month',
                  },
                ]}
                series={[{ dataKey: 'avenue', label: 'Doanh thu' }]}
                height={300}
                margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
                grid={{ vertical: true, horizontal: true }}
              />
            </Stack>

            {/* stats for each space */}
            <Stack direction={'row'} spacing={2}>
              <StickyHeadTable
                rows={
                  filter.month !== 'all'
                    ? statsForEachSpaceInMonth
                    : statsForEachSpaceInYear
                }
              />
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
