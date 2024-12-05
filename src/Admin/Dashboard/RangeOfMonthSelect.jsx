/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react"
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Box } from '@mui/material';
import dayjs from "dayjs";

export const RangeOfMonthSelect = ({ onRangeOfMonthChange, defaultRange = 6 }) => {

    const [startMonth, setStartMonth] = useState(dayjs().subtract(defaultRange, 'month'));
    const [endMonth, setEndMonth] = useState(dayjs());

    useEffect(() => {
        if (startMonth && endMonth && startMonth.isValid() && endMonth.isValid() && !startMonth.isAfter(endMonth) && startMonth.isAfter(dayjs().subtract(10, 'year'))) {
            onRangeOfMonthChange(startMonth.format('MM/YYYY'), endMonth.format('MM/YYYY'))
        }
    }, [startMonth, endMonth])

    return (
        <Box sx={{ position: 'absolute', right: 16, top: 8, display: 'flex', flexWrap: 'nowrap' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ width: "130px" }}>
                    <DatePicker
                        label="Từ tháng"
                        views={['year', 'month']}
                        value={startMonth}
                        onChange={(newValue) => { return newValue.isValid() && setStartMonth(newValue) }}
                        disableFuture
                        format="MM/YYYY"
                        shouldDisableYear={(year) => {
                            return dayjs(year).isAfter(dayjs(endMonth, "MM/YYYY"), 'year')
                        }}
                        shouldDisableMonth={(month) => {
                            return dayjs(month).isAfter(dayjs(endMonth, "MM/YYYY"), 'month')
                        }}
                        slotProps={
                            {
                                textField: {
                                    size: 'small',
                                    fontSize: '0.9rem',
                                    inputProps: { style: { fontSize: '0.875rem' } },
                                    InputLabelProps: { style: { fontSize: '0.875rem' } }
                                },
                                openPickerIcon: {
                                    size: 'small'
                                }
                            }}
                    /></Box>
                <Box sx={{ width: "130px" }}>
                    <DatePicker
                        label="Tới tháng"
                        views={['year', 'month']}
                        value={endMonth}
                        onChange={(newValue) => { return newValue.isValid() && setEndMonth(newValue) }}
                        disableFuture
                        shouldDisableYear={(year) => {
                            return dayjs(year).isBefore(dayjs(startMonth, "MM/YYYY"), 'year')
                        }}
                        shouldDisableMonth={(month) => {
                            return dayjs(month).isBefore(dayjs(startMonth, "MM/YYYY"), 'month')
                        }}
                        format="MM/YYYY"
                        slotProps={
                            {
                                textField: {
                                    size: 'small',
                                    fontSize: '0.9rem',
                                    inputProps: { style: { fontSize: '0.875rem' } },
                                    InputLabelProps: { style: { fontSize: '0.875rem' } }
                                },
                                openPickerIcon: {
                                    size: 'small'
                                }
                            }}

                    /></Box>
            </LocalizationProvider>
        </Box>)
}