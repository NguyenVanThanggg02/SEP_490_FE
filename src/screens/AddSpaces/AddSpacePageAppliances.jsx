import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Box } from '@mui/material';
import * as MuiIcons from '@mui/icons-material'; // Import all MUI icons
import axios from 'axios';
import "../../style/AddSpace.css"; // Import CSS file
import { SpaceContext } from '../../Context/SpaceContext ';

export const AddSpacePageAppliances = ({ categoryId }) => {
    const [appliances, setAppliances] = useState({});
    // const [selectedAppliances, setSelectedAppliances] = useState([]); 
    const { selectedAppliances, setSelectedAppliances, selectedApplianceId, setSelectedApplianceId } = useContext(SpaceContext); // Sử dụng context


    useEffect(() => {
        axios
            .get(`http://localhost:9999/appliances/${categoryId}`)
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
                <Col>
                    <h1 className="text-center">Chọn các tiện ích có trong không gian của bạn</h1>
                </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={5}>
                    <Row>{appliances.appliances?.map((appliance) => {
                        const IconAppliances = MuiIcons[appliance.iconName];
                        const isSelected = selectedAppliances.some(
                            (item) => item.name === appliance.name && item.iconName === appliance.iconName
                        );

                        return (
                            <Col key={appliance._id} md={3} className="pb-5">
                                <Card
                                    className={`text-center add-space ${isSelected ? 'selected' : ''}`}
                                    style={{ cursor: 'pointer', boxShadow: "none", height: '100%' }}
                                    onClick={() => handleApplianceClick(appliance)}
                                >
                                    <Card.Body>
                                        <Box sx={{ fontSize: '2rem' }}>
                                            {IconAppliances ? <IconAppliances /> : null}
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
