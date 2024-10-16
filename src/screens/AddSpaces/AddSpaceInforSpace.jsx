import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import { Box, Button, FormControlLabel, FormGroup, InputAdornment, Switch, TextField, Tooltip, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { SpaceContext } from '../../Context/SpaceContext ';
import axios from 'axios';
import ReactQuill from 'react-quill';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Label } from '@mui/icons-material';
import { htmlToText } from 'html-to-text';



const AddSpaceInforSpace = () => {
    const { spaceInfo, setSpaceInfo } = useContext(SpaceContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({}); // Để lưu thông báo lỗi cho từng trường
    const [rules, setRules] = useState([]);
    const [selectedRules, setSelectedRules] = useState([]);
    const [customRule, setCustomRule] = useState('');

    const rulesList = [
        "Vệ sinh và ngăn nắp",
        "Cấm mang theo vũ khí, chất cấm",
        "Bảo quản thiết bị và cơ sở vật chất",
        "Mọi người vào đều phải được đăng ký trước",
        "Tuân thủ giờ thuê, không ở quá giờ quy định",
        "Số lượng người không được vượt quá giới hạn",
        "Không gây rối, xung đột với nhân viên và người khác"
    ];


    const handleToggleRule = (rule, checked) => {
        setSelectedRules((prevSelectedRules) => {
            if (checked) {
                // Nếu switch được bật, thêm rule vào mảng
                return [...prevSelectedRules, rule];
            } else {
                // Nếu switch bị tắt, loại bỏ rule khỏi mảng
                return prevSelectedRules.filter(r => r !== rule);
            }
        });
    };

    // const htmlToText = (html) => {
    //     const tempElement = document.createElement('div');
    //     tempElement.innerHTML = html;
    //     return tempElement.innerText; // Trả về văn bản thuần
    // };


    // Hàm xử lý khi nhập vào custom rule
    const handleCustomRuleChange = (event) => {
        setCustomRule(event.target.value);
    };

    // Hàm gửi dữ liệu lên server
    const handleSubmit = async () => {
        try {
            const data = {
                selectedRules,
                customRule: customRule ? customRule : null // Nếu có customRule thì gửi lên, không thì bỏ qua
            };

            const response = await axios.post("http://localhost:9999/rules/addRule", data);

            const ruleId = response.data._id;  // Lấy ruleId từ phản hồi

            // Sau khi tạo rule xong, lưu ruleId vào context để sử dụng trong bước tạo space
            setSpaceInfo(prev => ({
                ...prev,
                rulesId: ruleId  // Gán ruleId vừa mới tạo vào spaceInfo
            }));

            alert('Quy định được thêm thành công!');
        } catch (error) {
            console.error('Error adding rule:', error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setSpaceInfo(prev => ({
            ...prev,
            [name]: value
        }));
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
                        <Col md={12} className="pb-5">
                            <Typography variant="h6" style={{ fontWeight: 700, fontSize: "20px" }} >Đặt tên cho không gian của bạn <span style={{ color: "red" }}>*</span></Typography>
                            <Typography sx={{ fontSize: "14px", padding: "10px 0" }}> Tên của không gian sẽ hiển thị trên trang kết quả tìm kiếm và trang chi tiết listing khi khách hàng xem.</Typography>
                            <TextField
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
                        <Col md={12}>
                            <Row>
                                <Col md={12}>
                                    <Typography variant="h6" style={{ fontWeight: 700, fontSize: "20px", paddingBottom: "10px" }}  >Giá không gian <span style={{ color: "red" }}>*</span></Typography>
                                    <Row>
                                        <Col md={3}>
                                            <TextField
                                                name="pricePerHour"
                                                type="number"
                                                variant="outlined"
                                                required
                                                value={spaceInfo.pricePerHour}
                                                onChange={handleInputChange} // Cập nhật khi người dùng nhập
                                                onBlur={handleBlur}
                                                error={!!errors.pricePerHour} // Hiển thị lỗi nếu có
                                                helperText={errors.pricePerHour}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">/ giờ</InputAdornment>,
                                                }}

                                                onKeyDown={(e) => {
                                                    // Chỉ cho phép nhập số, dấu chấm, backspace, và delete
                                                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <TextField
                                                name="pricePerDay"
                                                type="number"
                                                variant="outlined"
                                                required
                                                value={spaceInfo.pricePerDay}
                                                onChange={handleInputChange} // Cập nhật khi người dùng nhập
                                                onBlur={handleBlur}
                                                error={!!errors.pricePerDay} // Hiển thị lỗi nếu có
                                                helperText={errors.pricePerDay}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">/ ngày</InputAdornment>,
                                                }}

                                                onKeyDown={(e) => {
                                                    // Chỉ cho phép nhập số, dấu chấm, backspace, và delete
                                                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <TextField
                                                name="pricePerWeek"
                                                type="number"
                                                variant="outlined"
                                                required
                                                value={spaceInfo.pricePerWeek}
                                                onChange={handleInputChange} // Cập nhật khi người dùng nhập
                                                onBlur={handleBlur}
                                                error={!!errors.pricePerWeek} // Hiển thị lỗi nếu có
                                                helperText={errors.pricePerWeek}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">/ tuần</InputAdornment>,
                                                }}

                                                onKeyDown={(e) => {
                                                    // Chỉ cho phép nhập số, dấu chấm, backspace, và delete
                                                    if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete" && e.key !== ".") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                            />
                                        </Col>
                                        <Col md={3}>
                                            <TextField
                                                name="pricePerMonth"
                                                type="number"
                                                variant="outlined"
                                                required
                                                value={spaceInfo.pricePerMonth}
                                                onChange={handleInputChange} // Cập nhật khi người dùng nhập
                                                onBlur={handleBlur}
                                                error={!!errors.pricePerMonth} // Hiển thị lỗi nếu có
                                                helperText={errors.pricePerMonth}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end">/ tháng</InputAdornment>,
                                                }}

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
                                <Col md={12}>
                                    <Typography variant="h6" style={{ fontWeight: 700, fontSize: "20px", paddingBottom: "10px" }}  >Diện tích <span style={{ color: "red" }}>*</span></Typography>
                                    <TextField
                                        name="area"
                                        type="number"
                                        variant="outlined"
                                        required
                                        value={spaceInfo.area}
                                        onChange={handleInputChange} // Cập nhật khi người dùng nhập
                                        onBlur={handleBlur}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">/ m<sup>2</sup></InputAdornment>,
                                        }}
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
                        <Col md={12} className="pt-2 pb-5">
                            <Typography variant="h6" style={{ fontWeight: 700, fontSize: "20px", paddingBottom: "10px" }}  >Mô tả</Typography>
                            <CKEditor
                                editor={ClassicEditor}
                                data={spaceInfo.description}
                                error={!!errors.description} 
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    const plainText = htmlToText(data); // Chuyển đổi sang văn bản thuần
                                    setSpaceInfo(prev => ({
                                        ...prev,
                                        description: plainText // Lưu dữ liệu dưới dạng văn bản thuần
                                    }));
                                }}
                                onInit={(editor) => {
                                    editor.editing.view.change((writer) => {
                                        writer.setStyle("height", "300px", editor.editing.view.document.getRoot());
                                    });
                                }}
                                config={{
                                    toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                                }}

                            />
                        </Col>
                        <Col md={12}>
                            <Row>
                                <Typography variant="h6" style={{ fontWeight: 700, fontSize: "20px", paddingBottom: "10px", }} >Quy định<span style={{ color: "red" }}>*</span></Typography>
                                <FormGroup>
                                    {rulesList.map((rule) => (
                                        <FormControlLabel
                                            key={rule}
                                            control={<Switch onChange={(e) => handleToggleRule(rule, e.target.checked)} />}
                                            label={rule}
                                        />
                                    ))}
                                    <TextField
                                        id="outlined-basic"
                                        label="Điền thêm quy định vào đây"
                                        variant="outlined"
                                        value={customRule}
                                        onChange={handleCustomRuleChange}
                                    />
                                </FormGroup>
                                <Button variant="contained" onClick={handleSubmit}>Lưu quy định</Button>
                            </Row>
                        </Col>
                    </Row>

                    {/* Thêm ảnh */}
                    <Row>
                        <Col md={3}>
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
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default AddSpaceInforSpace;
