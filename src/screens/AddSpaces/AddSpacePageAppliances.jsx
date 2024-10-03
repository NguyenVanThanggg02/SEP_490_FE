import React from 'react'
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import { Box, CardContent, Typography } from '@mui/material';


export const AddSpacePageAppliances = () => {
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
                        <Col md={3} className="pb-5">
                            <Card className="text-center" style={{ cursor: 'pointer',boxShadow:"none" }}>
                                <Card.Body>
                                    <Box sx={{ fontSize: '2rem' }}>
                                        🏠
                                    </Box>
                                    <Card.Title>Studio</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} >
                            <Card className="text-center" style={{ cursor: 'pointer',boxShadow:"none" }}>
                                <Card.Body>
                                    <Box sx={{ fontSize: '2rem' }}>
                                        🏠
                                    </Box>
                                    <Card.Title>Khác</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} >
                            <Card className="text-center" style={{ cursor: 'pointer',boxShadow:"none" }}>
                                <Card.Body>
                                    <Box sx={{ fontSize: '2rem' }}>
                                        🏠
                                    </Box>
                                    <Card.Title>Khác</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} >
                            <Card className="text-center" style={{ cursor: 'pointer',boxShadow:"none" }}>
                                <Card.Body>
                                    <Box sx={{ fontSize: '2rem' }}>
                                        🏠
                                    </Box>
                                    <Card.Title>Khác</Card.Title>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default AddSpacePageAppliances