import { Typography } from '@mui/material';
import { Select } from 'antd';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { SpaceContext } from '../../Context/SpaceContext ';
import { GooMap } from '../GooMap';

const AddSpaceLocation = () => {
  const [textSearch, setTextSearch] = useState('');
  const [locationSuggests, setLocationSuggests] = useState([]);
  const { spaceInfo, setSpaceInfo, location, setLocation } =
    useContext(SpaceContext);
  const GOO_KEY = 'fxMWOQAGy0KR2fAJND6Gi360iGmqZvaOZWr49ePC';

  const fetchPlaceDetail = async (placeId) => {
    try {
      const response = await axios.get(`https://rsapi.goong.io/place/detail`, {
        params: {
          place_id: placeId,
          api_key: GOO_KEY,
        },
      });

      console.log('response when fetchPlaceDetail', response);

      return {
        lat: response.data.result.geometry.location.lat,
        lng: response.data.result.geometry.location.lng,
      };
    } catch (error) {
      console.error('Lỗi khi lấy thong tin địa chỉ chi tiet:', error);
    }
  };

  const handleSetLocationSpace = async (e) => {
    const locationSuggestString = e;
    console.log('locationSuggests', e, locationSuggests);

    const label = locationSuggestString.split('***')[0];
    const placeId = locationSuggestString.split('***')[1];

    const latLng = await fetchPlaceDetail(placeId);

    if (latLng) {
      const lat = latLng.lat;
      const lng = latLng.lng;

      setTextSearch(label);
      setLocation(label);
      setSpaceInfo((prev) => ({ ...prev, latLng: [Number(lat), Number(lng)] }));
    } else {
      toast.error('Get place detail failed');
    }
  };

  const onTextSearchChange = async (e) => {
    const textSearch = e.target.value;
    setTextSearch(textSearch);
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
              onInputKeyDown={onTextSearchChange}
              showSearch
              placeholder="Nhập địa chỉ"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={locationSuggests}
              onChange={handleSetLocationSpace}
              value={location}
            >
              {locationSuggests.map((item, index) => {
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
      <GooMap
        {...{
          textSearch,
          setTextSearch,
          setLocationSuggests,
          locationSuggests,
          location,
          setLocation,
          spaceInfo,
          setSpaceInfo,
        }}
      />
    </Container>
  );
};

export default AddSpaceLocation;
