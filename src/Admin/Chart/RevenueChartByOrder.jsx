import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Container } from "react-bootstrap";
export default function RevenueChartOrder() {
  return (
    <Container>
<BarChart
  xAxis={[{ scaleType: 'band', data: ['Tháng 1', 'Tháng 2'] }]}
  series={[{ data: [4] }, { data: [1] }, { data: [2] }, { data: [2] }]}
  width={400}  /* Giảm chiều rộng để phù hợp với thẻ */
  height={150} /* Chiều cao đồng bộ với card-body và chart */
  />



    
    </Container>
  );
}