import React from 'react';
import "../style/BookingConfirm.css";
const BookingConfirmation = () => {
  return (
    <div className="container2">
      <div className="row">
        <div className="col-md-7">
          <div className="card">
            <div className="card-header">Xác nhận và thanh toán</div>
            <div className="card-body">
              <div className="mb-3">
                <h6>Chuyến đi của bạn</h6>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="mb-0">Ngày</p>
                    <p className="text-muted">Ngày 27 tháng 10 - Ngày 01 tháng 11</p>
                  </div>
                  <a className="text-primary" href="#">Chỉnh sửa</a>
                </div>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="mb-0">Khách</p>
                    <p className="text-muted">1 khách</p>
                  </div>
                  <a className="text-primary" href="#">Chỉnh sửa</a>
                </div>
              </div>
              <div className="mb-3">
                <h6>Thanh toán bằng</h6>
                <div className="input-group mb-3">
                  <select className="form-select">
                    <option selected>Thẻ tín dụng hoặc thẻ ghi nợ</option>
                  </select>
                  <span className="input-group-text">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                  </span>
                </div>
                <div className="mb-3">
                  <input className="form-control" placeholder="Số thẻ" type="text" />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input className="form-control" placeholder="Ngày hết hạn" type="text" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input className="form-control" placeholder="CVV" type="text" />
                  </div>
                </div>
                <div className="mb-3">
                  <input className="form-control" placeholder="Mã bưu chính" type="text" />
                </div>
                <div className="mb-3">
                  <select className="form-select">
                    <option selected>Việt Nam</option>
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <h6>Bắt buộc cho chuyến đi của bạn</h6>
                <div className="d-flex justify-content-between">
                  <input className="form-control" placeholder="Số điện thoại" type="text" />
                  <button className="btn btn-outline-secondary">Thêm</button>
                </div>
              </div>
              <div className="mb-3">
                <h6>Chính sách hủy</h6>
                <p className="text-muted">
                  Hủy miễn phí trước 26 thg 10. Bạn được hoàn tiền một phần nếu hủy trước khi nhận phòng vào 27 thg 10.
                  <a className="text-primary" href="#">Tìm hiểu thêm</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card">
            <div className="card-body">
              <div className="d-flex">
                <img
                  alt="Image of a cabin by the stream"
                  height="100"
                  src="https://storage.googleapis.com/a1aa/image/5AKu3oNMuHoUI9Af4f1a5CccU4sXzVQ21ZwfObuvjS30WRPnA.jpg"
                  width="100"
                />
                <div className="ms-3">
                  <h6 className="card-title">Samma Stay Tam Đảo - Cabin bên suối</h6>
                  <p className="card-text">Toàn bộ cabin</p>
                  <p className="card-text">
                    <i className="fas fa-star"></i>
                    4.92 (12 đánh giá) · Chủ nhà siêu cấp
                  </p>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <p className="mb-0">đ 790.000 x 5 đêm</p>
                <p className="mb-0">đ 8.950.000</p>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <p className="mb-0">Tổng (VND)</p>
                <p className="mb-0">đ 8.950.000</p>
              </div>
              <hr />
              <h6>Quy chuẩn chung</h6>
              <p className="text-muted">
                Chúng tôi yêu cầu tất cả khách phải ghi nhớ một số quy chuẩn đơn giản để đảm bảo chuyến đi của bạn được vui vẻ.
              </p>
              <ul className="text-muted">
                <li>Lưu trữ nhà của bạn</li>
                <li>Giữ gìn ngôi nhà như thể đó là nhà bạn</li>
              </ul>
              <button className="btn btn-primary w-100">Xác nhận và thanh toán</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
