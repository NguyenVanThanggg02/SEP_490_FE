import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import { Box, CardContent, Typography } from '@mui/material';
import * as MuiIcons from '@mui/icons-material'; // Import all MUI icons
import axios from 'axios';


export const AddSpacePageAppliances = ({ categoryId }) => {

    const [appliances, setAppliances] = useState({});
    console.log(categoryId);

    useEffect(() => {
        axios
            .get(`http://localhost:9999/appliances/${categoryId}`)
            .then((res) => {
                console.log(res.data);
                setAppliances(res.data);

            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);
    console.log(appliances);

    return (
        <Container fluid >
            <Row className="pb-5">
                <Col>
                    <h1 className="text-center">Chọn các tiện ích có trong  không gian của bạn </h1>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center" >
                <Col md={5}>
                    <Row >
                        {appliances.appliances?.map((appliance) => {
                            const IconAppliances = MuiIcons[appliance.iconName];
                            return (
                                <Col key={appliance._id} md={3} className="pb-5">
                                    <Card className="text-center" style={{ cursor: 'pointer', boxShadow: "none", height: '100%' }}>
                                        <Card.Body>
                                            <Box sx={{ fontSize: '2rem' }}>
                                                {IconAppliances ? <IconAppliances /> : null} {/* Render dynamically */}
                                            </Box>
                                            <Card.Title style={{ fontSize: "1rem" }}>{appliance.name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default AddSpacePageAppliances