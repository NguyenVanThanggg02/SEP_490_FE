import React from 'react';
import '../style/CancellationPolicy.css';

const CancellationPolicy = () => {
  return (
    <div className="container">
      <div className="header">Chính sách hủy</div>
      <div className="subheader">
        Đảm bảo chính sách của Chủ nhà/Người tổ chức này phù hợp với bạn. Trong một số trường hợp hiếm hữu, bạn có thể đủ điều kiện được hoàn tiền ngoài chính sách này, theo{" "}
        <a href="#">Chính sách sự kiện lớn gây gián đoạn của Airbnb</a>.
      </div>
      <div className="policy-section">
        <div className="row">
          <div className="col-4">Trước</div>
          <div className="col-8">Hoàn tiền đầy đủ</div>
        </div>
        <div className="row">
          <div className="col-4">13 thg 1 14:00</div>
          <div className="col-8">Nhận lại 100% số tiền bạn đã thanh toán.</div>
        </div>
      </div>
      <div className="policy-section">
        <div className="row">
          <div className="col-4">Trước</div>
          <div className="col-8">Hoàn tiền một phần</div>
        </div>
        <div className="row">
          <div className="col-4">14 thg 1 14:00</div>
          <div className="col-8">Nhận tiền hoàn lại cho tất cả các đêm, ngoại trừ đêm đầu tiên. Không được hoàn lại phí dịch vụ hoặc chi phí cho đêm đầu tiên.</div>
        </div>
      </div>
      <div className="footer">
        Bạn sẽ được hoàn phí vệ sinh nếu hủy trước khi nhận phòng.<br />
        <a href="#">Tìm hiểu thêm về các chính sách hủy</a>
      </div>
    </div>
  );
};

export default CancellationPolicy;
