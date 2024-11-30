import React from 'react';
// import Calendar from 'react-calendar';
import { Button, List, ListItem, Paper, Typography } from '@mui/material';
import 'dayjs/locale/vi';
import 'react-calendar/dist/Calendar.css';

import { priceFormatter } from '../../utils/numberFormatter';

export default function Summary({ handleCreateBooking, amountsPerDates }) {
  return (
    <>
      <Typography variant="h6">Danh sách đã chọn</Typography>
      <Paper
        elevation={3}
        style={{ maxWidth: '500px', margin: '20px auto', padding: '10px' }}
      >
        <List>
          {amountsPerDates.length > 0 ? (
            <>
              {amountsPerDates.map((amountsPerDate, index) => (
                <ListItem key={index}>
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: 'text.primary', display: 'inline' }}
                  >
                    {amountsPerDate.text}
                    <br />
                    {priceFormatter(amountsPerDate.amount)} VND
                  </Typography>
                </ListItem>
              ))}
              <Button onClick={() => handleCreateBooking()}>Đặt Phòng</Button>
            </>
          ) : (
            <Typography>Chưa chọn lịch</Typography>
          )}
        </List>
        <Typography variant="h6">
          Tổng số tiền:{' '}
          {priceFormatter(
            amountsPerDates.reduce(
              (acc, amountsPerDate) => acc + amountsPerDate.amount,
              0
            )
          )}{' '}
          VND
        </Typography>
      </Paper>
    </>
  );
}
