import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Container } from "react-bootstrap";

const RevenueChart = () => {
  const chartData = {
    xAxisData: [1, 2, 3, 5, 8, 10],
    seriesData: [2, 5.5, 2, 8.5, 1.5, 5],
  };

  return (
    <Container>
      <LineChart
        xAxis={[{ data: chartData.xAxisData }]}
        series={[
          {
            data: chartData.seriesData,
          },
        ]}
        width={500}
        height={300}
      />
    </Container>
  );
};

export default RevenueChart;
