import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

const App = () => {
  return (
    <Row>
      <Col md={11} className="mx-auto">
        <div className="content-container">
          <h1 className="main-heading">Nạp tiền bằng quét mã QR</h1>

          <div className="table-container-left">
            <table className="styled-table">
              <tbody>
                <tr>
                  <th>Ngân hàng</th>
                  <td>NGAN HANG TMCP A CHAU (ACB)</td>
                  <td rowSpan="3" className="qr-cell">
                    <img
                      src="https://storage.googleapis.com/a1aa/image/zjECoHXmYCavLpk8ELb76nRrRuKlb68cth0rrfe72z3dShnTA.jpg"
                      alt="QR code for payment"
                      className="qr-image"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Số tài khoản</th>
                  <td>
                    17507461 <i className="fa fa-copy copy-icon"></i>
                  </td>
                </tr>
                <tr>
                  <th>Tên tài khoản</th>
                  <td>NGUYEN THANH THAO</td>
                </tr>
                <tr>
                  <th>Nội dung thanh toán</th>
                  <td colSpan="2">doithecao anthinhdz1 tk</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="table-container-right">
            <table className="styled-table">
              <tbody>
                <tr>
                  <th colSpan="2">Hạn mức và phí:</th>
                </tr>
                <tr>
                  <td>Tổng hạn mức ngày</td>
                  <td>200,000,000 VND</td>
                </tr>
                <tr>
                  <td>Số tiền tối thiểu</td>
                  <td>5,000 VND</td>
                </tr>
                <tr>
                  <td>Số tiền tối đa</td>
                  <td>30,000,000 VND</td>
                </tr>
                <tr>
                  <th colSpan="2">Cổng thanh toán</th>
                </tr>
                <tr>
                  <td>Ngân hàng ACB</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="clearfix"></div>

          <p className="note-text">
            Bạn hãy chuyển tiền với nội dung bên trên vào một trong các số tài khoản
            dưới đây. Lưu ý số tiền chuyển không được lớn hơn hạn mức cho phép.
            Giao dịch sẽ được hoàn thành trong vòng 1-2 phút.
          </p>

          <h2 className="history-heading">Lịch sử nạp tiền</h2>
          <table className="styled-table full-width">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Nạp vào quỹ</th>
                <th>Số tiền</th>
                <th>Cổng thanh toán</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {/* Add rows dynamically if needed */}
            </tbody>
          </table>
        </div>
      </Col>
    </Row>
  );
};

// CSS Modules or Scoped Styles (Preferred Approach for Cleaner Code)
const styles = `
  .content-container {
    margin: 20px;
    font-family: Arial, sans-serif;
  }

  .main-heading {
    color: #007bff;
    margin-bottom: 20px;
  }

  .table-container-left,
  .table-container-right {
    width: 48%;
    display: inline-block;
    vertical-align: top;
  }

  .table-container-left {
    float: left;
  }

  .table-container-right {
    float: right;
  }

  .styled-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .styled-table th,
  .styled-table td {
    padding: 15px;
    text-align: left;
    color: #555;
    border-bottom: 1px solid #ddd;
  }

  .styled-table th {
    background-color: #f7f7f7;
    font-weight: bold;
    color: #333;
  }

  .qr-image {
    width: 150px;
    height: 150px;
    border-radius: 12px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .copy-icon {
    margin-left: 5px;
    cursor: pointer;
    color: #007bff;
  }

  .note-text {
    margin-top: 20px;
    font-size: 14px;
    color: #555;
  }

  .history-heading {
    font-size: 24px;
    margin-bottom: 15px;
    color: #007bff;
  }

  .clearfix {
    clear: both;
  }
`;

// Inject styles dynamically into the page for demonstration purposes
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default App;
