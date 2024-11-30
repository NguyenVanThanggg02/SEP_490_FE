import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';
import 'react-calendar/dist/Calendar.css';

import { Calendar } from 'react-multi-date-picker';

dayjs.locale('vi');
dayjs.extend(customParseFormat);

const vietnamese_lowercase = {
  name: 'vietnamese_lowercase',
  months: [
    ['Tháng 1', 'Thg 1'],
    ['Tháng 2', 'Thg 2'],
    ['Tháng 3', 'Thg 3'],
    ['Tháng 4', 'Thg 4'],
    ['Tháng 5', 'Thg 5'],
    ['Tháng 6', 'Thg 6'],
    ['Tháng 7', 'Thg 7'],
    ['Tháng 8', 'Thg 8'],
    ['Tháng 9', 'Thg 9'],
    ['Tháng 10', 'Thg 10'],
    ['Tháng 11', 'Thg 11'],
    ['Tháng 12', 'Thg 12'],
  ],
  weekDays: [
    ['Thứ Bảy', 'T7'],
    ['Chủ Nhật', 'CN'],
    ['Thứ Hai', 'T2'],
    ['Thứ Ba', 'T3'],
    ['Thứ Tư', 'T4'],
    ['Thứ Năm', 'T5'],
    ['Thứ Sáu', 'T6'],
  ],
  digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  meridiems: [
    ['SA', 'sa'],
    ['CH', 'ch'],
  ],
};

export default function CalendarForEachRentalType({
  selectedData,
  onChangeDatePart,
}) {
  return (
    <>
      {/* header for calendar */}
      <Typography variant="h6" sx={{ mb: 4 }}>
        {selectedData.rentalType === 'hour' ? (
          <span> Chọn ngày và khung giờ trong ngày đó</span>
        ) : selectedData.rentalType === 'day' ? (
          <span> Chọn ngày</span>
        ) : selectedData.rentalType === 'month' ? (
          <span> Chọn tháng</span>
        ) : (
          <></>
        )}
      </Typography>

      {/* calendar picker */}
      {selectedData.rentalType === 'hour' ? (
        <Calendar
          value={selectedData.selectedDates}
          onChange={onChangeDatePart}
          multiple
          locale={vietnamese_lowercase}
          numberOfMonths={2}
          minDate={new Date()}
        />
      ) : selectedData.rentalType === 'day' ? (
        <Calendar
          value={selectedData.selectedDates}
          onChange={onChangeDatePart}
          multiple
          locale={vietnamese_lowercase}
          numberOfMonths={2}
          minDate={new Date()}
        />
      ) : selectedData.rentalType === 'month' ? (
        <Calendar
          value={selectedData.selectedDates}
          onChange={onChangeDatePart}
          onlyMonthPicker
          multiple
          locale={vietnamese_lowercase}
          hideMonth
        />
      ) : null}
    </>
  );
}
