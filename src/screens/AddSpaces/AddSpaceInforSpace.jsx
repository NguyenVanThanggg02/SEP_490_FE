import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Image } from 'antd'; // Import các component từ Antd
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Loading from '../../components/Loading';
import { SpaceContext } from '../../Context/SpaceContext ';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Checkbox from '@mui/material/Checkbox';
import { htmlToText } from 'html-to-text';
import { Constants } from '../../utils/constants';

export const availableSlots = [
  {
    startTime: '00:00',
    endTime: '01:00',
  },
  {
    startTime: '01:00',
    endTime: '02:00',
  },
  {
    startTime: '02:00',
    endTime: '03:00',
  },
  {
    startTime: '03:00',
    endTime: '04:00',
  },
  {
    startTime: '04:00',
    endTime: '05:00',
  },
  {
    startTime: '05:00',
    endTime: '06:00',
  },
  {
    startTime: '06:00',
    endTime: '07:00',
  },
  {
    startTime: '07:00',
    endTime: '08:00',
  },
  {
    startTime: '08:00',
    endTime: '09:00',
  },
  {
    startTime: '09:00',
    endTime: '10:00',
  },
  {
    startTime: '10:00',
    endTime: '11:00',
  },
  {
    startTime: '11:00',
    endTime: '12:00',
  },
  {
    startTime: '12:00',
    endTime: '13:00',
  },
  {
    startTime: '13:00',
    endTime: '14:00',
  },
  {
    startTime: '14:00',
    endTime: '15:00',
  },
  {
    startTime: '15:00',
    endTime: '16:00',
  },
  {
    startTime: '16:00',
    endTime: '17:00',
  },
  {
    startTime: '17:00',
    endTime: '18:00',
  },
  {
    startTime: '18:00',
    endTime: '19:00',
  },
  {
    startTime: '19:00',
    endTime: '20:00',
  },
  {
    startTime: '20:00',
    endTime: '21:00',
  },
  {
    startTime: '21:00',
    endTime: '22:00',
  },
  {
    startTime: '22:00',
    endTime: '23:00',
  },
  {
    startTime: '23:00',
    endTime: '00:00',
  },
];

const AddSpaceInforSpace = ({ editorRef }) => {
  const {
    spaceInfo,
    setSpaceInfo,
    rules,
    setRules,
    selectedRules,
    setSelectedRules,
    customRule,
    setCustomRule,
    isGoldenHour,
    setIsGoldenHour,
    goldenHourDetails,
    setGoldenHourDetails,
    priceIncrease,
    setPriceIncrease,
  } = useContext(SpaceContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({}); // Để lưu thông báo lỗi cho từng trường
  const [isLoading, setIsLoading] = useState(false);
  const [imagesPreview, setImagesPreview] = useState([]);

  const rulesList = [
    'Vệ sinh và ngăn nắp',
    'Cấm mang theo vũ khí, chất cấm',
    'Bảo quản thiết bị và cơ sở vật chất',
    'Mọi người vào đều phải được đăng ký trước',
    'Tuân thủ giờ thuê, không ở quá giờ quy định',
    'Số lượng người không được vượt quá giới hạn',
    'Không gây rối, xung đột với nhân viên và người khác',
  ];
  const handleCheckboxChange = () => {
    setIsGoldenHour(!isGoldenHour);
  };

  const formatArea = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };
  const formatPrice = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };
  const handleToggleRule = (rule, checked) => {
    setSelectedRules((prevSelectedRules) => {
      if (checked) {
        // Nếu switch được bật, thêm rule vào mảng
        return [...prevSelectedRules, rule];
      } else {
        // Nếu switch bị tắt, loại bỏ rule khỏi mảng
        return prevSelectedRules.filter((r) => r !== rule);
      }
    });
  };

  // Hàm xử lý khi nhập vào custom rule
  const handleCustomRuleChange = (event) => {
    setCustomRule(event.target.value);
  };
  const handleInputHourChange = (e) => {
    setPriceIncrease(e.target.value);

    const tempGoldenHourDetails = [...goldenHourDetails].map((hour) => {
      return { ...hour, priceIncrease: e.target.value };
    });

    setGoldenHourDetails(tempGoldenHourDetails);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    console.log('{ name, value, type }', { name, value, type });

    const numericValue = value.replace(/\./g, "");
    setSpaceInfo((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
    if (value.trim() === '') {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Trường này không được bỏ trống',
      }));
    } else if (type === 'number' && parseFloat(value) < 0) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Giá trị không được âm',
      }));
    } else if (name === 'area') {
      if (parseFloat(value) < 1) {
        setErrors((prev) => ({
          ...prev,
          [name]: 'Giá trị phải lớn hơn 1',
        }));
      }
    } 
    if (
      type === 'number' &&
      name === 'priceIncrease' &&
      (parseFloat(numericValue) <= 0 || parseFloat(numericValue) > 100)
    ) {
    setErrors((prev) => ({
      ...prev,
      [name]: 'Giá trị là phần trăm nên phải lớn hơn 0 và nhỏ hơn bằng 100',
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
    }));
  }
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;

    console.log('{ name, value, type }', { name, value, type });

    // Kiểm tra lại khi rời khỏi input
    if (value.trim() === '') {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Trường này không được bỏ trống',
      }));
    } else if (type === 'number' && parseFloat(value) < 0) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Giá trị không được âm',
      }));
    } else if (name === 'area' && parseFloat(value) < 1) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Giá trị phải lớn hơn 1',
      }));
    } else if (
      type === 'number' &&
      name === 'priceIncrease' &&
      (parseFloat(value) <= 0 || parseFloat(value) > 100)
    ) {
      setErrors((prev) => ({
        ...prev,
        [name]: 'Giá trị là phần trăm nên phải lớn hơn 0 và nhỏ hơn bằng 100',
      }));
    } else {
      setErrors((prev) => ({
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
      formData.append('images', files[i]); // Thêm từng file vào formData
    }

    try {
      const response = await axios.post(
        `${Constants.apiHost}/spaces/uploadImages`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Đặt header để gửi file
          },
        }
      );

      if (response.status === 200) {
        newImages = response.data.images; // Lưu thông tin ảnh vào mảng từ phản hồi
      } else {
        console.error('Failed to upload images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }

    setIsLoading(false);
    setImagesPreview((prev) => [...prev, ...newImages]);
    setSpaceInfo((prevSpaceInfo) => ({
      ...prevSpaceInfo,
      images: [...prevSpaceInfo.images, ...newImages],
    }));
  };

  const handleDeleteImage = async (public_id) => {
    try {
      // Gửi request đến server-side để xóa ảnh từ Cloudinary
      const response = await axios.post(
        `${Constants.apiHost}/spaces/removeImage`,
        { public_id }
      );

      if (response.status === 200) {
        console.log('Image deleted successfully');

        // Xóa ảnh khỏi danh sách hiển thị
        setImagesPreview((prev) =>
          prev.filter((item) => item.public_id !== public_id)
        );
        setSpaceInfo((prevSpaceInfo) => ({
          ...prevSpaceInfo,
          images: prevSpaceInfo.images.filter(
            (item) => item.public_id !== public_id
          ),
        }));
      } else {
        console.error('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // =================================================================
  const [stateSpacePriceWay, setStateSpacePriceWay] = React.useState({
    pricePerHour: true,
    pricePerDay: false,
    // pricePerWeek: false,
    pricePerMonth: false,
  });

  const [isShowNotPermissionSpacePrice, setIsShowNotPermissionSpacePrice] =
    useState(false);

    const onPricePerChange = (event) => {
      console.log('onPricePerChange', {
        checked: event.target.checked,
        name: event.target.name,
      });
  
      // reset the state of checkbox
      setStateSpacePriceWay({
        ...stateSpacePriceWay,
        [event.target.name]: event.target.checked,
      });
      // hide the not permission notice
      setIsShowNotPermissionSpacePrice(false);
  
      // check case we uncheck
      if (event.target.checked === false) {
        const isOtherAllFalse = Object.keys(stateSpacePriceWay)
          .filter((item) => item !== event.target.name)
          .every((key) => {
            return stateSpacePriceWay[key] === false;
          });
        // if other option is not check=> show error that you must check at least one option
        if (isOtherAllFalse) {
          setIsShowNotPermissionSpacePrice(true);
        }
  
        // set the value of priceper to 0
        const tempName = event.target.name;
        const tempPrice = {};
        tempPrice[tempName] = 0;
        setSpaceInfo({ ...spaceInfo, ...tempPrice });
      }
    };

  const { pricePerHour, pricePerDay, /*pricePerWeek*/ pricePerMonth } =
    stateSpacePriceWay;

  const handleTimeSlotSelection = (slotStartTime, slotEndTime) => {
    if (
      goldenHourDetails.length > 0 &&
      goldenHourDetails.findIndex(
        (goldenHourDetails) =>
          goldenHourDetails.startTime === slotStartTime &&
          goldenHourDetails.endTime === slotEndTime
      ) > -1
    ) {
      const tempGoldenHourDetails = [...goldenHourDetails].filter(
        (goldenHourDetails) =>
          goldenHourDetails.startTime !== slotStartTime &&
          goldenHourDetails.endTime !== slotEndTime
      );

      setGoldenHourDetails(tempGoldenHourDetails);
      return;
    }

    setGoldenHourDetails((goldenHourDetails) => {
      return [
        ...goldenHourDetails,
        {
          startTime: slotStartTime,
          endTime: slotEndTime,
          priceIncrease: priceIncrease,
        },
      ];
    });
  };
  return (
    <Container fluid>
      <Row className="pb-5">
        <Typography
          variant="h4"
          fontWeight={700}
          className="text-center"
          sx={{
            color: 'primary.main',
            marginBottom: '2rem',
            animation: 'fadeIn 0.5s ease-in',
            '&:hover': { transform: 'scale(1.02)' },
            transition: 'all 0.3s ease'
          }}
        >
          Nhập thông tin chi tiết không gian của bạn
        </Typography>
      </Row>
      <Row className="d-flex justify-content-center align-items-center">
        <Col md={6}>
          <Row className="pb-3">
            <Col md={12} className="pb-5">
              <Typography
                variant="h6"
                style={{ fontWeight: 700, fontSize: '20px' }}
              >
                Đặt tên cho không gian của bạn{' '}
                <span style={{ color: 'red' }}>*</span>
              </Typography>
              <Typography sx={{ fontSize: '14px', paddingBottom: "10px" }}>
                {' '}
                Tên của không gian sẽ hiển thị trên trang kết quả tìm kiếm và
                trang chi tiết listing khi khách hàng xem.
              </Typography>
              <TextField
                name="name"
                variant="outlined"
                fullWidth
                required
                value={spaceInfo.name}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  marginBottom: '1rem'
                }}
              />

            </Col>
            <Col md={12}>
              <Row>
                <Col md={12} className="pb-5">
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: 700,
                      fontSize: '20px',
                      paddingBottom: '10px',
                    }}
                  >
                    Chọn cách thức thuê không gian <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <Typography sx={{ fontSize: '14px', paddingBottom: "10px" }}>
                    {' '}
                    Chọn cách thức thuê không gian sau đó nhập giá không gian của bạn tương ứng với từng cách thức thuê.
                  </Typography>
                  <Row>
                    <Col md={12} align="center">
                      <FormControl component="fieldset" variant="standard" className="mb-5">
                        <FormGroup
                          sx={{
                            flexDirection: 'row',
                            gap: 2,
                            '& .MuiFormControlLabel-root': {
                              marginRight: 4,
                              backgroundColor: 'background.paper',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              boxShadow: 1,
                              '&:hover': {
                                backgroundColor: 'action.hover'
                              }
                            }
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={pricePerHour}
                                onChange={onPricePerChange}
                                name="pricePerHour"
                              />
                            }
                            label="Giờ"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={pricePerDay}
                                onChange={onPricePerChange}
                                name="pricePerDay"
                              />
                            }
                            label="Ngày"
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={pricePerMonth}
                                onChange={onPricePerChange}
                                name="pricePerMonth"
                              />
                            }
                            label="Tháng"
                          />
                        </FormGroup>
                      </FormControl>
                    </Col>
                    {pricePerHour && (
                      <Col md={12}>
                        <TextField
                          name="pricePerHour"
                          type="text"
                          variant="outlined"
                          required
                          value={formatPrice(spaceInfo.pricePerHour|| "")} // Sử dụng hàm formatPrice để định dạng
                          onChange={handleInputChange} // Cập nhật khi người dùng nhập
                          onBlur={handleBlur}
                          error={!!errors.pricePerHour} // Hiển thị lỗi nếu có
                          helperText={errors.pricePerHour}
                          label="Nhập giá không gian cho thuê theo giờ"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                VND/ giờ
                              </InputAdornment>
                            ),
                          }}
                          onKeyDown={(e) => {
                            // Chỉ cho phép nhập số, dấu chấm, backspace, và delete
                            if (
                              !/[0-9]/.test(e.key) &&
                              e.key !== 'Backspace' &&
                              e.key !== 'Delete' &&
                              e.key !== '.'
                            ) {
                              e.preventDefault();
                            }
                          }}
                          sx={{ marginBottom: '20px', width: '100%' }}
                        />
                      </Col>
                    )}

                    {pricePerDay && (
                      <Col md={12}>
                        <TextField
                          name="pricePerDay"
                          type="text"
                          variant="outlined"
                          required
                          value={formatPrice(spaceInfo.pricePerDay || "")} // Sử dụng hàm formatPrice để định dạng
                          onChange={handleInputChange} // Cập nhật khi người dùng nhập
                          onBlur={handleBlur}
                          error={!!errors.pricePerDay} // Hiển thị lỗi nếu có
                          helperText={errors.pricePerDay}
                          label="Nhập giá không gian cho thuê theo ngày"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                VND/ ngày
                              </InputAdornment>
                            ),
                          }}
                          onKeyDown={(e) => {
                            // Chỉ cho phép nhập số, dấu chấm, backspace, và delete
                            if (
                              !/[0-9]/.test(e.key) &&
                              e.key !== 'Backspace' &&
                              e.key !== 'Delete' &&
                              e.key !== '.'
                            ) {
                              e.preventDefault();
                            }
                          }}
                          sx={{ marginBottom: '20px', width: '100%' }}
                        />
                      </Col>
                    )}
                    {pricePerMonth && (
                      <Col md={12}>
                        <TextField
                          name="pricePerMonth"
                          type="text"
                          variant="outlined"
                          required
                          value={formatPrice(spaceInfo.pricePerMonth || "")} // Sử dụng hàm formatPrice để định dạng
                          onChange={handleInputChange} // Cập nhật khi người dùng nhập
                          onBlur={handleBlur}
                          error={!!errors.pricePerMonth} // Hiển thị lỗi nếu có
                          helperText={errors.pricePerMonth}
                          label="Nhập giá không gian cho thuê theo tháng"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                VND/ tháng
                              </InputAdornment>
                            ),
                          }}
                          onKeyDown={(e) => {
                            // Chỉ cho phép nhập số, dấu chấm, backspace, và delete
                            if (
                              !/[0-9]/.test(e.key) &&
                              e.key !== 'Backspace' &&
                              e.key !== 'Delete' &&
                              e.key !== '.'
                            ) {
                              e.preventDefault();
                            }
                          }}
                          sx={{ marginBottom: '20px', width: '100%' }}
                        />
                      </Col>
                    )}

                    {isShowNotPermissionSpacePrice && (
                      <span className="text-danger d-inline-block">
                        Phải chọn ít nhất một cách thức thuê, mặc định là chọn
                        theo giờ
                      </span>
                    )}
                  </Row>
                </Col>

                <Col md={12}>
                  <div class="form-check" style={{ paddingLeft: 0 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isGoldenHour}
                          onChange={handleCheckboxChange}
                          name="isGoldenHour"
                        />
                      }
                      label="Giờ cao điểm"
                    />

                  </div>

                  {isGoldenHour && (
                    <Row>
                      <Grid
                        container
                        justifyContent="center"
                        spacing={1}
                        mt={1}
                        mb={4}
                        sm={12}
                      >
                        {availableSlots.map((slot, index) => {
                          const check = goldenHourDetails.findIndex(
                            (item, index) => {
                              return (
                                item.startTime === slot.startTime &&
                                item.endTime === slot.endTime
                              );
                            }
                          );

                          return (
                            <Grid item key={index}>
                              <Button
                                variant={check > -1 ? 'contained' : 'outlined'}
                                onClick={() =>
                                  handleTimeSlotSelection(
                                    slot.startTime,
                                    slot.endTime
                                  )
                                }
                                style={{ margin: '5px' }}
                              >
                                {slot.startTime} - {slot.endTime}
                              </Button>
                            </Grid>
                          );
                        })}
                      </Grid>
                      <Col md={12}>
                        <TextField
                          name="priceIncrease"
                          type="number"
                          variant="outlined"
                          fullWidth
                          required
                          min={0}
                          max={100}
                          value={priceIncrease || ""}
                          onChange={handleInputHourChange}
                          onBlur={handleBlur}
                          error={!!errors.priceIncrease} // Hiển thị lỗi nếu có
                          helperText={errors.priceIncrease}
                          label="Phần trăm(%) giá tăng lên"
                          sx={{ mb: 4 }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                %
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Col>
                    </Row>
                  )}
                </Col>
                <Col md={12}>
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: 700,
                      fontSize: '20px',
                      paddingBottom: '10px',
                    }}
                  >
                    Diện tích <span style={{ color: 'red' }}>*</span>
                    </Typography>
                  <TextField
                    name="area"
                    type="number"
                    variant="outlined"
                    required
                    value={spaceInfo.area}
                    // value={formatArea(spaceInfo.area || "")} // Sử dụng hàm formatArea để định dạng
                    onChange={handleInputChange} // Cập nhật khi người dùng nhập
                    onBlur={handleBlur}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          m<sup>2</sup>
                        </InputAdornment>
                      ),
                    }}
                    error={!!errors.area} // Hiển thị lỗi nếu có
                    helperText={errors.area}
                    onKeyDown={(e) => {
                      // Chỉ cho phép nhập số, dấu chấm, backspace, và delete
                      if (
                        !/[0-9]/.test(e.key) &&
                        e.key !== 'Backspace' &&
                        e.key !== 'Delete' &&
                        e.key !== '.'
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Mô tả và quy định */}
          <Row className="pb-5">
            <Col md={12} className="pb-5">
            <Typography
                variant="h6"
                style={{
                  fontWeight: 700,
                  fontSize: '20px',
                  paddingBottom: '10px',
                }}
                fullWidth
              >
                Mô tả
              </Typography>
              <CKEditor
                ref={editorRef}
                editor={ClassicEditor}
                // data={spaceInfo.description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  const plainText = htmlToText(data); // Convert HTML to plain text
                  setSpaceInfo((prev) => ({
                    ...prev,
                    description: plainText, // Save as plain text
                  }));
                }}
                onInit={(editor) => {
                  editor.editing.view.change((writer) => {
                    writer.setStyle(
                      'height',
                      '300px',
                      editor.editing.view.document.getRoot()
                    );
                  });
                }}
                config={{
                  height: 300,
                  toolbar: [
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    'blockQuote',
                  ],
                }}
                onReady={(editor) => {
                  editor.ui.view.editable.element.style.height = '300px';
                }}
              
              />
            </Col>
            <Col md={12}>
              <Row>
                <Typography
                  variant="h6"
                  style={{
                    fontWeight: 700,
                    fontSize: '20px',
                    paddingBottom: '10px',
                  }}
                >
                  Quy định<span style={{ color: 'red' }}>*</span>
                </Typography>
                <FormGroup>
                  {rulesList.map((rule) => (
                    <FormControlLabel
                      key={rule}
                      control={
                        <Switch
                          onChange={(e) =>
                            handleToggleRule(rule, e.target.checked)
                          }
                        />
                      }
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
          <Row style={{ marginBottom: '200px' }}>
            <Col md={12} style={{ marginBottom: '50px' }}>
              {isLoading ? (
                <Loading />
              ) : (
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      transform: 'translateY(-5px)',
                    },
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100px',
                    width: '100%',
                  }}
                  onClick={() => document.getElementById('file').click()}
                >
                  <input onChange={handleFiles} hidden type="file" id="file" multiple />
                  <AddPhotoAlternateIcon sx={{ fontSize: 50, color: 'primary.main' }} />
                  <Typography sx={{ fontSize: "20px" }}>Thêm ảnh không gian</Typography>
                </Box>
              )}
            </Col>
            <Col md={12}>
              <Row gutter={[16, 16]} type="flex" justify="space-between">
                <Image.PreviewGroup>
                  {imagesPreview?.map((item, index) => (
                    <Col md={2} key={index} className="image-item">
                      <div>
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
                          <CloseIcon sx={{ fontSize: '20px' }} />
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
};

export default AddSpaceInforSpace;
