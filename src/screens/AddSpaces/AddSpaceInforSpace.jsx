import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, } from 'react-bootstrap';
import { Box, Button, FormControlLabel, FormGroup, InputAdornment, Switch, TextField, Tooltip, Typography } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { SpaceContext } from '../../Context/SpaceContext ';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { htmlToText } from 'html-to-text';
import Loading from "../../components/Loading";
import CloseIcon from '@mui/icons-material/Close';
import { Image } from 'antd'; // Import các component từ Antd




const AddSpaceInforSpace = () => {
    const { spaceInfo, setSpaceInfo, rules, setRules, selectedRules, setSelectedRules, customRule, setCustomRule } = useContext(SpaceContext);
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({}); // Để lưu thông báo lỗi cho từng trường
    const [isLoading, setIsLoading] = useState(false);
    const [imagesPreview, setImagesPreview] = useState([]);


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

    // Hàm xử lý khi nhập vào custom rule
    const handleCustomRuleChange = (event) => {
        setCustomRule(event.target.value);
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

    const handleFiles = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let newImages = [];
        
        const files = e.target.files; // Lấy tất cả các file
    
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("images", files[i]); // Thêm từng file vào formData
        }
    
        try {
            const response = await axios.post('http://localhost:9999/spaces/uploadImages', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Đặt header để gửi file
                },
            });
    
            if (response.status === 200) {
                newImages = response.data.images; // Lưu thông tin ảnh vào mảng từ phản hồi
            } else {
                console.error("Failed to upload images");
            }
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    
        setIsLoading(false);
        setImagesPreview((prev) => [...prev, ...newImages]);
        setSpaceInfo((prevSpaceInfo) => ({
            ...prevSpaceInfo,
            images: [...prevSpaceInfo.images, ...newImages],
        }));
    };
    

    console.log(imagesPreview);
    const handleDeleteImage = async (public_id) => {
        try {
            // Gửi request đến server-side để xóa ảnh từ Cloudinary
            const response = await axios.post('http://localhost:9999/spaces/removeImage', { public_id });
            
            if (response.status === 200) {
                console.log('Image deleted successfully');
    
                // Xóa ảnh khỏi danh sách hiển thị
                setImagesPreview((prev) => prev.filter((item) => item.public_id !== public_id));
                setSpaceInfo((prevSpaceInfo) => ({
                    ...prevSpaceInfo,
                    images: prevSpaceInfo.images.filter((item) => item.public_id !== public_id)
                }));
            } else {
                console.error('Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };
    

    return (
        <Container fluid >
            <Row className="pb-5">
                <Typography variant='h4' fontWeight={700} className="text-center" >Nhập thông tin chi tiết không gian của bạn</Typography>

            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={6}>
                    <Row className='pb-3'>
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
                                <Col md={12} className="pb-5">
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
                                    <Typography variant="h6"
                                        style={{ fontWeight: 700, fontSize: "20px", paddingBottom: "10px" }}  >Diện tích <span style={{ color: "red" }}>*</span></Typography>
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
                        <Col md={12} className="pb-5">
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
                                        className="mt-3"
                                        id="outlined-basic"
                                        label="Điền thêm quy định vào đây"
                                        variant="outlined"
                                        value={customRule}
                                        onChange={handleCustomRuleChange}
                                        helperText="Các quy định riêng lẻ có thể tách nhau bằng dấu ';'"
                                        FormHelperTextProps={{
                                            style: {
                                                fontSize: '14px', // Kích thước chữ helperText
                                            },
                                        }}

                                    />
                                </FormGroup>
                            </Row>
                        </Col>
                    </Row>

                    {/* Thêm ảnh */}
                    <Row style={{marginBottom:"200px"}}>
                        <Col md={3} style={{ marginBottom: "200px" }}>
                            {isLoading ? (
                                <Loading />
                            ) : (
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
                                    onClick={() => document.getElementById('file').click()} // Kích hoạt input khi nhấn vào Box

                                >
                                    <input
                                        onChange={handleFiles}
                                        hidden
                                        type="file"
                                        id="file"
                                        multiple
                                    />
                                    <AddPhotoAlternateIcon sx={{ fontSize: 40, color: 'grey' }} />
                                    <Typography variant="body1" color="grey">
                                        Thêm ảnh
                                    </Typography>
                                </Box>
                            )}
                        </Col>
                        <Col md={9}>
                            <Row gutter={[16, 16]} type="flex" justify="space-between"> 
                                <Image.PreviewGroup>
                                    {imagesPreview?.map((item, index) => (
                                        <Col md={3} key={index} className="image-item">
                                            <div >
                                                {/* Sử dụng Image của Antd với tính năng preview */}
                                                <Image
                                                    src={item.url}
                                                    alt="preview"
                                                    height={100}
                                                    style={{ objectFit: 'cover' }}
                                                    className="relative"
                                                />
                                                {/* Nút xóa ảnh */}
                                                <span
                                                    title="Xóa"
                                                    onClick={() => handleDeleteImage(item.public_id)}
                                                    className="closeicon"
                                                >
                                                    <CloseIcon sx={{ fontSize: "20px" }} />
                                                </span>
                                            </div>
                                        </Col>
                                    ))}
                                </Image.PreviewGroup>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default AddSpaceInforSpace;
