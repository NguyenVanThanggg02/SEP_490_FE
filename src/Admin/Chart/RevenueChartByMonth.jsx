import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Container } from "react-bootstrap";
export default function RevenueChart() {
  return (
    <Container>

    <BarChart
      xAxis={[{ scaleType: 'band', data: ['Tháng 1', 'Tháng 2'] }]}
      series={[{ data: [4, 3] }, { data: [1, 6] }, { data: [2, 1] }, { data: [2, 4] }]}
      width={400}
      height={150}
    />


    
    </Container>
  );
}
