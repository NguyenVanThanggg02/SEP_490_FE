import React from 'react';
import "../style/ProfileOwner.css";
import { FlagFill } from "react-bootstrap-icons";

const ProfileOwner = () => {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <div className="profile-card p-3 position-relative">
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
              <p className="mb-1">
                <strong>33</strong> Đánh giá
              </p>
              <p className="mb-1">
                <strong>4.64</strong> <i className="fas fa-star"></i> Xếp hạng
              </p>
              <p className="mb-0">
                <strong>5</strong> năm kinh nghiệm đón tiếp khách
              </p>
            </div>
          </div>
          <div className="verified-info">
            <h5>Thông tin đã được xác nhận của La</h5>
            <ul className="list-unstyled">
              <li>
                <i className="fas fa-check-circle text-success"></i> Danh tính
              </li>
              <li>
                <i className="fas fa-check-circle text-success"></i> Địa chỉ email
              </li>
              <li>
                <i className="fas fa-check-circle text-success"></i> Số điện thoại
              </li>
            </ul>
            <a href="#">Tìm hiểu về quy trình xác minh danh tính</a>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            cursor: "pointer",
          }}
          >
            <FlagFill
              style={{
                color: "gray",
                marginRight: "15px",
                marginTop: "6px",
              }}
            />
            Báo cáo hồ sơ này
          </div>
        </div>
        <div className="col-md-8">
          <h2>Thông tin về La</h2>
          <p>
            <i className="fas fa-globe"></i> Nói Tiếng Anh
          </p>
          <p>
            <i className="fas fa-map-marker-alt"></i> Sống tại Hà Nội, Việt Nam
          </p>
          <p>
            Chăm sóc khách hàng 24/7. Cung cấp dịch vụ cho thuê dài hạn đầy đủ, đón khách tại sân bay, hỗ trợ khách hàng trong suốt thời gian lưu trú.
          </p>
          <h3>Đánh giá của La</h3>
          <div className="row">
            <div className="col-md-6">
              <div className="review-card">
                <p>
                  <i className="fas fa-quote-left"></i> Lavender is một chỗ nhà tuyệt vời. Chủ nhà rất nhiệt tình và chu đáo. Nhà sạch sẽ, đầy đủ tiện nghi, có bếp nấu ăn, có bãi đậu xe rộng rãi, an toàn. Cả gia đình tôi đã có một kỳ nghỉ tuyệt vời tại đây. Hy vọng sẽ quay lại.
                </p>
                <div className="d-flex align-items-center">
                  <img
                    alt="Profile picture of Ben"
                    className="img-fluid me-2"
                    height="50"
                    src="https://storage.googleapis.com/a1aa/image/IeryZBYgtFVhaCgltDWtbSGa5evUVrrgLiG6o58H76TbZnnTA.jpg"
                    width="50"
                  />
                  <div>
                    <strong>Ben</strong>
                    <p>Tháng 8 năm 2024</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="review-card">
                <p>
                  <i className="fas fa-quote-left"></i> Tuyệt vời <i className="fas fa-heart text-danger"></i>
                </p>
                <div className="d-flex align-items-center">
                  <img
                    alt="Profile picture of Trang"
                    className="img-fluid me-2"
                    height="50"
                    src="https://storage.googleapis.com/a1aa/image/Ak8Xjx0T5paYKB1bsekFqBrnu9n1BUzkT6VAnJuegbHSZnnTA.jpg"
                    width="50"
                  />
                  <div>
                    <strong>Trang</strong>
                    <p>Tháng 7 năm 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href="#">Xem tất cả 33 đánh giá</a>
          <h3>Mục cho thuê của La</h3>
          <div className="row">
            <div className="col-md-4">
              <div className="property-card">
                <img
                  alt="Image of a house in Da Nang with 2 bedrooms"
                  className="img-fluid"
                  height="200"
                  src="https://storage.googleapis.com/a1aa/image/4gLnivVlZbJCFRpE0uYzolIPdEc1tNghwQua5q8fgx0sszzJA.jpg"
                  width="300"
                />
                <p>Nhà ở Đà Nẵng 2 phòng ngủ</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="property-card">
                <img
                  alt="Image of a house in Nha Trang with a garden and a swimming pool"
                  className="img-fluid"
                  height="200"
                  src="https://storage.googleapis.com/a1aa/image/CDfaW04OChy4UST7we5gGW42qyQyVhiqeVN13yy7IeDSldecC.jpg"
                  width="300"
                />
                <p>Nhà ở Nha Trang (có vườn và bể bơi)</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="property-card">
                <img
                  alt="Image of a house in Hoi An with a view of the sea"
                  className="img-fluid"
                  height="200"
                  src="https://storage.googleapis.com/a1aa/image/NjirTwndgCphERaK8jrGQVmsfAQlDFPFYnHfPDIDcJ0cZnnTA.jpg"
                  width="300"
                />
                <p>Nhà ở Hội An (có view biển)</p>
              </div>
            </div>
          </div>
          <a href="#">Xem tất cả 5 mục cho thuê</a>
          <h3>Sách hướng dẫn của La</h3>
          <div className="row">
            <div className="col-md-4">
              <div className="guide-card">
                <img
                  alt="Image of a guidebook about Hanoi"
                  className="img-fluid"
                  height="200"
                  src="https://storage.googleapis.com/a1aa/image/GkbhUdYSGpZRPJ7RaHyFQ2HbSUdzKURQa0Uez9yPYbxrszzJA.jpg"
                  width="300"
                />
                <p>Sách hướng dẫn của La</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="guide-card">
                <img
                  alt="Image of a guidebook about Da Nang"
                  className="img-fluid"
                  height="200"
                  src="https://storage.googleapis.com/a1aa/image/Cdmcze9P0G3WSC8sSfWC8B7rUBOh57rgmzH6xV417SReyOPnA.jpg"
                  width="300"
                />
                <p>Sách hướng dẫn của La</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="guide-card">
                <img
                  alt="Image of a guidebook about Hoi An"
                  className="img-fluid"
                  height="200"
                  src="https://storage.googleapis.com/a1aa/image/HZaxwMqQtpLCItWaOUnWx3tbwzwvgxmd2fZTAtcJcn1qszzJA.jpg"
                  width="300"
                />
                <p>Sách hướng dẫn của La</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOwner;
