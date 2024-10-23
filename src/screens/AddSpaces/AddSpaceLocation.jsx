import React, { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { TextField, Typography } from '@mui/material';
import { MapSearch } from '../../components/Map';
import { Select } from 'antd';

const AddSpaceLocation = () => {
    const [location, setLocation] = useState('');
    const [location2, setLocation2] = useState(''); // trường hợp click kéo thả marker 

    const [address, setAddress] = useState('');
    const [locationSuggest, setLocationSuggest] = useState(null);
console.log("locationSuggest", locationSuggest);


    return (
        <Container fluid>
            <Row className="pb-5">
                <Typography variant='h4' fontWeight={700} className="text-center">Vị trí không gian của bạn</Typography>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={6}>
                    <Row>
                        <Typography variant="h6" style={{ fontWeight: 700, fontSize: "20px" }}>Nhập địa chỉ <span style={{ color: "red" }}>*</span></Typography>
                        
                        <Select
                        size='large'
                        style={{marginBottom: 50}}
                            onInputKeyDown={(e) => {
                                console.log("nhập", e.target.value); setAddress(e.target.value)
                            }}
                            showSearch
                            placeholder="Nhập địa chỉ"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={locationSuggest}
                            onChange={(e) => setLocation(e)}
                            value={location || location2}
                        />
                    </Row>
                </Col>
            </Row>
            <MapSearch textSearch={address} setLocationSuggest={setLocationSuggest} location={location} setLocation={setLocation} setLocation2={setLocation2}/>
        </Container>
    );
};

export default AddSpaceLocation;
