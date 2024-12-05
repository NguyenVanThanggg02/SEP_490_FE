import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import 'dayjs/locale/vi';
import React from 'react';
import 'react-calendar/dist/Calendar.css';

export default function RadiosForChoseRentalType({
  spaceData,
  selectedData,
  onRentalTypeChange,
}) {
  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        Chọn cách thức thuê
      </Typography>
      <FormControl component="fieldset" align="center">
        <RadioGroup
          row
          value={selectedData.rentalType}
          onChange={onRentalTypeChange}
        >
          {spaceData.pricePerHour > 0 ? (
            <FormControlLabel
              value="hour"
              control={<Radio />}
              label="Theo giờ"
            />
          ) : (
            <></>
          )}
          {spaceData.pricePerDay > 0 ? (
            <FormControlLabel
              value="day"
              control={<Radio />}
              label="Theo ngày"
            />
          ) : (
            <></>
          )}

          {spaceData.pricePerMonth > 0 ? (
            <FormControlLabel
              value="month"
              control={<Radio />}
              label="Theo tháng"
            />
          ) : (
            <></>
          )}
        </RadioGroup>
      </FormControl>
    </>
  );
}
