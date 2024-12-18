import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Box, Typography } from '@mui/material';
import * as MuiIcons from '@mui/icons-material'; // Import all MUI icons
import axios from 'axios';
import "../../style/AddSpace.css"; // Import CSS file
import { SpaceContext } from '../../Context/SpaceContext ';
import { Constants } from '../../utils/constants';

export const AddSpacePageAppliances = ({ categoryId }) => {
    const [appliances, setAppliances] = useState({});
    const { selectedAppliances, setSelectedAppliances, } = useContext(SpaceContext); // Sử dụng context


    useEffect(() => {
        axios
            .get(`${Constants.apiHost}/appliances/${categoryId}`)
            .then((res) => {
                setAppliances(res.data);
            })
            .catch((error) => {
                console.error("Error fetching appliances:", error);
            });
    }, [categoryId]);

    const handleApplianceClick = (appliance) => {
        const isSelected = selectedAppliances.some(
            (item) => item.name === appliance.name && item.iconName === appliance.iconName
        );

        if (isSelected) {
            // Bỏ chọn: Loại appliance ra khỏi mảng
            setSelectedAppliances((prev) =>
                prev.filter(
                    (item) => item.name !== appliance.name || item.iconName !== appliance.iconName
                )
            );
        } else {
            // Chọn: Thêm appliance vào mảng
            setSelectedAppliances((prev) => [
                ...prev,
                { name: appliance.name, iconName: appliance.iconName },
            ]);
        }
    };




    return (
        <Container fluid>
            <Row className="pb-5">
                <Typography variant='h4' fontWeight={700} className="text-center" >Chọn các tiện ích có trong không gian của bạn</Typography>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={6} className="pb-5">
                    <Row>{appliances.appliances?.map((appliance) => {
                        const IconAppliances = MuiIcons[appliance.iconName];
                        const isSelected = selectedAppliances.some(
                            (item) => item.name === appliance.name && item.iconName === appliance.iconName
                        );

                        return (
                            <Col key={appliance._id} md={3} className="pb-5">
                                <Card
                                    className={`text-center add-space ${isSelected ? 'selected' : ''}`}
                                    style={{ cursor: 'pointer', boxShadow: "none", height: '100%',paddingBottom:"10px",width: '100%' }}
                                    onClick={() => handleApplianceClick(appliance)}
                                >
                                    <Card.Body>
                                        <Box sx={{ fontSize: '2rem' }}>
                                            {IconAppliances ? <IconAppliances style={{fontSize:"30px"}} /> : null}
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
    );
}

export default AddSpacePageAppliances;
