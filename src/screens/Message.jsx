import { Button, IconButton, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import { useLocation } from 'react-router-dom';
import axios from 'axios';


const Message = () => {
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const location = useLocation();
    const [space, setSpace] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = location.state || {}; // Lấy id từ state

    const fetchSpaceById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:9999/spaces/${id}`);
            setSpace(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false); // Tắt trạng thái loading dù thành công hay thất bại
        }
    };

    // Gọi API khi component được render
    useEffect(() => {
        fetchSpaceById(id);
    }, [id]);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;


    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenDrawer(open);
    };

    const drawerContent = () => (
        <Box
            sx={{ width: 400, padding: "0 20px" }} // You can adjust the width as needed
            role="presentation"
        >
            <h2 className="text-center pt-4 pb-3">Đặt phòng , đặt chỗ</h2>
            <img src={space.images[0]} alt=""
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
            <h4>{space.name}</h4>
            <h4>{space.pricePerHour}/giờ</h4>


        </Box>
    );

    return (
        <Container fluid>
            <Row>
                <Col md={3} style={{ border: "solid 2px #ECECEC", height: "88vh" }}>
                    <h4 className='pt-4'>Tin nhắn</h4>
                    <Button variant="contained" size="small" className='me-4 rounded-5 pt-2 pb-1 px-3 mb-4' >Tất cả</Button>
                    <Button variant="outlined" size="small" className='me-4 rounded-5  pt-2 pb-1 px-3 mb-4'>Chưa đọc</Button>
                    <Row style={{ height: "13%" }}>
                        <Row style={{ margin: "0 auto", width: "90%", backgroundColor: "whitesmoke", borderRadius: "10px" }} >
                            <Col md={3} style={{ padding: "10px 5px" }}>
                                <img
                                    src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                                    alt="avatarSpaceOwner"
                                    style={{ objectFit: "cover", width: "100%", height: "100%" }}
                                />
                            </Col>
                            <Col md={9}>
                                <h4>Tên Space Owner</h4>
                                <p>thời gian</p>
                            </Col>
                        </Row>
                    </Row>
                </Col>
                <Col md={9} style={{ border: "solid 2px #ECECEC", height: "88vh", position: "relative" }}>
                    <Row className='pt-4 pb-4 ' style={{ borderBottom: "solid 2px #ECECEC" }}>
                        <Col md={10} className="d-flex align-items-center ps-5" >

                            <div style={{ display: 'flex' }}>
                                <img
                                    src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                                    alt="avatarSpaceOwner2"
                                    style={{
                                        objectFit: "cover",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        marginRight: "10px",
                                    }}
                                />
                            </div>
                            <h3 style={{ margin: 0 }}>Tên space</h3>
                        </Col>
                        <Col md={2}>
                            <Button variant='contained' color='#ECECEC' onClick={toggleDrawer(true)}>Hiển thị thông tin đặt phòng </Button>
                        </Col>
                    </Row>

                    <p className="text-center"><b>Hôm nay</b></p>
                    <Row style={{}}>
                        {/* Tin nhắn của mình */}
                        <Col md={12} className="d-flex mb-3">

                            <div className='d-flex pe-5' style={{ alignItems: "flex-start", flexDirection: "column", marginLeft: 'auto' }}>
                                {/* Tên và thời gian */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '98%' }}>
                                    <p style={{ marginLeft: 'auto', marginBottom: 0 }}>thời gian nhắn </p>
                                </div>
                                {/* Tin nhắn đáp */}
                                <div style={{
                                    backgroundColor: "#f1f1f1",
                                    borderRadius: "20px",
                                    padding: "10px 15px",
                                    maxWidth: "600px",
                                    display: 'flex',
                                    height: "70px"
                                }}>
                                    <p style={{ margin: 0 }}>T là người thuê đây chúng tôi có thể giúp bạn giải đáp thắc mắc của mình khônggg</p>
                                </div>
                            </div>
                        </Col>
                    </Row>


                    {/* Chat Messages */}
                    <Row style={{ paddingBottom: "60px" }}>
                        {/* Tin nhắn */}
                        <Col md={12} className="d-flex mb-3 ps-5">
                            {/* Avatar */}
                            <img
                                src="https://media-cdn-v2.laodong.vn/storage/newsportal/2023/8/26/1233821/Giai-Nhi-1--Nang-Tre.jpg"
                                alt="avatar"
                                style={{
                                    objectFit: "cover",
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    marginRight: "10px",
                                }}
                            />
                            <div className='d-flex' style={{ alignItems: "flex-start", flexDirection: "column" }}>
                                {/* Tên và thời gian */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                                    <p style={{ margin: 0 }}><b>Tên Space Owner</b>  <span className='ps-2'>thời gian nhắn</span></p>
                                </div>
                                {/* Tin nhắn đáp */}
                                <div style={{
                                    backgroundColor: "#f1f1f1",
                                    borderRadius: "20px",
                                    padding: "10px 15px",
                                    maxWidth: "600px",
                                    display: 'flex',
                                    height: "80px"
                                }}>
                                    <p style={{ margin: 0 }}>Xinaaaaaaaaaaaaaaaaaaaaaaaaaaaaa chào Toàn... chúng tôi có thể giúp bạn giải đáp thắc mắc của mình khônggg?</p>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* input Messages */}
                    <Row
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            padding: '10px',
                        }}
                    >
                        <p className='text-center'>Bây giờ là "cho thời gian thực của space owner vào đây" theo múi giờ của Chủ nhà/Người tổ chức.</p>

                        <Col md={12}>
                            <TextField
                                id="outlined-basic"
                                label="Nhập tin nhắn"
                                variant="outlined"
                                fullWidth
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            {/* Drawer */}
            <Drawer
                anchor="right"
                open={openDrawer}
                onClose={toggleDrawer(false)}
            >
                {drawerContent()}
            </Drawer>

        </Container>
    )
}

export default Message