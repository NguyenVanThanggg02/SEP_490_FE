import React, { useState } from "react";
import '../../style/History.css';

const History = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [service, setService] = useState("Tất cả");
    const [status, setStatus] = useState("Tất cả");
    const [historyData, setHistoryData] = useState([]);

    const handleSearch = () => {
        console.log({
            fromDate,
            toDate,
            phoneNumber,
            service,
            status,
        });
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
                                    <input type="text" className="form-control" placeholder="Search" />
                                </div>
                            </div>
                            <table className="table tablehistory">
                                <thead>
                                    <tr>
                                        <th>Ảnh</th>
                                        <th>Địa điểm</th>
                                        <th>Giá</th>
                                        <th>Thời gian</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyData.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="no-data">
                                                No data available in table
                                            </td>
                                        </tr>
                                    ) : (
                                        historyData.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.service}</td>
                                                <td>{item.price}</td>
                                                <td>{item.phoneNumber}</td>
                                                <td>{item.time}</td>
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