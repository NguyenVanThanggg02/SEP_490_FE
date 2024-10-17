import React from 'react';

// Tạo Component Container
const Container = ({ children, style }) => {
    const containerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        ...style,
    };
    
    return <div style={containerStyle}>{children}</div>;
};

const Addfuns = () => {

    // Inline Styles
    const containerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        gap: '20px',
        margin: '20px',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
        border: '1px solid #ddd',
    };

    const leftSectionStyle = {
        flex: '1 1 60%',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    };

    const rightSectionStyle = {
        flex: '1 1 35%',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    };

    const qrCodeStyle = {
        width: '150px',
        height: '150px',
        margin: '0 auto',
        display: 'block',
    };

    const headingStyle = {
        color: '#333'
    };

    const paragraphStyle = {
        textAlign: 'center',
        fontSize: '14px',
        color: '#666',
        marginTop: '20px',
    };

    const tableHeaderStyle = {
        backgroundColor: '#007bff',
        color: '#fff',
        textAlign: 'center',
    };

    const tableRowHoverStyle = {
        cursor: 'pointer',
        backgroundColor: '#e0e0e0',
    };

    return (
        <Container>
            <h1 style={headingStyle}>Nạp tiền bằng quét mã QR</h1>

            <div style={containerStyle}>
                <div style={leftSectionStyle}>
                    <table style={tableStyle}>
                        <tbody>
                            <tr>
                                <th>Ngân hàng</th>
                                <td>NGAN HANG TMCP A CHAU (ACB)</td>
                                <td rowSpan="3" style={{ textAlign: 'center' }}>
                                    <img
                                        src="https://storage.googleapis.com/a1aa/image/zjECoHXmYCavLpk8ELb76nRrRuKlb68cth0rrfe72z3dShnTA.jpg"
                                        alt="QR code for payment"
                                        style={qrCodeStyle}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>Số tài khoản</th>
                                <td>
                                    17507461
                                    <i className="fa fa-copy" style={{ marginLeft: '8px', color: '#007bff', cursor: 'pointer' }}></i>
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

                <div style={rightSectionStyle}>
                    <h2 style={headingStyle}>Hạn mức và phí:</h2>
                    <table style={tableStyle}>
                        <tbody>
                            <tr>
                                <th colSpan="2" style={tableHeaderStyle}>Hạn mức và phí:</th>
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
                                <th colSpan="2" style={tableHeaderStyle}>Cổng thanh toán</th>
                            </tr>
                            <tr>
                                <td>Ngân hàng ACB</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <p style={paragraphStyle}>
                Bạn hãy chuyển tiền với nội dung bên trên vào một trong các số tài khoản
                dưới đây. Lưu ý số tiền chuyển không được lớn hơn hạn mức cho phép.
                Giao dịch sẽ được hoàn thành trong vòng 1-2 phút.
            </p>

            <h2 style={headingStyle}>Lịch sử nạp tiền</h2>
            <table style={{ ...tableStyle, width: '100%' }} className="history-table">
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>Mã đơn</th>
                        <th style={tableHeaderStyle}>Nạp vào quỹ</th>
                        <th style={tableHeaderStyle}>Số tiền</th>
                        <th style={tableHeaderStyle}>Cổng thanh toán</th>
                        <th style={tableHeaderStyle}>Ngày tạo</th>
                        <th style={tableHeaderStyle}>Trạng thái</th>
                        <th style={tableHeaderStyle}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Add rows dynamically here if needed */}
                </tbody>
            </table>
        </Container>
    );
};

export default Addfuns;
