import React from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Divider, TextField, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Textarea } from 'react-bootstrap-icons';
const AddSpaceInforSpace = () => {
    return (
        <Container fluid >
            <Row className="pb-5">
                <Col>
                    <h1 className="text-center">Nhập thông tin chi tiết không gian của bạn </h1>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center" >
                <Col md={6}>
                    <Row className='pb-5'>
                        <Col md={6}>
                            <TextField
                                label="Tên không gian "
                                id="outlined-size-normal"
                                defaultValue="Normal"
                                variant="outlined"
                                required

                            />
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Col md={6}>
                                    <TextField
                                        label="Giá theo giờ"
                                        id="outlined-size-normal"
                                        defaultValue="Normal"
                                        variant="outlined"
                                        type='number'
                                        required
                                    />
                                </Col>
                                <Col md={6}>
                                    <TextField
                                        label="Diện tích"
                                        id="outlined-size-normal"
                                        defaultValue="Normal"
                                        variant="outlined"
                                        type='number'
                                        required

                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/*hàng 2 */}
                    <Row className='pb-5'>
                        <Col md={6}>
                            <TextField
                                label="Mô tả"
                                multiline
                                rows={4}  // Số hàng hiển thị
                                variant="outlined"  // Kiểu hiển thị của TextField
                                fullWidth  // Chiếm toàn bộ chiều rộng
                                required

                            />
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Typography variant="h6">Quy định</Typography>
                                <Col md={4}>
                                    <div style={{ border: "1px solid black", padding: "20px" }}>
                                        Icon
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div style={{ border: "1px solid black", padding: "20px" }}>
                                        Icon
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div style={{ border: "1px solid black", padding: "20px" }}>
                                        Icon
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/*hàng 3 */}
                    <Row>
                        <Col md={2}>
                            <div style={{ border: "1px dashed gray", textAlign: "center" }}>
                                <AddPhotoAlternateIcon />
                                <Typography variant="body2">Thêm ảnh</Typography>
                            </div>
                        </Col>
                        <Col md={10}>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default AddSpaceInforSpace