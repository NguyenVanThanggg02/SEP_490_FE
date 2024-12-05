/* eslint-disable react/prop-types */
import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { RangeOfMonthSelect } from './RangeOfMonthSelect';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export function BookingTypeChart({ title, data, axis, total, interval, handleMonthRangeChange }) {
  const theme = useTheme();

  const colorPalette = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent sx={{
        position: 'relative'
      }}>
        <RangeOfMonthSelect onRangeOfMonthChange={handleMonthRangeChange} defaultRange={1} />
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {total}
            </Typography>
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {interval}
          </Typography>
        </Stack>
        <LineChart
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'point',
              data: axis,
              tickInterval: (index, i) => {
                if (axis.length > 300) {
                  return (i + 1) % 40 === 0
                } else if (axis.length > 100) {
                  return (i + 1) % 15
                } else return (i + 1) % 5
              },
            },
          ]}
          series={data.map(d => {
            return {
              id: d.label,
              label: d.label,
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: d.data,
            }
          })}
          height={250}
          margin={{ left: 50, right: 20, top: 20, bottom: 20 }}
          grid={{ horizontal: true }}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
        >
          <AreaGradient color={theme.palette.primary.dark} id="organic" />
          <AreaGradient color={theme.palette.primary.main} id="referral" />
          <AreaGradient color={theme.palette.primary.light} id="direct" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
