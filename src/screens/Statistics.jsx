import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
  } from '@mui/material';
  import { BarChart } from '@mui/x-charts/BarChart';
  import axios from 'axios';
  import React, { useEffect, useMemo, useState } from 'react';
  import { Container } from 'react-bootstrap';
  import { toast } from 'react-toastify';
  
  export function RevenueChart({ dataset, label, dataKey }) {
    return (
      <Container>
        <BarChart
          dataset={dataset}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'name',
              tickPlacement: 'middle',
              tickLabelPlacement: 'middle',
            },
          ]}
          yAxis={[
            {
              label: 'VND (Đồng)',
            },
          ]}
          series={[{ dataKey, label }]}
          barLabel="value"
          width={500}
          height={300}
        />
      </Container>
    );
  }
  
  const currDate = new Date();
  export default function Statistics() {
    const userId = localStorage.getItem('userId');
    const [filter, setFilter] = useState({
      month: currDate.getMonth(),
      year: currDate.getFullYear(),
    });
    const [loading, setLoading] = useState(false);
    const [filteredStat, setFilteredStat] = useState([]);
    const onTimeChange = (e) => {
      const key = e.target.name;
      const value = e.target.value;
  
      setFilter((prev) => ({ ...prev, [key]: value }));
    };
  
    const maxAvenueSpace = useMemo(() => {
      return filteredStat.reduce((maxAvenueSpace, space) => {
        return space.totalAvenue > maxAvenueSpace.totalAvenue
          ? space
          : maxAvenueSpace;
      }, filteredStat[0]);
    }, [filteredStat]);
  
    const maxBookingSpace = useMemo(() => {
      return filteredStat.reduce((maxAvenueSpace, space) => {
        return space.numOfBooking > maxAvenueSpace.numOfBooking
          ? space
          : maxAvenueSpace;
      }, filteredStat[0]);
    }, [filteredStat]);
  
    useEffect(() => {
      const fetchSpaces = async () => {
        try {
          if (filter.month && filter.year) {
            setLoading(true);
            const res = await axios.get(
              `http://localhost:9999/spaces/statistic/${userId}`,
              {
                params: {
                  ...filter,
                },
              }
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
    }, [filter, userId]);
  
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
              {/* overall */}
              <Box>
                <Stack>
                  <Typography>
                    Không gian có nhiều lượt đặt nhất:{maxBookingSpace.name} -{' '}
                    <strong>{maxBookingSpace.numOfBooking}</strong> lượt đặt
                  </Typography>
                  <Typography>
                    Không gian có doanh thu cao nhất: {maxAvenueSpace.name} -
                    <strong>{maxBookingSpace.totalAvenue}</strong> đồng
                  </Typography>
                </Stack>
              </Box>
              {/* filter */}
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={'center'}
                justifyContent={'space-between'}
                spacing={2}
                sx={{
                  minWidth: '400px',
                }}
              >
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
            </Stack>
            {loading ? <p>Loading...</p> : null}
            {/* statistics chart */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: '8px',
              }}
            >
              <Stack>
                <RevenueChart
                  label={'Doanh thu'}
                  dataset={filteredStat}
                  dataKey="totalAvenue"
                />
              </Stack>
              <Stack>
                <RevenueChart
                  label={'Lượt đặt'}
                  dataset={filteredStat}
                  dataKey="numOfBooking"
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    );
  }
  