import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';

const App = () => {
  return (
    <Row>
      <Col md={11} style={{ margin: '0 auto' }}>
        <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
          <h1 style={{ color: '#007bff', marginBottom: '20px' }}>Nạp tiền bằng quét mã QR</h1>

          <div style={{ width: '60%', float: 'left' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th style={thStyle}>Ngân hàng</th>
                  <td style={tdStyle}>NGAN HANG TMCP A CHAU (ACB)</td>
                  <td rowSpan="3" style={{ textAlign: 'center' }}>
                    <img
                      src="https://storage.googleapis.com/a1aa/image/zjECoHXmYCavLpk8ELb76nRrRuKlb68cth0rrfe72z3dShnTA.jpg"
                      alt="QR code for payment"
                      style={imgStyle}
                    />
                  </td>
                </tr>
                <tr>
                  <th style={thStyle}>Số tài khoản</th>
                  <td style={tdStyle}>
                    17507461 <i className="fa fa-copy" style={iconStyle}></i>
                  </td>
                </tr>
                <tr>
                  <th style={thStyle}>Tên tài khoản</th>
                  <td style={tdStyle}>NGUYEN THANH THAO</td>
                </tr>
                <tr>
                  <th style={thStyle}>Nội dung thanh toán</th>
                  <td colSpan="2" style={tdStyle}>doithecao anthinhdz1 tk</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ width: '35%', float: 'right' }}>
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <th colSpan="2" style={thStyle}>Hạn mức và phí:</th>
                </tr>
                <tr>
                  <td style={tdStyle}>Tổng hạn mức ngày</td>
                  <td style={tdStyle}>200,000,000 VND</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Số tiền tối thiểu</td>
                  <td style={tdStyle}>5,000 VND</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Số tiền tối đa</td>
                  <td style={tdStyle}>30,000,000 VND</td>
                </tr>
                <tr>
                  <th colSpan="2" style={thStyle}>Cổng thanh toán</th>
                </tr>
                <tr>
                  <td style={tdStyle}>Ngân hàng ACB</td>
                  <td style={tdStyle}></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ clear: 'both' }}></div>

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
            Bạn hãy chuyển tiền với nội dung bên trên vào một trong các số tài khoản
            dưới đây. Lưu ý số tiền chuyển không được lớn hơn hạn mức cho phép.
            Giao dịch sẽ được hoàn thành trong vòng 1-2 phút.
          </p>

          <h2 style={{ fontSize: '24px', marginBottom: '15px', color: '#007bff' }}>Lịch sử nạp tiền</h2>
          <table style={{ ...tableStyle, width: '100%' }} className="history-table">
            <thead>
              <tr>
                <th style={thStyle}>Mã đơn</th>
                <th style={thStyle}>Nạp vào quỹ</th>
                <th style={thStyle}>Số tiền</th>
                <th style={thStyle}>Cổng thanh toán</th>
                <th style={thStyle}>Ngày tạo</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {/* Add rows here dynamically if needed */}
            </tbody>
          </table>
        </div>
      </Col>
    </Row>
  );
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0',
  marginBottom: '20px',
  border: '1px solid #ddd',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
};

const thStyle = {
  backgroundColor: '#f7f7f7',
  padding: '15px',
  textAlign: 'left',
  fontWeight: 'bold',
  color: '#333',
  borderBottom: '1px solid #ddd',
};

const tdStyle = {
  padding: '15px',
  color: '#555',
  borderBottom: '1px solid #ddd',
  textAlign: 'left',
};

const imgStyle = {
  width: '150px',
  height: '150px',
  borderRadius: '12px',
  border: '1px solid #ddd',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const iconStyle = {
  marginLeft: '5px',
  cursor: 'pointer',
  color: '#007bff',
};

export default App;
