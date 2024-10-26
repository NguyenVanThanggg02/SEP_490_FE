import React, { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Card, CardContent, Divider, Tabs, Tab, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoriesPosted from './CategoriesPosted';

const EditSpacePosted = () => {
    const [expanded, setExpanded] = useState('panel1');
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChangeAccordion = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const handleChangeTab = (event, newValue) => {
        setSelectedTab(newValue);
    };

    // Nội dung từng tab của từng Accordion
    const renderTabContent = () => {
        if (selectedTab === 0) {
            return <CategoriesPosted/>;
        } else if (selectedTab === 1) {
            return <Typography>Thông tin chi tiết</Typography>;
        } else {
            return <Typography>Bản đồ vị trí</Typography>;
        }
    };

    return (
        <Container>
            <Row>
                {/* Accordion Section */}
                <Col md={4}>
                    <Card>
                        <CardContent>
                            <Typography variant='h5' gutterBottom>Space Title</Typography>
                            <Divider sx={{ bgcolor: "gray", margin: "20px auto", width: "150%", transform: "translateX(-25%)" }} />

                            {/* Accordion với Tabs */}
                            <Accordion expanded={expanded === 'panel1'} onChange={handleChangeAccordion('panel1')}
                                sx={{
                                    boxShadow: 0, // Tạo hiệu ứng giống card
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        backgroundColor: expanded === 'panel1' ? '#e0f7fa' : 'transparent',  // Màu xanh nhạt
                                        color: expanded === 'panel1' ? '#1976d2' : 'inherit',  // Màu xanh đậm
                                        fontWeight: expanded === 'panel1' ? 'bold' : 'normal'  // Làm đậm chữ khi mở
                                    }}


                                >
                                    <Typography>Thông tin cơ bản</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <Tabs
                                            value={selectedTab}
                                            onChange={handleChangeTab}
                                            orientation="vertical"
                                            variant="fullWidth"
                                            TabIndicatorProps={{ style: { left: 0 } }}
                                            sx={{ borderLeft: 1, borderColor: 'divider' }}
                                        >
                                            <Tab label="Thể loại không gian"  sx={{ textTransform: 'none' }} />
                                            <Tab label="Tiện ích không gian" sx={{ textTransform: 'none' }} />
                                        </Tabs>
                                    </div>
                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={expanded === 'panel2'} onChange={handleChangeAccordion('panel2')}
                                sx={{
                                    boxShadow: 0, // Tạo hiệu ứng giống card
                                }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        backgroundColor: expanded === 'panel2' ? '#e0f7fa' : 'transparent',  // Màu xanh nhạt
                                        color: expanded === 'panel2' ? '#1976d2' : 'inherit',  // Màu xanh đậm
                                        fontWeight: expanded === 'panel2' ? 'bold' : 'normal'  // Làm đậm chữ khi mở
                                    }}
                                >
                                    <Typography>Hình ảnh & Tiện ích</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <Tabs value={selectedTab}
                                            onChange={handleChangeTab}
                                            orientation="vertical"
                                            variant="fullWidth"
                                            TabIndicatorProps={{ style: { left: 0 } }}
                                            sx={{ borderLeft: 1, borderColor: 'divider' }}>
                                            <Tab label="Hình ảnh" sx={{ textTransform: 'none' }} />
                                            <Tab label="Tiện ích" sx={{ textTransform: 'none' }} />
                                            <Tab label="Dịch vụ" sx={{ textTransform: 'none' }} />
                                        </Tabs>
                                    </div>

                                </AccordionDetails>
                            </Accordion>

                            <Accordion expanded={expanded === 'panel3'} onChange={handleChangeAccordion('panel3')}
                                sx={{
                                    boxShadow: 0, // Tạo hiệu ứng giống card
                                }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        backgroundColor: expanded === 'panel3' ? '#e0f7fa' : 'transparent',  // Màu xanh nhạt
                                        color: expanded === 'panel3' ? '#1976d2' : 'inherit',  // Màu xanh đậm
                                        fontWeight: expanded === 'panel3' ? 'bold' : 'normal'  // Làm đậm chữ khi mở
                                    }}
                                >
                                    <Typography>Chính sách giá</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

                                        <Tabs value={selectedTab}
                                            onChange={handleChangeTab}
                                            orientation="vertical"
                                            variant="fullWidth"
                                            TabIndicatorProps={{ style: { left: 0 } }}
                                            sx={{ borderLeft: 1, borderColor: 'divider' }}>
                                            <Tab label="Giá theo giờ" sx={{ textTransform: 'none' }} />
                                            <Tab label="Giá theo ngày" sx={{ textTransform: 'none' }} />
                                            <Tab label="Giá theo tháng" sx={{ textTransform: 'none' }} />
                                        </Tabs>
                                    </div>

                                </AccordionDetails>
                            </Accordion>
                        </CardContent>
                    </Card>
                </Col>

                {/* Content Section */}
                <Col md={8}>
                    {renderTabContent()}
                </Col>
            </Row>
        </Container>
    );
};

export default EditSpacePosted;
