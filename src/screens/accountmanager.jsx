import React from "react";
import "../style/accountmanager.css";

const AccountManager = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src="https://storage.googleapis.com/a1aa/image/mrqiJfcZ6FVEHa4vCcrAjFkrZO1vRJv2IUf6yYk9fecKO0fdC.jpg"
              alt="Airbnb logo"
              width="30"
              height="30"
            />
          </a>
          <div className="d-flex align-items-center">
            <a className="nav-link" href="#">Cho thuê chỗ ở qua SpaceHub</a>
            <a className="nav-link" href="#"><FontAwesomeIcon icon="globe" /></a>
            <a className="nav-link" href="#"><FontAwesomeIcon icon="bars" /></a>
            <a className="nav-link" href="#"><FontAwesomeIcon icon="user-circle" /></a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="container py-4">
        <div className="account-header bg-primary text-white p-4 rounded shadow">
          <h1 className="mb-2">Tài khoản</h1>
          <p>
            Hoà, anhviphuong456@gmail.com · <a href="#" className="text-white text-decoration-underline">Truy cập hồ sơ</a>
          </p>
        </div>

        {/* Account Cards */}
        <div className="row mt-4 gy-4">
          <AccountCard
            icon={faAddressCard}
            title="Thông tin cá nhân"
            text="Cung cấp thông tin cá nhân và cách chúng tôi có thể liên hệ với bạn"
          />
          <AccountCard
            icon={faShieldAlt}
            title="Đăng nhập và bảo mật"
            text="Cập nhật mật khẩu và bảo mật tài khoản của bạn"
          />
          <AccountCard
            icon={faWallet}
            title="Thanh toán và chi trả"
            text="Xem lại các khoản thanh toán, chi trả, phiếu giảm giá và thẻ quà tặng"
          />
          <AccountCard
            icon={faFileAlt}
            title="Thuế"
            text="Quản lý thông tin người nộp thuế và chứng từ thuế"
          />
          <AccountCard
            icon={faBell}
            title="Thông báo"
            text="Chọn tùy chọn thông báo và cách bạn muốn được liên hệ"
          />
          <AccountCard
            icon={faEye}
            title="Quyền riêng tư và chia sẻ"
            text="Quản lý dữ liệu cá nhân, các dịch vụ được kết nối và chế độ cài đặt chia sẻ dữ liệu của bạn"
          />
          <AccountCard
            icon={faSlidersH}
            title="Lựa chọn chung"
            text="Đặt ngôn ngữ, loại tiền tệ và múi giờ mặc định của bạn"
          />
          <AccountCard
            icon={faBriefcase}
            title="Đi công tác"
            text="Thêm email công việc để hưởng các lợi ích cho chuyến đi công tác"
          />
          <AccountCard
            icon={faChartBar}
            title="Các công cụ đón tiếp khách chuyên nghiệp"
            text="Nhận các công cụ chuyên nghiệp nếu bạn quản lý một số chỗ ở trên SpaceHub"
          />
        </div>
      </div>
    </div>
  );
};

const AccountCard = ({ icon, title, text }) => (
  <div className="col-md-4">
    <div className="card shadow-sm border-0 rounded">
      <div className="card-body d-flex align-items-start">
        <FontAwesomeIcon icon={icon} className="icon me-3 text-primary fs-3" />
        <div>
          <h5 className="card-title fw-bold">{title}</h5>
          <p className="card-text text-muted">{text}</p>
        </div>
      </div>
    </div>
  </div>
);

export default AccountManager;
