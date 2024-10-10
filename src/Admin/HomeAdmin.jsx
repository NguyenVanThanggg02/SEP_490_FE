import React, { useState } from "react";
import HeaderAdmin from "./HeaderAdmin";
import { Col, Container, Row } from "react-bootstrap";
import { Select } from "antd";
import RevenueChart from "./Chart/RevenueChartByMonth";

const HomeAdmin = () => {
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleMonthChange = (value) => {
    setMonth(value);
    fetchMonthlyRevenue(value, year);
  };

  const handleYearChange = (value) => {
    setYear(value);
    fetchYearlyRevenue(month, value);
  };

  const fetchMonthlyRevenue = (month, year) => {
    console.log(`Fetching revenue for month: ${month}, year: ${year}`);
    // Gọi API để lấy doanh thu
  };

  const fetchYearlyRevenue = (month, year) => {
    console.log(`Fetching revenue for year: ${year}`);
    // Gọi API để lấy doanh thu
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 21 },
    (_, index) => currentYear - 10 + index
  );

  return (
    <Container>
      <Row>
        <HeaderAdmin />
      </Row>
      <Row className="mt-3">
        <Col md={6}>
        <RevenueChart />
          <div className="d-flex align-items-center justify-content-center">
            <h6 className="mb-0 me-2">Doanh thu theo tháng: </h6>
            <Select
              style={{ width: "100px" }}
              defaultValue={month}
              onChange={handleMonthChange}
            >
              {[...Array(12).keys()].map((index) => (
                <Select.Option key={index + 1} value={index + 1}>
                  {index + 1}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Col>
        <Col md={6}>
        <RevenueChart />
          <div className="d-flex align-items-center justify-content-center">
            <h6 className="mb-0 me-2">Doanh thu theo năm: </h6>
            <Select
              style={{ width: "100px" }}
              defaultValue={year}
              onChange={handleYearChange}
            >
              {years.map((yearOption) => (
                <Select.Option key={yearOption} value={yearOption}>
                  {yearOption}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeAdmin;
