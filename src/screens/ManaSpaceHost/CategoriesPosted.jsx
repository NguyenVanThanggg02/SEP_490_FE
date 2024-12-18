import * as MuiIcons from '@mui/icons-material';
import { Box, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { Constants } from '../../utils/constants';

const CategoriesPosted = ({
  spaceInfo,
  selectedCategoryId,
  setSelectedCategoryId,
  setSelectedAppliances,
  setIsNotChangeData,
  isChangeAppliancesOfInitialCate,
  setIsChangeAppliancesOfInitialCate,
}) => {
  const initialSpaceInfoRef = useRef(spaceInfo);
  const location = useLocation();
  const { spaceId } = location.state;

  const [categories, setCategories] = useState([]);

  console.log('CategoriesPosted', spaceId, selectedCategoryId);

  useEffect(() => {
    axios
      .get(`${Constants.apiHost}/categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleCategoryClick = (cateid) => {
    setIsNotChangeData(false);
    setSelectedCategoryId(cateid); // Chọn category mới
    // neu cate nay la cate ban dau,
    console.log(
      'cateid',
      cateid,
      initialSpaceInfoRef.current,
      isChangeAppliancesOfInitialCate
    );
    if (cateid === initialSpaceInfoRef.current.appliancesId.categoryId) {
      // user chua tung update appliance cua cate ban dau=> set lai aplliances nhu luc ban dau
      if (!isChangeAppliancesOfInitialCate) {
        setSelectedAppliances(
          initialSpaceInfoRef.current.appliancesId.appliances
        );
        return;
        // da thay doi app cua inital ban dau
      } else {
        setIsChangeAppliancesOfInitialCate(true);
      }
    } else {
      setSelectedAppliances([]); // Xóa appliances đã chọn khi chọn category mới
    }
  }
  return (
    <Row>
      <Col md={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Thể loại không gian
            </Typography>
            <Row>
              {categories.map((category) => {
                const Icon = MuiIcons[category.iconName];
                const isSelected = selectedCategoryId === category._id;

                return (
                  <Col md={12} className="mb-3" key={category._id}>
                    <Card
                      className={`text-center  add-space ${isSelected ? 'selected' : ''}`}
                      sx={{
                        backgroundColor: isSelected ? '#e0f7fa' : '#fff',
                      }}
                      style={{
                        cursor: 'pointer',
                        boxShadow: 'none',
                        height: '100%',
                      }}
                      onClick={() => handleCategoryClick(category._id)}
                    >
                      <CardContent>
                        <Box sx={{ fontSize: '3em' }}>
                          {!!Icon ? (
                            <Icon style={{ fontSize: '40px' }} />
                          ) : null}
                        </Box>
                        <Typography
                          sx={{ color: 'text.secondary', fontSize: 14 }}
                        >
                          {category.name}
                        </Typography>
                        {/* <Card.Title style={{ fontSize: '1.2rem' }}>
                          {JSON.stringify(category)}
                        </Card.Title> */}
                      </CardContent>
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
