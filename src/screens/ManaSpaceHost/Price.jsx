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
import Checkbox from '@mui/material/Checkbox';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { availableSlots } from '../AddSpaces/AddSpaceInforSpace';

const labelForPricePer = {
  pricePerHour: 'Giờ',
  pricePerDay: 'Ngày',
  pricePerWeek: 'Tuần',
  pricePerMonth: ' Tháng',
};

export default function Price({
  spaceInfo,
  setSpaceInfo,
  isGoldenHour,
  setIsGoldenHour,
  goldenHourDetails,
  setGoldenHourDetails,
  priceIncrease,
  setPriceIncrease,
}) {
  const [errors, setErrors] = useState({}); // Để lưu thông báo lỗi cho từng trường
  const [showPricePers, setShowPricePers] = useState({
    pricePerHour: !!spaceInfo.pricePerHour,
    pricePerDay: !!spaceInfo.pricePerDay,
    pricePerWeek: !!spaceInfo.pricePerWeek,
    pricePerMonth: !!spaceInfo.pricePerMonth,
  });

  const onIsGoldenHourChange = () => {
    setIsGoldenHour((prev) => !prev);
    setGoldenHourDetails([]);
  };

  const onPriceIncreaseChange = (e) => {
    setPriceIncrease(e.target.value);

    setGoldenHourDetails((prev) => {
      const updateIncPriceDetails = prev.map((hour) => {
        return { ...hour, priceIncrease: e.target.value };
      });
      return updateIncPriceDetails;
    });
  };

  const onTimeSlotSelect = (slotStartTime, slotEndTime) => {
    setGoldenHourDetails((prev) => {
      const checked = prev.find(
        ({ startTime, endTime }) =>
          startTime === slotStartTime && endTime === slotEndTime
      );
      let updatedDetails = checked
        ? prev.filter(
            ({ startTime, endTime }) =>
              startTime !== slotStartTime && endTime !== slotEndTime
          )
        : [
            ...prev,
            {
              startTime: slotStartTime,
              endTime: slotEndTime,
              priceIncrease: priceIncrease,
            },
          ];

      return updatedDetails;
    });
  };

  const onShowPricePersChange = (event) => {
    const name = event.target.name;
    const checked = event.target.checked;

    if (!checked) {
      const showPriceCheckedKeys = Object.keys(showPricePers).filter(
        (key) => showPricePers[key]
      );

      if (
        showPriceCheckedKeys.length === 1 &&
        name === showPriceCheckedKeys[0]
      ) {
        setErrors((prev) => ({
          ...prev,
          ['perPrice']: 'Bạn phải chọn ít nhất một cách thức thuê',
        }));
      } else {
        setSpaceInfo((prev) => ({ ...prev, [name]: null }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        ['perPrice']: '',
      }));
    }

    setShowPricePers((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const onPricePerValChange = (e) => {
    const { name, value, type } = e.target;
    setSpaceInfo((prev) => ({
      ...prev,
      [name]: value,
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

  const onBlurToValidate = (e) => {
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

  return (
    <Row>
      {/* price per */}
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
          {/* check box for price per */}
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
                {[
                  ...Object.keys(labelForPricePer).map((pricePer, i) => {
                    return (
                      <FormControlLabel
                        key={i}
                        control={
                          <Checkbox
                            checked={showPricePers[pricePer]}
                            onChange={onShowPricePersChange}
                            name={pricePer}
                          />
                        }
                        label={labelForPricePer[pricePer]}
                      />
                    );
                  }),
                ]}
              </FormGroup>
              {!!errors['perPrice'] ? (
                <span style={{ color: 'red' }}>{errors['perPrice']}</span>
              ) : null}
            </FormControl>
          </Col>
          {/* input for price per */}
          {Object.keys(showPricePers).map((pricePer, i) => {
            return showPricePers[pricePer] ? (
              <Col key={i} md={6}>
                <TextField
                  name={pricePer}
                  type="number"
                  variant="outlined"
                  required
                  value={spaceInfo[pricePer]}
                  onChange={onPricePerValChange} // Cập nhật khi người dùng nhập
                  onBlur={onBlurToValidate}
                  error={!!errors[pricePer]} // Hiển thị lỗi nếu có
                  helperText={errors[pricePer]}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        / {labelForPricePer[pricePer]}
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
                  sx={{ marginBottom: '20px' }}
                />
              </Col>
            ) : null;
          })}
        </Row>
      </Col>
      {/* golden hours */}
      <Col md={12}>
        <div class="form-check">
          <input
            class="form-check-input"
            type="checkbox"
            value=""
            checked={isGoldenHour}
            onChange={onIsGoldenHourChange}
            style={{ cursor: 'pointer' }}
          />
          <label class="form-check-label" for="flexCheckDefault">
            Khung giờ vàng
          </label>
        </div>

        {isGoldenHour && (
          <Row style={{ paddingtop: '10px' }}>
            <Grid container justifyContent="center" spacing={1} mt={1} mb={4}>
              {availableSlots.map((slot, index) => {
                const checked = goldenHourDetails.find(
                  ({ startTime, endTime }) =>
                    startTime === slot.startTime && endTime === slot.endTime
                );
                return (
                  <Grid item key={index}>
                    <Button
                      variant={checked ? 'contained' : 'outlined'}
                      onClick={() =>
                        onTimeSlotSelect(slot.startTime, slot.endTime)
                      }
                      style={{ margin: '5px' }}
                    >
                      {slot.startTime} - {slot.endTime}
                    </Button>
                  </Grid>
                );
              })}
            </Grid>
            <Col md={4}>
              <label>
                Phần trăm(%) giá tăng lên:
                <TextField
                  name="priceIncrease"
                  type="number"
                  variant="outlined"
                  fullWidth
                  required
                  min={1}
                  max={100}
                  value={priceIncrease}
                  onChange={onPriceIncreaseChange}
                  onBlur={onBlurToValidate}
                  error={!!errors.priceIncrease} // Hiển thị lỗi nếu có
                  helperText={errors.priceIncrease}
                  sx={{ mb: 4 }}
                />
              </label>
            </Col>
          </Row>
        )}
      </Col>
    </Row>
  );
}
