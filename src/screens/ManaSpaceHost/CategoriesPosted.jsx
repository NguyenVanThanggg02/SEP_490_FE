import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Card, CardContent, Divider, Tabs, Tab, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import axios from 'axios';
import * as MuiIcons from '@mui/icons-material';
import { SpaceContext } from '../../Context/SpaceContext ';

const CategoriesPosted = ({spaceId }) => {
    const [editSpace, setEditSpace] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const { selectedCategoryId, setSelectedCategoryId } = useContext(SpaceContext); // Sử dụng context để lưu categoryId

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:9999/categories');
                setCategories(res.data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);
    
    if (error) {
        return <Typography>Có lỗi xảy ra: {error.message}</Typography>;
    }
    const handleCategoryClick = (cateid) => {
        // Nếu category được chọn là category hiện tại, bỏ chọn
        if (selectedCategoryId === cateid) {
            setSelectedCategoryId(null); // Bỏ chọn category
        } else {
            setSelectedCategoryId(cateid); // Chọn category mới
        }
    }
    return (
        <Row>
            <Col md={12}>
                <Card>
                    <CardContent>
                    <Typography>Categories for Space ID: {spaceId}</Typography>
                        <Typography variant='h5' gutterBottom>Thể loại không gian</Typography>
                        <Row>
                        {categories.map((category) => {
                            const Icon = MuiIcons[category.iconName]|| MuiIcons.School;
                            console.log(`Icon for ${category.name}:`, Icon);
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
                                                {Icon &&Icon ? <Icon style={{fontSize:"40px"}} /> : null} 
                                            </Box>
                                            <Card.Title style={{ fontSize: "1.2rem" }}>{category.name}</Card.Title>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                    </CardContent>
                </Card>

            </Col>
        </Row>
    );
};
export default CategoriesPosted;