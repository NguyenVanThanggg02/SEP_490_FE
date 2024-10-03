import React from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Box, Divider, TextField, Tooltip, Typography } from '@mui/material';
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
                                variant="outlined"
                                fullWidth  // Chiếm toàn bộ chiều rộng
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
                        <Col md={6} className="pt-2">
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
                                <Col md={3}>
                                    <Tooltip title="Cấm dùng thuốc lá " arrow>
                                        <Box
                                            sx={{
                                                border: '2px dashed grey',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '50px',
                                                width: '80px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Icon
                                        </Box>

                                    </Tooltip>
                                </Col>
                                <Col md={3}>
                                    <Tooltip title="Cấm dùng thuốc lá " arrow>
                                        <Box
                                            sx={{
                                                border: '2px dashed grey',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '50px',
                                                width: '80px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Icon
                                        </Box>

                                    </Tooltip>
                                </Col>
                                <Col md={3}>
                                    <Tooltip title="Cấm dùng thuốc lá " arrow>
                                        <Box
                                            sx={{
                                                border: '2px dashed grey',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '50px',
                                                width: '80px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Icon
                                        </Box>

                                    </Tooltip>
                                </Col>
                                <Col md={3}>
                                    <Tooltip title="Cấm dùng thuốc lá " arrow>
                                        <Box
                                            sx={{
                                                border: '2px dashed grey',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '50px',
                                                width: '80px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Icon
                                        </Box>

                                    </Tooltip>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/*hàng 3 */}
                    <Row>
                        <Col md={2}>
                            <Box
                                sx={{
                                    border: '2px dashed grey',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100px',
                                    width: '150px',
                                    cursor: 'pointer',
                                }}
                            >
                                <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'grey' }} />
                                <Typography variant="body1" color="grey">
                                    Thêm ảnh
                                </Typography>
                            </Box>
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