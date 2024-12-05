import { Box, Button, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import React from 'react';
import 'react-calendar/dist/Calendar.css';
import { convertDatePart } from '../BookingDate';

dayjs.locale('vi');
dayjs.extend(customParseFormat);

export const checkGoldenHour = (spaceData, slot) => {
  if (!spaceData.isGoldenHour) return false;
  if (!spaceData?.goldenHourDetails?.length) return false;

  return spaceData.goldenHourDetails.find(
    (goldenSlot) => goldenSlot.startTime === slot.startTime
  );
};

export default function AvailableSlots({
  spaceData,
  rentalType,
  availableSlots: slotsInSelectedDates,
  selectedSlotsWithDateParts,
  onChoseSlot = () => {},
}) {
  return (
    <div>
      {/* list option for hour slot */}
      {rentalType === 'hour' && slotsInSelectedDates.length > 0
        ? slotsInSelectedDates.map((slotsInSelectedDate, idx) => {
            const { datePart, availableSlots } = slotsInSelectedDate;
            return (
              <Box key={idx} mt={3}>
                <Typography variant="subtitle1">
                  {convertDatePart(datePart)}
                </Typography>
                <Grid container justifyContent="center" spacing={1} mt={1}>
                  {availableSlots.map((slot, index) => (
                    <Grid item key={index}>
                      <Button
                        variant={
                          selectedSlotsWithDateParts.find((item) => {
                            return (
                              item.datePart === datePart &&
                              item.selectedSlots.find(
                                (selectedSlot) =>
                                  selectedSlot.startTime === slot.startTime
                              )
                            );
                          })
                            ? 'contained'
                            : 'outlined'
                        }
                        sx={
                          checkGoldenHour(spaceData, slot)
                            ? { border: '4px solid yellow' }
                            : {}
                        }
                        onClick={() => onChoseSlot(datePart, slot)}
                        style={{ margin: '5px' }}
                      >
                        {slot.startTime} - {slot.endTime}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })
        : null}
    </div>
  );
}
