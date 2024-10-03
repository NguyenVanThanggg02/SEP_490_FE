import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import { Divider, TextField, Typography } from '@mui/material';
const AddSpaceLocation = () => {
    return (
        <Container fluid >
            <Row className="pb-5">
                <Col>
                    <h1 className="text-center">Vị trí không gian của bạn </h1>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center" >
                <Col md={6}>
                    <Row>
                        <TextField
                            label="Địa chỉ"
                            id="standard-size-normal"
                            defaultValue="Normal"
                            variant="standard"
                        />
                        <img src="https://s3.cloud.cmctelecom.vn/tinhte2/2020/02/4912587_cover_Google_Maps_HCMC_.jpg" alt="" />
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default AddSpaceLocation