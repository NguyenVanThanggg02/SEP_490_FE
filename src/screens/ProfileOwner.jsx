import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "../style/ProfileOwner.css";
import { FlagFill } from "react-bootstrap-icons";
import Drawer from "@mui/material/Drawer";
import Reports from "./Reports";
import SelectSpaceToCompare from "./SelectSpaceToCompare";

const ProfileOwner = ({ profileData, onReportSubmit, onMessageClick }) => {
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
      <h2>Báo cáo hồ sơ</h2>
      <p>Xin vui lòng điền thông tin báo cáo.</p>
      <textarea
        rows="4"
        className="form-control mb-3"
        placeholder="Nội dung báo cáo..."
      ></textarea>
      <button
        className="btn btn-danger"
        onClick={() => {
          onReportSubmit && onReportSubmit();
          setOpenDrawer(false);
        }}
      >
        Gửi báo cáo
      </button>
    </div>
  );

  const handleValueChange = (value) => {
    console.log(value); // Handle the value change for space comparison
  };

  const { name, role, image, reviews, rating, experience, verifiedInfo, properties, description } =
    profileData;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Panel */}
        <div className="col-md-4">
          <div className="profile-card p-3">
            <div className="d-flex align-items-center">
              <img
                alt={`Profile picture of ${name}`}
                height="80"
                src={image}
                width="80"
                className="rounded-circle border"
              />
              <div className="ms-3">
                <h5 className="mb-0">{name}</h5>
                <p className="text-muted mb-0">{role}</p>
                <button
                  className="btn btn-primary btn-sm mt-2"
                  onClick={onMessageClick}
                >
                  Nhắn tin
                </button>
              </div>
            </div>

            <div className="mt-3">
              <p className="mb-1">
                <strong>{reviews}</strong> Đánh giá
              </p>
              <p className="mb-1">
                <strong>{rating}</strong>{" "}
                <i className="fas fa-star text-warning"></i> Xếp hạng
              </p>
              <p className="mb-0">
                <strong>{experience}</strong> năm kinh nghiệm đón tiếp khách
              </p>
            </div>
          </div>
          <div className="verified-info mt-4">
            <h5>Thông tin đã được xác nhận</h5>
            <ul className="list-unstyled">
              {verifiedInfo.map((info, index) => (
                <li key={index}>
                  <i className="fas fa-check-circle text-success"></i> {info}
                </li>
              ))}
            </ul>
            <a href="#" className="text-primary">
              Tìm hiểu về quy trình xác minh danh tính
            </a>
          </div>

          <div
            className="report-section d-flex align-items-center mt-4"
            onClick={handleReportClick}
          >
            <FlagFill className="flag-icon me-2" />
            Báo cáo hồ sơ này
          </div>
        </div>

        {/* Right Panel */}
        <div className="col-md-8">
          <h2>Thông tin về {name}</h2>
          <p>{description}</p>

          <h3>Mục cho thuê của {name}</h3>
          <div className="property-section d-flex flex-wrap">
            {properties.map((property, index) => (
              <div className="property-card me-3 mb-3" key={index}>
                <img
                  alt={property.title}
                  className="img-fluid rounded"
                  height="200"
                  src={property.image}
                  width="300"
                />
                <p className="mt-2">{property.title}</p>
              </div>
            ))}
          </div>
          <a href="#" className="text-primary mt-2 d-block">
            Xem tất cả {properties.length} mục cho thuê
          </a>

          {/* Components */}
          {visible && <Reports visible={visible} setVisible={setVisible} />}
          <Drawer
            anchor="bottom"
            open={openDrawer}
            onClose={toggleDrawer(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: "50vw",
                left: "25vw",
                right: "auto",
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

ProfileOwner.propTypes = {
  profileData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    reviews: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    experience: PropTypes.number.isRequired,
    verifiedInfo: PropTypes.arrayOf(PropTypes.string).isRequired,
    properties: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
      })
    ).isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onReportSubmit: PropTypes.func,
  onMessageClick: PropTypes.func,
};

export default ProfileOwner;
