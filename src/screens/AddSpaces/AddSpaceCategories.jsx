import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import * as MuiIcons from '@mui/icons-material';
import "../../style/AddSpace.css";
import { SpaceContext } from '../../Context/SpaceContext ';
import { Constants } from '../../utils/constants';

export const AddSpaceCategories = () => {
    const [categories, setCategories] = useState([]);
    const { selectedCategoryId, setSelectedCategoryId ,setSelectedAppliances  } = useContext(SpaceContext); // Sử dụng context để lưu categoryId


    useEffect(() => {
        axios
            .get(`${Constants.apiHost}/categories`)
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
            setSelectedAppliances([]); // Xóa appliances đã chọn
        } else {
            setSelectedCategoryId(cateid); // Chọn category mới
            setSelectedAppliances([]); // Xóa appliances đã chọn khi chọn category mới
        }
    }



    return (
        <Container fluid>
            <Row className="">
                <Typography variant='h4' fontWeight={700} className="text-center pb-5" >Chọn thể loại không gian của bạn</Typography>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={6} style={{marginBottom:"100px"}}>
                    <Row>
                        {categories.map((category) => {
                            const Icon = MuiIcons[category.iconName];
                            const isSelected = selectedCategoryId === category._id; 

                            return (
                                <Col md={12} className="mb-3" key={category._id}> 
                                    <Card
                                        className={`text-center  add-space ${isSelected ? 'selected' : ''}`} 
                                        style={{ cursor: 'pointer', boxShadow: "none", height: '100%' }}
                                        onClick={() => handleCategoryClick(category._id)}
                                    >
                                        <Card.Body>
                                            <Box sx={{ fontSize: '3em' }}>
                                                {Icon ? <Icon style={{fontSize:"40px"}} /> : null} 
                                            </Box>
                                            <Card.Title style={{ fontSize: "1.2rem" }}>{category.name}</Card.Title>
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
