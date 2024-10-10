import React, { useContext,useState } from 'react';
import { Container, Row, Col,  } from 'react-bootstrap';
import { Box,  TextField, Tooltip, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { SpaceContext } from '../../Context/SpaceContext ';

const AddSpaceInforSpace = () => {
    const { spaceInfo, setSpaceInfo } = useContext(SpaceContext); // Sử dụng context
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({}); // Để lưu thông báo lỗi cho từng trường


    const handleInputChange = (e) => {
        const { name, value,type  } = e.target;
        setSpaceInfo(prev => ({
            ...prev,
            [name]: value
        }));
          // Kiểm tra giá trị nhập vào khi người dùng thay đổi
          if (value.trim() === '') {
            setErrors(prev => ({
                ...prev,
                [name]: 'Trường này không được bỏ trống',
            }));
        } else if (type === 'number' && parseFloat(value) < 0) {
            setErrors(prev => ({
                ...prev,
                [name]: 'Giá trị không được âm',
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const handleRuleSelect = (ruleId) => {
        setSpaceInfo(prev => ({
            ...prev,
            rulesId: ruleId
        }));
    };

    const handleBlur = (e) => {
        const { name, value, type } = e.target;

        // Kiểm tra lại khi rời khỏi input
        if (value.trim() === '') {
            setErrors(prev => ({
                ...prev,
                [name]: 'Trường này không được bỏ trống',
            }));
        } else if (type === 'number' && parseFloat(value) < 0) {
            setErrors(prev => ({
                ...prev,
                [name]: 'Giá trị không được âm',
            }));
        } else {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
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
                                onBlur={handleBlur}
                                error={!!errors.name} // Hiển thị lỗi nếu có
                                helperText={errors.name}
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
                                        onBlur={handleBlur}
                                        error={!!errors.pricePerHour} // Hiển thị lỗi nếu có
                                        helperText={errors.pricePerHour}
                                        onKeyDown={(e) => {
                                            // Chỉ cho phép nhập số, dấu chấm, backspace, và delete
                                            if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                                                e.preventDefault();
                                            }
                                        }}
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
                                        onBlur={handleBlur}
                                        error={!!errors.area} // Hiển thị lỗi nếu có
                                        helperText={errors.area}
                                        onKeyDown={(e) => {
                                            // Chỉ cho phép nhập số, dấu chấm, backspace, và delete
                                            if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                                                e.preventDefault();
                                            }
                                        }}
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
                                onBlur={handleBlur}
                                error={!!errors.description} // Hiển thị lỗi nếu có
                                helperText={errors.description}
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
