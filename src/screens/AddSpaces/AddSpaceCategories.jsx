import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import { Box, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import * as MuiIcons from '@mui/icons-material';


export const AddSpaceCategories = ({ setSelectedCategoryId }) => {

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:9999/categories')
            .then((res) => {
                setCategories(res.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);
    const handleCategoryClick = (cateid) => {
        setSelectedCategoryId(cateid)
    }

    return (
        <Container fluid >
            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            </Box>
            <Row className="pb-5">
                <Col>
                    <h1 className="text-center">Chọn thể loại không gian của bạn </h1>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center" >
                <Col md={5}>
                    <Row >
                        {categories.map((categories) => {
                            const Icon = MuiIcons[categories.iconName];
                            return (
                                <Col md={3} className="pb-5" key={categories._id}>
                                    <Card className="text-center" style={{ cursor: 'pointer', boxShadow: "none",height: '100%' }}
                                        onClick={() => handleCategoryClick(categories._id)}
                                    >
                                        <Card.Body>
                                            <Box sx={{ fontSize: '2rem' }}>
                                                {Icon ? <Icon /> : null} {/* Render dynamically */}
                                            </Box>
                                            <Card.Title style={{ fontSize: "1rem" }} >{categories.name}</Card.Title>
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

export default AddSpaceCategories