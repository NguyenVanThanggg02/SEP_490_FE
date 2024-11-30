/* eslint-disable react/prop-types */
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { Grid } from '@mui/material';

const colors = [
  'rgb(10, 62, 55)',
  '#0f5a4f',
  'rgb(63, 123, 114)',
];

export function ChartApproveStatus({ title, data, total }) {
  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          {title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 2, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PieChart
              colors={colors}
              margin={{
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
              }}
              series={[
                {
                  data,
                  innerRadius: 50,
                  outerRadius: 80,
                  paddingAngle: 0,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                },
              ]}
              height={220}
              width={220}
              slotProps={{
                legend: { hidden: true },
              }}
            >
              {/* <PieCenterLabel primaryText="98.5K" secondaryText="Total" /> */}
            </PieChart>
          </Box>
          <Box>
            <Grid container spacing={2}>
              {data.map((d, index) => (
                <Grid
                  key={index} item xs={12}>
                  <Stack
                    direction="row"
                    sx={{ alignItems: 'center', gap: 2, pb: 2 }}
                  >
                    <Stack sx={{ gap: 1, flexGrow: 1 }}>
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: '500' }}>
                          {d.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {Math.round(d.value / total * 100)}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        aria-label="Number of spaces"
                        value={Math.round(d.value / total * 100)}
                        sx={{
                          [`& .${linearProgressClasses.bar}`]: {
                            backgroundColor: colors[index],
                          },
                        }}
                      />
                    </Stack>
                  </Stack>
                </Grid>
              ))}

            </Grid></Box></Box>
      </CardContent>
    </Card>
  );
}
