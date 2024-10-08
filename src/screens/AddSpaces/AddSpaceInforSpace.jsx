import React, { useContext } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Box, Divider, TextField, Tooltip, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { SpaceContext } from '../../Context/SpaceContext ';

const AddSpaceInforSpace = () => {
    const { spaceInfo, setSpaceInfo } = useContext(SpaceContext); // Sử dụng context

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSpaceInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRuleSelect = (ruleId) => {
        setSpaceInfo(prev => ({
            ...prev,
            rulesId: ruleId
        }));
    };

    return (
        <Container fluid >
            <Row className="pb-5">
                <Col>
                    <h1 className="text-center">Nhập thông tin chi tiết không gian của bạn</h1>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={6}>
                    <Row className='pb-5'>
                        <Col md={6}>
                            <TextField
                                label="Tên không gian"
                                name="name"
                                variant="outlined"
                                fullWidth
                                required
                                value={spaceInfo.name}
                                onChange={handleInputChange} // Cập nhật khi người dùng nhập
                            />
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Col md={6}>
                                    <TextField
                                        label="Giá theo giờ"
                                        name="pricePerHour"
                                        type="number"
                                        variant="outlined"
                                        required
                                        value={spaceInfo.pricePerHour}
                                        onChange={handleInputChange} // Cập nhật khi người dùng nhập
                                    />
                                </Col>
                                <Col md={6}>
                                    <TextField
                                        label="Diện tích"
                                        name="area"
                                        type="number"
                                        variant="outlined"
                                        required
                                        value={spaceInfo.area}
                                        onChange={handleInputChange} // Cập nhật khi người dùng nhập
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Mô tả và quy định */}
                    <Row className='pb-5'>
                        <Col md={6} className="pt-2">
                            <TextField
                                label="Mô tả"
                                name="description"
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                                required
                                value={spaceInfo.description}
                                onChange={handleInputChange} // Cập nhật khi người dùng nhập
                            />
                        </Col>
                        <Col md={6}>
                            <Row>
                                <Typography variant="h6">Quy định</Typography>
                                <Col md={3}>
                                    <Tooltip title="Cấm dùng thuốc lá" arrow>
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
                                            onClick={() => handleRuleSelect(1)} // Chọn quy định 1
                                        >
                                            Icon
                                        </Box>
                                    </Tooltip>
                                </Col>
                                {/* Thêm các quy định khác tương tự */}
                            </Row>
                        </Col>
                    </Row>

                    {/* Thêm ảnh */}
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
                                onClick={() => alert('Chức năng tải ảnh chưa được triển khai!')}
                            >
                                <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'grey' }} />
                                <Typography variant="body1" color="grey">
                                    Thêm ảnh
                                </Typography>
                            </Box>
                        </Col>
                        <Col md={10}>
                            {/* Hiển thị danh sách ảnh đã tải lên (nếu có) */}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default AddSpaceInforSpace;
