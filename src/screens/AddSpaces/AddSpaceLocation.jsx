import { Typography } from '@mui/material';
import { Select } from 'antd';
import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { MapSearch } from '../../components/Map';
import { SpaceContext } from '../../Context/SpaceContext ';
import { getLatLngFromText } from '../ManaSpaceHost/EditLocation';

const AddSpaceLocation = () => {
  const [location, setLocation] = useState('');
  const [location2, setLocation2] = useState(''); // trường hợp click kéo thả marker

  const [address, setAddress] = useState('');
  const [locationSuggest, setLocationSuggest] = useState([]);
  const { setSpaceInfo } = useContext(SpaceContext);

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
      <Row className="pb-5">
        <Typography variant="h4" fontWeight={700} className="text-center">
          Vị trí không gian của bạn
        </Typography>
      </Row>
      <Row className="d-flex justify-content-center align-items-center">
        <Col md={6}>
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
                // console.log("nhập", e.target.value);
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
            {/* <Autocomplete
                            freeSolo
                            id="free-solo-2-demo"
                            disableClearable
                            options={locationSuggest.map((option) => option.value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Nhập địa chỉ"
                                    value={location || location2}

                                    label="Search input"
                                    onChange={(e) => handleSetLocationSpace(e)}
                                    onInputKeyDown={(e) => {
                                        console.log("nhập", e.target.value); setAddress(e.target.value)
                                    }}
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            type: 'search',
                                        },
                                    }}
                                />
                            )}
                        /> */}
          </Row>
        </Col>
      </Row>
      <MapSearch
        textSearch={address}
        setLocationSuggest={setLocationSuggest}
        locationSuggest={locationSuggest}
        location={location}
        setLocation={setLocation}
        setLocation2={setLocation2}
        handleSetLocationSpace={handleSetLocationSpace}
      />
    </Container>
  );
};

export default AddSpaceLocation;
