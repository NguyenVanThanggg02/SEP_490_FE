import React, { useState } from "react";
import HeaderAdmin from "./HeaderAdmin";
import { Container, Row } from "react-bootstrap";
import { Select } from "antd";
import RevenueChart from "./Chart/RevenueChartByMonth";
import "../style/Homeadmin.css";
import RevenueChartByOrder from "./Chart/RevenueChartByOrder";

const HomeAdmin = () => {
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());

  const handleYearChange = (value) => {
    setYear(value);
    fetchYearlyRevenue(month, value);
  };

  const fetchYearlyRevenue = (month, year) => {
    console.log(`Fetching revenue for year: ${year}`);
    // Gọi API để lấy doanh thu
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, index) => currentYear - 10 + index);

  return (
    <Container>
      <Row>
        <HeaderAdmin />
      </Row>
      <div className="container1 mt-3">
        <div className="grid-container">
          {/* Card Sale */}
          <div className="card">
            <div className="card-header">
              Sale
              <span className="float-end" style={{ color: "#007bff" }}>
                $613.200
              </span>
            </div>
            <div className="card-body">
              <p>January - June</p>
              <div className="chart"><RevenueChartByOrder /></div>
              <div className="stats">
                <StatItem icon="fas fa-users" value="44.725" change="(-12.4%)" label="Customers" />
                <StatItem icon="fas fa-shopping-cart" value="385" change="(17.2%)" label="Orders" />
              </div>
            </div>
          </div>

          {/* Card Traffic */}
          <div className="card traffic-card">
            <div className="card-header">Traffic</div>
            <div className="card-body">
              <p>January 1 - December 31</p>
              <div className="traffic-chart"><RevenueChart /></div>
            </div>
            <div className="d-flex align-items-center justify-content-center mt-3">
          <h6 className="mb-0 me-2">Doanh thu theo năm:</h6>
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

// StatItem component for displaying statistics
const StatItem = ({ icon, value, change, label }) => (
  <div className="stat-item">
    <i className={icon}></i>
    <div className="value">{value}</div>
    <div className="change">
      {change} <i className={change.includes('-') ? "fas fa-arrow-down" : "fas fa-arrow-up"}></i>
    </div>
    <div>{label}</div>
  </div>
);

export default HomeAdmin;
