import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';

import Checkbox from '@mui/material/Checkbox';
import { availableSlots } from '../AddSpaces/AddSpaceInforSpace';

export default function Price({
  spaceInfo,
  setSpaceInfo,
  isGoldenHour,
  setIsGoldenHour,
  goldenHourDetails,
  setGoldenHourDetails,
}) {
  const [selectedSlot, setSelectedSlot] = useState({
    startDate: '',
    endDate: '',
  });

  const handleCheckboxChange = () => {
    setIsGoldenHour(!isGoldenHour);
  };
  const handleInputHourChange = (e) => {
    setGoldenHourDetails({
      ...goldenHourDetails,
      [e.target.name]:
        e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    });
  };
  const handleTimeSlotSelection = (slotStartTime, slotEndTime) => {
    setSelectedSlot({
      startTime: slotStartTime,
      endTime: slotEndTime,
    });

    setGoldenHourDetails({
      ...goldenHourDetails,
      startTime: slotStartTime,
      endTime: slotEndTime,
    });
  };
  const [errors, setErrors] = useState({}); // Để lưu thông báo lỗi cho từng trường

  const [state, setState] = React.useState({
    hour: !!spaceInfo.pricePerHour,
    day: !!spaceInfo.pricePerDay,
    week: !!spaceInfo.pricePerWeek,
    month: !!spaceInfo.pricePerMonth,
  });

  // const handleChange = (event) => {
  //   setState({
  //     ...state,
  //     [event.target.name]: event.target.checked,
  //   });
  // };
  const handleChange = (event) => {
    const { name, checked } = event.target;
  
    setState({
      ...state,
      [name]: checked,
    });
  
    // Cập nhật giá trị trong spaceInfo
    setSpaceInfo((prev) => ({
      ...prev,
      [name === 'hour' ? 'pricePerHour' :
        name === 'day' ? 'pricePerDay' :
        name === 'week' ? 'pricePerWeek' :
        name === 'month' ? 'pricePerMonth' : '']: 
        checked ? prev[name === 'hour' ? 'pricePerHour' :
                     name === 'day' ? 'pricePerDay' :
                     name === 'week' ? 'pricePerWeek' :
                     name === 'month' ? 'pricePerMonth' : 0] : null, // Gán null nếu bỏ chọn
    }));
  };
  

  const { hour, day, week, month } = state;

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setSpaceInfo((prev) => ({
      ...prev,
      [name]: Number(value),
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
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;

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
    } else {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };
  return (
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
          Giá không gian <span style={{ color: 'red' }}>*</span>
        </Typography>
        <Row>
          <Col md={12} align="center">
            <Typography
              variant="h6"
              align="center"
              style={{
                fontWeight: 600,
                fontSize: '16px',
              }}
            >
              Chọn cách thức thuê
            </Typography>
            <FormControl component="fieldset" variant="standard">
              <FormGroup sx={{ flexDirection: 'row' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hour}
                      onChange={handleChange}
                      name="hour"
                    />
                  }
                  label="Giờ"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={day}
                      onChange={handleChange}
                      name="day"
                    />
                  }
                  label="Ngày"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={week}
                      onChange={handleChange}
                      name="week"
                    />
                  }
                  label="Tuần"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={month}
                      onChange={handleChange}
                      name="month"
                    />
                  }
                  label="Tháng"
                />
              </FormGroup>
            </FormControl>
          </Col>
          {hour && (
            <Col md={6}>
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
                  endAdornment: (
                    <InputAdornment position="end">/ giờ</InputAdornment>
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
                sx={{ marginBottom: '20px' }}
              />
            </Col>
          )}

          {day && (
            <Col md={6}>
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
                  endAdornment: (
                    <InputAdornment position="end">/ ngày</InputAdornment>
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
                sx={{ marginBottom: '20px' }}
              />
            </Col>
          )}

          {week && (
            <Col md={6}>
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
                  endAdornment: (
                    <InputAdornment position="end">/ tuần</InputAdornment>
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
              />
            </Col>
          )}

          {month && (
            <Col md={6}>
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
                  endAdornment: (
                    <InputAdornment position="end">/ tháng</InputAdornment>
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
                sx={{ marginBottom: '20px' }}
              />
            </Col>
          )}
        </Row>
      </Col>
      <Col md={12}>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            checked={isGoldenHour}
            onChange={handleCheckboxChange}
            style={{ cursor: 'pointer' }}
          />
          <label class="form-check-label" for="flexCheckDefault">
            Khung giờ vàng
          </label>
        </div>

        {isGoldenHour && (
          <Row style={{ paddingtop: '10px' }}>
            {/* <Col md={4}>
                        <label>
                          Giờ bắt đầu:
                          <input
                            type="time"
                            name="startTime"
                            value={goldenHourDetails.startTime}
                            onChange={handleInputHourChange}
                            required
                          />
                        </label>
                      </Col>
                      <Col md={4}>
                        <label>
                          Giờ kết thúc:
                          <input
                            type="time"
                            name="endTime"
                            value={goldenHourDetails.endTime}
                            onChange={handleInputHourChange}
                            required
                          />
                        </label>
                      </Col> */}
            <Grid container justifyContent="center" spacing={1} mt={1} mb={4}>
              {availableSlots.map((slot, index) => (
                <Grid item key={index}>
                  <Button
                    variant={
                      goldenHourDetails?.startTime === slot?.startTime &&
                      goldenHourDetails?.endTime === slot?.endTime
                        ? 'contained'
                        : 'outlined'
                    }
                    onClick={() =>
                      handleTimeSlotSelection(slot.startTime, slot.endTime)
                    }
                    style={{ margin: '5px' }}
                  >
                    {slot.startTime} - {slot.endTime}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Col md={4}>
              <label>
                Phần trăm(%) giá tăng lên:
                <input
                  type="number"
                  name="priceIncrease"
                  value={goldenHourDetails?.priceIncrease}
                  onChange={handleInputHourChange}
                  min="0"
                  max="100"
                  required
                />
              </label>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}
