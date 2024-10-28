import React, { useContext, useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Card, CardContent, Divider, Tabs, Tab, Typography, Accordion, AccordionSummary, AccordionDetails, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import * as MuiIcons from '@mui/icons-material';
import { SpaceContext } from '../../Context/SpaceContext ';

const CategoriesPosted = () => {
    const location = useLocation();
    const spaceId = location.state;
    const [editSpace, setEditSpace] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const { selectedCategoryId, setSelectedCategoryId, setSelectedAppliances } = useContext(SpaceContext); // Sử dụng context để lưu categoryId
console.log(spaceId);

    useEffect(() => {
        const fetchSpaceData = async () => {
            try {
                const response = await axios.get(`http://localhost:9999/spaces/${spaceId}`);
                setEditSpace(response.data);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSpaceData();
    }, [spaceId]);

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


    if (loading) return <Typography variant="h6">Đang tải...</Typography>;


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
        <Row>
            <Col md={12}>
                <Card>
                    <CardContent>
                        <Typography variant='h5' gutterBottom>Thể loại không gian</Typography>
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
                                                    {Icon ? <Icon style={{ fontSize: "40px" }} /> : null}
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