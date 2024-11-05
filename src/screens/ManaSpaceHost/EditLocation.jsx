import { Typography } from '@mui/material';
import { Select } from 'antd';
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { MapSearch } from '../../components/Map';

const EditLocation = ({ location, setLocation, spaceInfo, setSpaceInfo }) => {
  const [location2, setLocation2] = useState(''); // trường hợp click kéo thả marker
  const [address, setAddress] = useState('');
  const [locationSuggest, setLocationSuggest] = useState([]);

  const handleSetLocationSpace = (value) => {
    setLocation(value);
    const location = locationSuggest.find((i) => i.value === value)?.label;
    const latLng = String(value)?.split(',');
    if (latLng && location) {
      setSpaceInfo((prev) => ({
        ...prev,
        location,
        latLng: [latLng[1], latLng[0]],
      }));
    }
  };

  return (
    <Container fluid>
      <Row className="d-flex justify-content-center align-items-center">
        <Col md={12}>
          <Row>
            <Typography
              variant="h6"
              style={{ fontWeight: 700, fontSize: '20px' }}
            >
              Nhập địa chỉ <span style={{ color: 'red' }}>*</span>
            </Typography>
            <style>
              {`
                                .ant-select-selector{
                                    width: 103%
                                }
                            `}
            </style>
            <Select
              size="large"
              style={{ marginBottom: 50, width: '100%' }}
              onInputKeyDown={(e) => {
                setAddress(e.target.value);
              }}
              showSearch
              placeholder="Nhập địa chỉ"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={locationSuggest}
              onChange={(e) => handleSetLocationSpace(e)}
              value={location || location2}
            >
              {locationSuggest.map((item, index) => {
                return (
                  <Select.Option
                    value={item.value}
                    key={index + '__' + item.label}
                  >
                    {item.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Row>
        </Col>
      </Row>
      <MapSearch
        textSearch={address}
        setLocationSuggest={setLocationSuggest}
        location={location}
        setLocation={setLocation}
        defaultMarker={{
          latitude: spaceInfo?.latLng?.[0] || 21.027448753456103,
          longitude: spaceInfo?.latLng?.[1] || 105.8336955905755,
        }}
        setLocation2={setLocation2}
        handleSetLocationSpace={handleSetLocationSpace}
      />
    </Container>
  );
};

export default EditLocation;
