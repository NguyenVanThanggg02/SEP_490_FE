import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { SpaceContext } from '../../Context/SpaceContext ';

const AddSpaceLocation = () => {
    const { location, setLocation } = useContext(SpaceContext);

    const handleAddressChange = (e) => {
        setLocation(e.target.value );
    };


    return (
        <Container fluid>
            <Row className="pb-5">
                <Col>
                    <h1 className="text-center">Vị trí không gian của bạn</h1>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={6}>
                    <Row>
                        <TextField
                            label="Địa chỉ"
                            variant="standard"
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
