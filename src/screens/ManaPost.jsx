import React, { useEffect, useState } from "react";
import img from "../assets/no-records.png.png";
import axios from "axios";
import { Pane, Spinner, toaster } from "evergreen-ui";
import { Constants } from "../utils/constants";

const ManaPost = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("");
  const [listSpace, setListSpace] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const userId = localStorage.getItem("userId");

  // Lấy dữ liệu
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axios.get(
          `${Constants.apiHost}/spaces/for/${userId}`
        );
        if (response.status === 200) {
          setListSpace(response.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchSpaces();
  }, [userId]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleStatusChange = (e) => setStatus(e.target.value);

  const handleSearch = () => {
    const filteredSpaces = listSpace.filter(
      (space) =>
        (space.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          !searchQuery) &&
        (space.status === status || !status)
    );
    setListSpace(filteredSpaces);
    setCurrentPage(1);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSpaces = listSpace.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(listSpace.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  useEffect(() => {
    if (error) {
      toaster.danger(error);
    }
  }, [error]);
  if (loading) {
    return (
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
        height={400}
      >
        <Spinner />
      </Pane>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center">Danh Sách Không Gian Đã Tạo</h1>
      <div className="row mb-3">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên không gian"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-md-5">
          <select
            className="form-select"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="">Chọn Trạng Thái</option>
            <option value="Chờ Duyệt">Chờ Duyệt</option>
            <option value="Chấp Nhận">Chấp Nhận</option>
            <option value="Từ Chối">Từ Chối</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-dark w-100" onClick={handleSearch}>
            <i className="fas fa-search"></i> TÌM KIẾM
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-dark">THÊM KHÔNG GIAN</button>
      </div>
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Ảnh </th>
            <th>Tên không gian</th>
            <th>Mức giá</th>
            <th>Địa chỉ</th>
            <th>Diện tích</th>
            <th>Tình trạng phòng</th>
            <th>Trạng thái</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentSpaces.length > 0 ? (
            currentSpaces.map((space) => (
              <tr key={space._id}>
                <td>
                  {space.images && space.images.length > 0 ? (
                    <img
                      src={space.images[0].url}
                      alt={space.name}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <img
                      src={img}
                      alt="No image"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </td>
                <td>{space.name}</td>
                <td>{space.pricePerHour}</td>
                <td>{space.location}</td>
                <td>{space.area}</td>
                <td>{space.status}</td>
                <td>{space.censorship}</td>
                <td>
                  <button className="btn btn-sm btn-primary" title="Sửa">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="btn btn-sm btn-danger" title="Xóa">
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                <img src={img} alt="No records" style={{ width: "150px" }} />
                <p>Không có không gian nào được tìm thấy</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-dark"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-dark"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ManaPost;
