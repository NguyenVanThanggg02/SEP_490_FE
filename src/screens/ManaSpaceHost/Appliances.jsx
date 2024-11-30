import * as MuiIcons from '@mui/icons-material'; // Import all MUI icons
import { Box } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import '../../style/AddSpace.css'; // Import CSS file

export const Appliances = ({
  selectedCategoryId: categoryId,
  selectedAppliances,
  setSelectedAppliances,
}) => {
  console.log('Appliances', selectedAppliances);
  const [appliances, setAppliances] = useState({});

  useEffect(() => {
    axios
      .get(`http://localhost:9999/appliances/${categoryId}`)
      .then((res) => {
        setAppliances(res.data);
      })
      .catch((error) => {
        console.error('Error fetching appliances:', error);
      });
  }, [categoryId]);

  const handleApplianceClick = (appliance) => {
    const isSelected = selectedAppliances.some(
      (item) =>
        item.name === appliance.name && item.iconName === appliance.iconName
    );

    if (isSelected) {
      // Bỏ chọn: Loại appliance ra khỏi mảng
      setSelectedAppliances((prev) =>
        prev.filter(
          (item) =>
            item.name !== appliance.name || item.iconName !== appliance.iconName
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
    <Container>
      <Row className="d-flex ">
        <Col
          md={6}
          className="pb-5"
          style={{
            width: '100%',
          }}
        >
          <Row>
            {appliances.appliances?.map((appliance) => {
              const IconAppliances = MuiIcons[appliance.iconName];
              const isSelected = selectedAppliances.some(
                (item) =>
                  item.name === appliance.name &&
                  item.iconName === appliance.iconName
              );

              return (
                <Col key={appliance._id} md={3} className="pb-5">
                  <Card
                    className={`text-center add-space ${isSelected ? 'selected' : ''}`}
                    style={{
                      cursor: 'pointer',
                      boxShadow: 'none',
                      height: '100%',
                      paddingBottom: '10px',
                      width: '100%',
                    }}
                    onClick={() => handleApplianceClick(appliance)}
                  >
                    <Card.Body>
                      <Box sx={{ fontSize: '2rem' }}>
                        {IconAppliances ? (
                          <IconAppliances style={{ fontSize: '30px' }} />
                        ) : null}
                      </Box>
                      <Card.Title style={{ fontSize: '1rem' }}>
                        {appliance.name}
                      </Card.Title>
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
};

export default Appliances;
