import React, { useState } from "react";
import HeaderAdmin from "./HeaderAdmin";
import { Col, Container, Row } from "react-bootstrap";
import { Select } from "antd";
import RevenueChart from "./Chart/RevenueChartByMonth";
import "../style/Homeadmin.css";
import RevenueChartByOrder from "./Chart/RevenueChartByOrder";

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
      <div className="container1 mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                Sale
                <span className="float-end" style={{ color: "#007bff" }}>
                  $613.200
                </span>
              </div>
              <div className="card-body">
                <p>January - June</p>
                <div className="chart"><RevenueChartByOrder/></div>
                <div className="stats">
                  <div className="stat-item">
                    <i className="fas fa-users"></i>
                    <div className="value">44.725</div>
                    <div className="change">
                      (-12.4% <i className="fas fa-arrow-down"></i>)
                    </div>
                    <div>Customers</div>
                  </div>
                  <div className="stat-item">
                    <i className="fas fa-shopping-cart"></i>
                    <div className="value">385</div>
                    <div className="change positive">
                      (17.2% <i className="fas fa-arrow-up"></i>)
                    </div>
                    <div>Orders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card traffic-card">
              <div className="card-header">Traffic</div>
              <div className="card-body">
                <p>January 1- December 31</p>
                <div className="traffic-chart"><RevenueChart /></div>
              </div>

            </div>
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
          </div>
        </div>
      </div>
    </Container>
  );
};

export default HomeAdmin;
