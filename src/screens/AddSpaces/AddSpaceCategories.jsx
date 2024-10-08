import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Box } from '@mui/material';
import axios from 'axios';
import * as MuiIcons from '@mui/icons-material';
import "../../style/AddSpace.css";
import { SpaceContext } from '../../Context/SpaceContext ';

export const AddSpaceCategories = () => {
    const [categories, setCategories] = useState([]);
    // const [selectedCategoryId, setSelectedCategoryIdState] = useState(null); 
    const { selectedCategoryId, setSelectedCategoryId } = useContext(SpaceContext); // Sử dụng context để lưu categoryId


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
        // Nếu category được chọn là category hiện tại, bỏ chọn
        if (selectedCategoryId === cateid) {
            setSelectedCategoryId(null); // Bỏ chọn category
        } else {
            setSelectedCategoryId(cateid); // Chọn category mới
        }
    }


    return (
        <Container fluid>
            <Row className="pb-5">
                <Col>
                    <h1 className="text-center">Chọn thể loại không gian của bạn</h1>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={5}>
                    <Row>
                        {categories.map((category) => {
                            const Icon = MuiIcons[category.iconName];
                            const isSelected = selectedCategoryId === category._id; 

                            return (
                                <Col md={3} className="pb-5" key={category._id}>
                                    <Card
                                        className={`text-center add-space ${isSelected ? 'selected' : ''}`} 
                                        style={{ cursor: 'pointer', boxShadow: "none", height: '100%' }}
                                        onClick={() => handleCategoryClick(category._id)}
                                    >
                                        <Card.Body>
                                            <Box sx={{ fontSize: '2rem' }}>
                                                {Icon ? <Icon /> : null} {/* Render icon dynamically */}
                                            </Box>
                                            <Card.Title style={{ fontSize: "1rem" }}>{category.name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default AddSpaceCategories;
