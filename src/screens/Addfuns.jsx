import React from 'react';
import { Container,Col,Row } from 'react-bootstrap';

const App = () => {
    return (
            <Row>
                <Col md={11} style={{margin:"0 auto"}}>

                    <div style={{ margin: '20px', fontFamily: 'Arial, sans-serif' }}>
                        <h1>Nạp tiền bằng quét mã QR</h1>
                        <div style={{ width: '60%', float: 'left' }}>
                            <table style={tableStyle}>
                                <tbody>
                                    <tr>
                                        <th>Ngân hàng</th>
                                        <td>NGAN HANG TMCP A CHAU (ACB)</td>
                                        <td rowSpan="3" style={{ textAlign: 'center' }}>
                                            <img
                                                src="https://storage.googleapis.com/a1aa/image/zjECoHXmYCavLpk8ELb76nRrRuKlb68cth0rrfe72z3dShnTA.jpg"
                                                alt="QR code for payment"
                                                style={{ width: '150px', height: '150px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Số tài khoản</th>
                                        <td>
                                            17507461
                                            <i className="fa fa-copy"></i>
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

                        <div style={{ width: '35%', float: 'right' }}>
                            <table style={tableStyle}>
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

                        <div style={{ clear: 'both' }}></div>

                        <p style={{ marginTop: '20px', fontSize: '14px' }}>
                            Bạn hãy chuyển tiền với nội dung bên trên vào một trong các số tài khoản
                            dưới đây. Lưu ý số tiền chuyển không được lớn hơn hạn mức cho phép.
                            Giao dịch sẽ được hoàn thành trong vòng 1-2 phút.
                        </p>

                        <h2>Lịch sử nạp tiền</h2>
                        <table style={{ ...tableStyle, width: '100%' }} className="history-table">
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
    borderCollapse: 'collapse',
    marginBottom: '20px',
    border: '1px solid #ddd',
};

export default App;