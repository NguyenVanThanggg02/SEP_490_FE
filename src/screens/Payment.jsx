import React, { useState } from "react";
import "../style/Payment.css";
import { Container } from "react-bootstrap";
import Calendar from "./Calendar";
import { Pen } from "react-bootstrap-icons";

const Payment = () => {
  const [visible, setVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("0");

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <Container className="containerpay2">
      <div className="row rowbody ">
        <div className="col-md-7">
          <div className="card card1">
            <div className="card-header">
              <h5
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Xác nhận và thanh toán
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h6
                  style={{
                    fontWeight: "bold",
                    fontSize: "17px",
                  }}
                >
                  Chuyến đi của bạn
                </h6>
                <div className="d-flex justify-content-between">
                  <div>
                    <p
                      className="mb-0"
                      style={{
                        fontWeight: "bold",
                      }}
                    >
                      Ngày
                    </p>
                    <p className="text-muted">
                      Ngày 27 tháng 10 - Ngày 01 tháng 11
                    </p>
                  </div>
                  <p
                    onClick={() => setVisible(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <Pen style={{fontSize:'20px'}} />
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <h6
                  style={{
                    fontWeight: "bold",
                    fontSize: "17px",
                  }}
                >
                  Thanh toán bằng
                </h6>
                <div className="input-group mb-3">
                  <select
                    className="form-select"
                    onChange={handlePaymentMethodChange}
                  >
                    <option value="0">Thẻ tín dụng hoặc thẻ ghi nợ</option>
                    <option value="1">MOMO</option>
                  </select>
                  <span className="input-group-text">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                  </span>
                </div>
                {paymentMethod === "0" && (
                  <>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        placeholder="Số thẻ"
                        type="text"
                      />
                    </div>
                    <div className="row rowbody">
                      <div className="col-md-6 mb-3">
                        <input
                          className="form-control"
                          placeholder="Ngày hết hạn"
                          type="text"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <input
                          className="form-control"
                          placeholder="CVV"
                          type="text"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        placeholder="Mã bưu chính"
                        type="text"
                      />
                    </div>
                    <div className="mb-3">
                      <select className="form-select">
                        <option selected>Việt Nam</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="mb-3">
                <h6>Bắt buộc cho chuyến đi của bạn</h6>
                <div className="d-flex justify-content-between">
                  <input
                    className="form-control"
                    placeholder="Số điện thoại"
                    type="text"
                  />
                  <button className="btn btn-outline-secondary">Thêm</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="card cardpay1">
            <div className="card-body">
              <div className="d-flex">
                <img
                  alt="Image of a cabin by the stream"
                  height="100"
                  src="https://storage.googleapis.com/a1aa/image/5AKu3oNMuHoUI9Af4f1a5CccU4sXzVQ21ZwfObuvjS30WRPnA.jpg"
                  width="100"
                />
                <div className="ms-3">
                  <h6 className="card-title">
                    Samma Stay Tam Đảo - Cabin bên suối
                  </h6>
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
                <p
                  className="mb-0"
                  style={{
                    fontWeight: "bold",
                    fontSize: "17px",
                  }}
                >
                  Tổng (VND)
                </p>
                <p className="mb-0">đ 8.950.000</p>
              </div>
              <div>
                <button className="btn btn-danger w-100 mt-4">
                  Xác nhận và thanh toán
                </button>
              </div>
            </div>
          </div>
          <div className="card mt-2">
            <div className="card-body">
              <h5
                style={{
                  paddingTop: "20px",
                  paddingLeft: "20px",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                Quy chuẩn chung
              </h5>
              <hr />
              <p className="text-muted" style={{ paddingLeft: "20px" }}>
                Chúng tôi yêu cầu tất cả khách phải ghi nhớ một số quy chuẩn đơn
                giản để đảm bảo chuyến đi của bạn được vui vẻ.
              </p>
              <ul className="text-muted" style={{ paddingLeft: "40px" }}>
                <li>Lưu trữ nhà của bạn</li>
                <li>Giữ gìn ngôi nhà như thể đó là nhà bạn</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {visible && <Calendar visible={visible} setVisible={setVisible} />}
    </Container>
  );
};

export default Payment;
