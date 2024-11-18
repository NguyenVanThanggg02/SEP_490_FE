import { Typography } from '@mui/material';
import { Select } from 'antd';
import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { MapSearch } from '../../components/Map';

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
  const [location2, setLocation2] = useState(''); // trường hợp click kéo thả marker
  const [address, setAddress] = useState('');
  const [locationSuggest, setLocationSuggest] = useState([]);

  const handleSetLocationSpace = (lngLatString) => {
    console.log('handleSetLocationSpace input', lngLatString);
    const suggest = locationSuggest.find(
      (value) => value.value === lngLatString
    );
    if (!suggest) {
      console.log('selectVal not correct format', lngLatString);
      return;
    }
    console.log('full_address', suggest.label);
    setLocation(suggest.label);

    const { lat, lng } = getLatLngFromText(lngLatString);
    setSpaceInfo((prev) => ({
      ...prev,
      location: suggest.label,
      latLng: [lat, lng],
    }));
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
                console.log('locationSuggest', item);
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
        locationSuggest={locationSuggest}
        setLocationSuggest={setLocationSuggest}
        location={location}
        setLocation={setLocation}
        defaultMarker={{
          latitude: spaceInfo?.latLng?.[0] || defaultLatLng.lat,
          longitude: spaceInfo?.latLng?.[1] || defaultLatLng.lat,
        }}
        setLocation2={setLocation2}
        handleSetLocationSpace={handleSetLocationSpace}
      />
    </Container>
  );
};

export default EditLocation;
