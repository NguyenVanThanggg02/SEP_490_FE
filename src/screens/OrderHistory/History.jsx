import React, { useEffect, useState } from "react";
import '../../style/History.css';
import axios from "axios";
import { formatNumberToVND } from "../../utils/numberFormatter";

const History = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [service, setService] = useState("Tất cả");
    const [status, setStatus] = useState("Tất cả");
    const [bookings, setBookings] = useState([]);
    
    const user = localStorage.getItem("userId");


    useEffect(() => {
        axios
          .get(`http://localhost:9999/bookings/bookingByUserId/${user}`)
          .then((res) => {
            setBookings(res.data);
          })
          .catch((err) => {
            console.log(err.message);
          });
      }, [user]);

    const handleSearch = () => {
        console.log({
            fromDate,
            toDate,
            phoneNumber,
            service,
            status,
        });
    };
    const formatDate = (inputDate) => {
        const dateObject = new Date(inputDate);
        const day = dateObject.getDate().toString().padStart(2, "0");
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObject.getFullYear();
        return `${day}-${month}-${year}`;
      };
    
    return (
      <div className="container containerhistory">
        <div className="card cardhistory">
          <div className="card-headerhistory">Lịch sử đặt</div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-2">
                <label htmlFor="fromDate" className="form-label">
                  Từ ngày
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  placeholder="Chọn ngày"
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="toDate" className="form-label">
                  Đến ngày
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="Chọn ngày"
                />
              </div>

              <div className="col-md-2">
                <label htmlFor="service" className="form-label">
                  Không gian
                </label>
                <select
                  className="form-select"
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  <option value="Tất cả">Tất cả</option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="status" className="form-label">
                  Trạng thái
                </label>
                <select
                  className="form-select"
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Tất cả">Tất cả</option>
                </select>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-search" onClick={handleSearch}>
                  <i className="fas fa-search"></i> Tìm kiếm
                </button>
              </div>
            </div>

            <div className="card cardhistory">
              <div className="card-headerhistory d-flex justify-content-between align-items-center">
                <span>Lịch sử đặt</span>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                </div>
                <table className="table tablehistory">
                  <thead>
                    <tr>
                      <th>Ảnh</th>
                      <th>Địa điểm</th>
                      <th>Giá</th>
                      <th>Thời gian đặt</th>
                      <th>Thời gian trả</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="no-data">
                          Bạn chưa đặt lịch nào !!!
                        </td>
                      </tr>
                    ) : (
                      bookings.map((item, index) => (
                        <tr key={item._id}>
                          <td>
                            <img
                              src={item?.items?.[0]?.spaceId?.images?.[0]?.url}
                              alt="Ảnh không gian"
                              style={{height:'50px', width:'50px'}}
                            />
                          </td>
                          <td>{item?.items?.[0]?.spaceId?.name}</td>
                          <td>{formatNumberToVND(item.totalAmount)}</td>
                          <td>{formatDate(item.startDate)}</td>
                          <td>{formatDate(item.endDate)}</td>
                          <td>{item.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default History;