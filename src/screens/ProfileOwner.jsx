import React, { useState } from 'react';
import "../style/ProfileOwner.css";
import { FlagFill } from "react-bootstrap-icons";
import Drawer from '@mui/material/Drawer';
import Reports from './Reports'; // Assuming you have a Reports component
import SelectSpaceToCompare from './SelectSpaceToCompare'; // Assuming you have SelectSpaceToCompare component
import Similar from './Similar'; // Assuming you have Similar component

const ProfileOwner = () => {
  const [visible, setVisible] = useState(false); // For Reports popup
  const [openDrawer, setOpenDrawer] = useState(false); // For Drawer
  const [visibleCompare, setVisibleCompare] = useState(false); // For Space Compare

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const handleReportClick = () => {
    setVisible(true); // Show the report popup
  };

  const drawerContent = () => (
    <div>
      <h2>Nội dung báo cáo</h2>
      <p>Xin vui lòng điền thông tin báo cáo.</p>
      <button onClick={() => setOpenDrawer(false)}>Đóng</button>
    </div>
  );

  const handleValueChange = (value) => {
    console.log(value); // Handle the value change for space comparison
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="profile-card p-3">
            <div className="d-flex align-items-center">
              <img
                alt="Profile picture of La"
                height="80"
                src="https://storage.googleapis.com/a1aa/image/4XVljdW9f5xMWKe9XcKKE1RD3aUCBRikrC3HM2AY3B7KinnTA.jpg"
                width="80"
              />
              <div className="ms-3">
                <h5 className="mb-0">La</h5>
                <p className="text-muted mb-0">Chủ nhà/Người tổ chức</p>
              </div>
            </div>

            <div className="mt-3">
              <p className="mb-1"><strong>33</strong> Đánh giá</p>
              <p className="mb-1"><strong>4.64</strong> <i className="fas fa-star"></i> Xếp hạng</p>
              <p className="mb-0"><strong>5</strong> năm kinh nghiệm đón tiếp khách</p>
            </div>
          </div>
          <div className="verified-info">
            <h5>Thông tin đã được xác nhận của La</h5>
            <ul className="list-unstyled">
              <li><i className="fas fa-check-circle text-success"></i> Danh tính</li>
              <li><i className="fas fa-check-circle text-success"></i> Địa chỉ email</li>
              <li><i className="fas fa-check-circle text-success"></i> Số điện thoại</li>
            </ul>
            <a href="#">Tìm hiểu về quy trình xác minh danh tính</a>
          </div>

          <div className="report-section" onClick={handleReportClick}>
            <FlagFill className="flag-icon" />
            Báo cáo hồ sơ này
          </div>
        </div>

        <div className="col-md-8">
          <h2>Thông tin về La</h2>
          <p><i className="fas fa-globe"></i> Nói Tiếng Anh</p>
          <p><i className="fas fa-map-marker-alt"></i> Sống tại Hà Nội, Việt Nam</p>
          <p>Chăm sóc khách hàng 24/7. Cung cấp dịch vụ cho thuê dài hạn, đón khách tại sân bay, hỗ trợ khách hàng trong suốt thời gian lưu trú.</p>

          <h3>Đánh giá của La</h3>
          <div className="review-card">
            <p><i className="fas fa-quote-left"></i> Lavender là một chỗ nhà tuyệt vời...</p>
            <div className="d-flex align-items-center">
              <img
                alt="Profile picture of Ben"
                className="img-fluid me-2"
                height="50"
                src="https://storage.googleapis.com/a1aa/image/IeryZBYgtFVhaCgltDWtbSGa5evUVrrgLiG6o58H76TbZnnTA.jpg"
                width="50"
              />
              <div><strong>Ben</strong><p>Tháng 8 năm 2024</p></div>
            </div>
          </div>
          <a href="#">Xem tất cả 33 đánh giá</a>

          <h3>Mục cho thuê của La</h3>
          <div className="property-section">
            <div className="property-card">
              <img
                alt="House in Da Nang"
                className="img-fluid"
                height="200"
                src="https://storage.googleapis.com/a1aa/image/4gLnivVlZbJCFRpE0uYzolIPdEc1tNghwQua5q8fgx0sszzJA.jpg"
                width="300"
              />
              <p>Nhà ở Đà Nẵng 2 phòng ngủ</p>
            </div>
          </div>
          <a href="#">Xem tất cả 5 mục cho thuê</a>

          {visible && <Reports visible={visible} setVisible={setVisible} />}
          <Drawer
            anchor="bottom"
            open={openDrawer}
            onClose={toggleDrawer(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: '50vw',
                left: '25vw',
                right: 'auto',
              },
              zIndex: 1000,
            }}
          >
            {drawerContent()}
          </Drawer>

          {visibleCompare && (
            <SelectSpaceToCompare
              visibleCompare={visibleCompare}
              setVisibleCompare={setVisibleCompare}
              id="space-comparison"
              onValueChange={handleValueChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileOwner;
