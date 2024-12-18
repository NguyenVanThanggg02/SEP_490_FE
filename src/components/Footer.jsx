import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Facebook, Instagram, TwitterX } from 'react-bootstrap-icons';
import LogoV2 from "../assets/images/newlogo.png";

const Footer = () => {
    return (
        <footer className="text-center text-lg-start" style={{ backgroundColor: '#6c757d', marginTop: '20px'}}>
            <Container style={{marginBottom:'-45px'}}>
                <Row className="my-4">
                    <Col className="footer-column" style={{ textAlign: "left" }}>
                        <Link to={"/"}>
                            <img
                                src={LogoV2}
                                style={{ height: "300px", width: "auto", marginRight: "20px" }}
                                alt="logo"
                            />
                        </Link>
                    </Col>
                    <Col className="footer-column" style={{ textAlign: "left" }}>
                        <div className="d-flex align-items-start">
                            <div>
                                <p className="text-start" style={{ color: '#000', fontSize: '18px' }}>
                                    Space Hub cung cấp dịch vụ kết nối giữa người thuê và chủ sở hữu không gian làm việc, phòng họp, đảm bảo trải nghiệm thuê chuyên nghiệp và tiện lợi.
                                </p>
                            </div>
                        </div>
                    </Col>

                    <Col className="footer-column" style={{ textAlign: "left" }}>
                        <h5 className="text-uppercase" style={{ color: '#000' }}>Dịch Vụ</h5>
                        <ul className="list-unstyled" style={{ paddingLeft: 0,  }}>
                            <li className="mb-2">
                                <Link to="#!" className="text-dark d-flex align-items-center" style={{ color: '#000', fontWeight: 'bold', textDecoration:'none' }}>
                                    <i className="bi bi-brightness-high"></i>Cho thuê không gian làm việc
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="#!" className="text-dark d-flex align-items-center" style={{ color: '#000', fontWeight: 'bold',textDecoration:'none' }}>
                                    <i className="bi bi-brightness-high"></i> Phòng họp tiện nghi
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col className="footer-column" style={{ textAlign: "left" }}>
                        <h5 className="text-uppercase" style={{ color: '#000' }}>TRUY CẬP</h5>
                        <ul className="list-unstyled" style={{ paddingLeft: 0 }}>
                            <li className="mb-2">
                                <Link to="#!" className="text-dark d-flex align-items-center" style={{ color: '#000', fontWeight: 'bold',textDecoration:'none' }}>
                                    <i className="bi bi-house"></i> Trang chủ
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/blog" className="text-dark d-flex align-items-center" style={{ color: '#000', fontWeight: 'bold',textDecoration:'none' }}>
                                    <i className="bi bi-house"></i> Giới thiệu về SPACEHUB
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="#!" className="text-dark d-flex align-items-center" style={{ color: '#000', fontWeight: 'bold',textDecoration:'none' }}>
                                    <i className="bi bi-house"></i> Chia sẻ kinh nghiệm và kiến thức
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    <Col lg={2} md={6} className="footer-column" style={{ textAlign: "left" }}>
                        <h5 className="text-uppercase" style={{ color: '#000' }}>Liên Hệ</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-map-marker-alt pe-2" style={{ color: '#000' }}></i>
                                    <div style={{ color: '#000' }}>Đại học FPT Hà Nội</div>
                                </div>
                            </li>
                            <li className="mb-2">
                                <div className="d-flex align-items-center">
                                    <i className="fas fa-phone pe-2" style={{ color: '#000' }}></i>
                                    <div style={{ color: '#000' }}>+84123456789</div>
                                </div>
                            </li>
                            <li>
                                <ul className="list-inline d-flex justify-content-start">
                                    <li className="list-inline-item me-3">
                                        <Link to="#!"><Facebook size={24} style={{ color: 'black' }} /></Link>
                                    </li>
                                    <li className="list-inline-item me-3">
                                        <Link to="#!"><TwitterX size={24} style={{ color: 'black' }} /></Link>
                                    </li>
                                    <li className="list-inline-item">
                                        <Link to="#!"><Instagram size={24} style={{ color: 'black' }} /></Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;