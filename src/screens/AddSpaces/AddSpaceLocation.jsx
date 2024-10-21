import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { TextField, Typography } from '@mui/material';
import { SpaceContext } from '../../Context/SpaceContext ';

const AddSpaceLocation = () => {
    const { location, setLocation } = useContext(SpaceContext);

    const handleAddressChange = (e) => {
        setLocation(e.target.value );
    };


    return (
        <Container fluid>
            <Row className="pb-5">
                <Typography variant='h4' fontWeight={700} className="text-center" >Vị trí không gian của bạn</Typography>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={6}>
                    <Row>
                    <Typography variant="h6"  style={{ fontWeight: 700,fontSize:"20px" }} >Nhập địa chỉ <span style={{color:"red"}}>*</span></Typography>
                        <TextField
                            variant="outlined"
                            value={location}
                            onChange={handleAddressChange}
                            fullWidth
                        />
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default AddSpaceLocation;
