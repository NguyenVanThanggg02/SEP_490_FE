import React from "react";
import "../style/blog.css";

const Blog = () => {
    return (
        <div className="container">
            <div className=" title1">
                Văn phòng &amp; Study Working
            </div>
            <div className="row featured-article">
                <div className="col-md-6">
                    <img
                        alt="Office space with people interacting and working"
                        className="img-fluid"
                        height="600"
                        src="https://storage.googleapis.com/a1aa/image/F2rcMrRTjdLmLhtGJTeom5HVI9X0I1ew6DiA9Dh0BSYxkWpTA.jpg"
                        width="800"
                    />
                </div> 
                <div className="col-md-6" style={{margin:'auto',paddingLeft:'20px'}}>
                    {/* <p className="text-muted">
                        Featured Article
                    </p>
                    <p className="text-muted">
                        17 Sep 2024 • 5 minutes read
                    </p> */}
                    <h2>
                        SPACEHUB
                    </h2>
                    <p>
                        là điểm đến lý tưởng cho các cá nhân và doanh nghiệp đang tìm kiếm không gian làm việc chuyên nghiệp, sáng tạo và đầy cảm hứng. Tại đây, chúng tôi cung cấp những giải pháp không gian đa dạng, phù hợp với nhu cầu của từng khách hàng, từ những freelancer, nhóm khởi nghiệp nhỏ đến các doanh nghiệp đang phát triển. Không chỉ là nơi để làm việc, SPACEHUB còn mang đến một môi trường cộng tác sôi động, nơi mà ý tưởng được kết nối, sáng tạo thăng hoa, và sự đổi mới trở thành cốt lõi trong mọi hoạt động.
                        Với thiết kế hiện đại, không gian linh hoạt, cùng các tiện ích như phòng họp, khu vực thư giãn, internet tốc độ cao và nhiều dịch vụ hỗ trợ khác, SPACEHUB giúp khách hàng tập trung vào công việc và phát huy tối đa năng suất. Chúng tôi tạo điều kiện để bạn không chỉ làm việc mà còn phát triển sự nghiệp và kết nối với cộng đồng chuyên nghiệp, sáng tạo.
                    </p>
                </div>
            </div>

            <div className="floating-buttons">
                <button className="btn">
                    <i className="fas fa-comments"></i>
                </button>
            </div>


            <div className="container containerblog">
                <div className="title2">Địa điểm làm việc lý tưởng để tối ưu công việc</div>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card text-center cardblog">
                            <div className="card-icon">
                                <i className="fas fa-map-marker-alt"></i>
                            </div>
                            <div className="card-title">Vị trí đắc địa</div>
                            <div className="card-text">
                            SPACEHUB nằm ở các điểm chiến lược, cung cấp sự lựa chọn linh hoạt cho mọi nhu cầu làm việc.
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-center cardblog">
                            <div className="card-icon">
                                <i className="fas fa-th-large"></i>
                            </div>
                            <div className="card-title">Thiết kế</div>
                            <div className="card-text">
                                Phong cách hiện đại và cổ điển, tối ưu ánh sáng tự nhiên, tăng cảm hứng sáng tạo
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-center cardblog">
                            <div className="card-icon">
                                <i className="fas fa-clock"></i>
                            </div>
                            <div className="card-title">Mở cửa 24/7</div>
                            <div className="card-text">
                                Thời gian làm việc 24/7 với hệ thống cửa từ an ninh và đội ngũ bảo vệ
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-center cardblog">
                            <div className="card-icon">
                                <i className="fas fa-paper-plane"></i>
                            </div>
                            <div className="card-title">Internet tốc độ cao</div>
                            <div className="card-text">
                                Đường truyền cáp quang tốc độ cao và luôn ổn định.
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-center cardblog">
                            <div className="card-icon">
                                <i className="fas fa-handshake"></i>
                            </div>
                            <div className="card-title">Cộng đồng Văn minh</div>
                            <div className="card-text">
                                Cơ hội gặp gỡ và giao lưu kết bạn cùng mọi người thuê.
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card text-center cardblog">
                            <div className="card-icon">
                                <i className="fas fa-box"></i>
                            </div>
                            <div className="card-title">Dịch vụ Trọn gói</div>
                            <div className="card-text">
                                Giá đã bao gồm chi phí cố định cho tất cả các dịch vụ, bao gồm: wifi, điện, nước, điều hòa...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Blog;