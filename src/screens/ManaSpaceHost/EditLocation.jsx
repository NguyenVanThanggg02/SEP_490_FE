import { TextField, Typography } from '@mui/material';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import LocationSelect from '../LocationSelect';

const defaultLatLng = {
  lat: 21.027448753456103,
  lng: 105.8336955905755,
};

export const getLatLngFromText = (lngLatString) => {
  const latLng = String(lngLatString)?.split(',');
  const lng = Number(latLng?.[0]);
  const lat = Number(latLng?.[1]);

  const validLatLng = !Number.isNaN(lat) && !Number.isNaN(lng);
  if (validLatLng) return { lat, lng };
  return defaultLatLng;
};

const EditLocation = ({ location, setLocation, spaceInfo, setSpaceInfo }) => {
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center align-items-center">
        <Col md={12}>
          <Row>
            <Typography
              variant="h6"
              style={{ fontWeight: 700, fontSize: '20px' }}
            >
              Chọn địa chỉ <span style={{ color: 'red' }}>*</span>
            </Typography>

            <LocationSelect
              {...{ spaceInfo, setSpaceInfo, location, setLocation }}
            />
            <TextField
              className="mt-2"
              label="Mô tả địa chỉ chi tiết của bạn"
              value={spaceInfo.detailAddress ||''}
              onChange={(e) => 
                setSpaceInfo((prev) => ({
                  ...prev,
                  detailAddress: e.target.value,
                }))
              }
              fullWidth
              sx={{marginLeft:'10px',width:'716px', height:'39px', marginBottom:'20px'}}
              FormHelperTextProps={{
                style: {
                  fontSize: "13px", 
                },
              }}
            />
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default EditLocation;
