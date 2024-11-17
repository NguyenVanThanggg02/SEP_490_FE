import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  Box,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { Paginator } from 'primereact/paginator';
import 'primereact/resources/themes/saga-blue/theme.css';
import React, { useEffect, useState } from 'react';
import { Card, Carousel, Col, Container, Row } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import '../style/listSpace.css';
import { priceFormatter } from '../utils/numberFormatter';
import { calculateAverageRating } from './Reviews';
import { SpaceFilter } from './SpaceFilter';

const ListSpace = () => {
  const filterDefault = {
    name: '',
    cateId: 'all',
    applianceNames: [],
    minArea: '',
    maxArea: '',
    typeOfPrice: 'pricePerHour',
    minPrice: '',
    maxPrice: '',
    district: '',
  };
  const [listSpace, setListSpace] = useState([]);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(9);
  const [curentPage, setCurrentPage] = useState(1);
  const [, setSpaceFavos] = useState([]);
  const productsOnPage = listSpace.slice(first, first + rows);
  const [districts, setDistricts] = useState([]);
  const [distances, setDistances] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filter, setFilter] = useState(filterDefault);

  const MAPBOX_TOKEN =
    'pk.eyJ1Ijoic21hbGxtb25rZXkyMDIzIiwiYSI6ImNsdGpxeWc2YjBweWoybXA2OHZ4Zmt0NjAifQ.bRMFGPTFKgsW8XkmAqX84Q';

  const getRoute = async (start, end) => {
    // tính distance 2 location [lng, lat]
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`;
    try {
      const response = await axios.get(url);
      const data = response.data;

      const route = data.routes[0];
      return (route.distance / 1000).toFixed(2);
    } catch (error) {
      console.error('Error getting route:', error);
    }
  };
  // get all space and cal route
  const loadInitData = async () => {
    try {
      const response = await fetch('http://localhost:9999/spaces');
      const data = await response.json();

      if (Array.isArray(data)) {
        setListSpace(data);

        if (navigator?.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const currentPosition = [
                position.coords.latitude,
                position.coords.longitude,
              ];
              const calculatedDistances = [];

              for (const space of data) {
                const distance = await getRoute(currentPosition, space.latLng);
                calculatedDistances.push(distance);
              }

              setDistances(calculatedDistances); // Lưu khoảng cách đã tính vào trạng thái
            },
            (error) => {
              console.error('Lỗi khi lấy vị trí hiện tại:', error);
            }
          );
        } else {
          console.warn('Geolocation is not supported by this browser.');
        }
      } else {
        setListSpace([]);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
      setListSpace([]);
    }
  };
  useEffect(() => {
    loadInitData();
  }, []);

  const changeFavorite = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:9999/spaces/${id}/favorite`
      );
      setSpaceFavos((prevSpace) => ({
        ...prevSpace,
        favorite: response?.data?.favorite,
      }));
      loadInitData()
    } catch (error) {
      console.error('Error change favorite:', error);
    }
  };

  const onPageChange = async (event) => {
    setFirst(event?.first);
    setCurrentPage(event.page + 1);
    setRows(event?.rows);

    // Tính toán khoảng cách cho các không gian mới trên trang
    const currentPosition = await new Promise((resolve) => {
      if (navigator?.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
        });
      } else {
        console.warn('Geolocation is not supported by this browser.');
        resolve(null);
      }
    });

    if (currentPosition) {
      const calculatedDistances = [];
      const currentSpaces = listSpace.slice(
        event.first,
        event.first + event.rows
      );

      for (const space of currentSpaces) {
        const distance = await getRoute(currentPosition, space.latLng);
        calculatedDistances.push(distance);
      }

      setDistances(calculatedDistances);
    }
  };

  // lấy thành phố
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          'https://esgoo.net/api-tinhthanh/1/0.htm'
        );
        // https://provinces.open-api.vn/api/
        setDistricts(response.data.data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, []);
  return (
    <Container>
      <Grid container spacing={3}>
        {/* filter */}
        <Grid item md={3}>
          <SpaceFilter filter={filter} setLoading={setLoading} setListSpace={setListSpace} setFilter={setFilter} loadInitData={loadInitData} filterDefault={filterDefault} />
        </Grid>

        {/* list spaces */}
        <Grid item md={9}>
          <Row>
            {loading ? <p>Loading...</p> : null}
            {!listSpace?.length ? (
              <Col md={12}>
                <h4 style={{ margin: '20px', textAlign: 'center' }}>
                  Không có địa điểm nào !!!
                </h4>
              </Col>
            ) : (
                <Grid container spacing={2}>
                  {

              productsOnPage.map((l, index) => (
                <Grid key={l._id} item xs={12} sm={6} lg={4}>

                  <Box
                    key={l._id}
                    component="div"
                    sx={{
                      width: '100%',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      boxShadow: '0 0 30px rgba(0, 0, 0, 0.1)', // Soft shadow
                      position: 'relative',
                      height: '483px',
                      backgroundColor: '#f5f5f5',
                      '&:hover': {
                        boxShadow: '0 4px 40px rgba(0, 0, 0, 0.2)', // Hover shadow effect
                        transform: 'translateY(-10px)', // Slight upward movement
                      },
                      transition: 'all 0.3s ease', // Smooth transition on hover
                    }}
                  >
                    {/* Favorite Icon */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1,
                        color: l.favorite ? '#FF385C' : 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slight transparent background
                        borderRadius: '50%', // Make it circular
                        padding: '8px', // Add some padding for better touch area
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker background on hover
                        },
                      }}
                      onClick={() => changeFavorite(l?._id)}
                    >
                      {l.favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>

                    {/* Carousel for images */}
                    <Carousel interval={null} controls={false} indicators={true}>
                      {l.images && l.images.length > 0 ? (
                        l.images.map((img, index) => (
                          <Carousel.Item key={index}>
                            <img
                              className="d-block w-100"
                              src={img.url}
                              alt={`Ảnh slide ${index + 1}`}
                              height="270"
                              style={{
                                objectFit: 'cover',
                                borderTopLeftRadius: '15px',
                                borderTopRightRadius: '15px',
                              }}
                            />
                          </Carousel.Item>
                        ))
                      ) : (
                        <Carousel.Item>
                          <img
                            className="d-block w-100"
                            src="default-image-url.png"
                            alt="Ảnh mặc định"
                            height="220"
                              style={{
                                objectFit: 'cover',
                                borderTopLeftRadius: '15px',
                                borderTopRightRadius: '15px',
                              }}
                          />
                        </Carousel.Item>
                      )}
                    </Carousel>

                    {/* Card Content */}
                    <Link to={`/spaces/${l?._id}`} style={{ textDecoration: 'none' }}>
                      <CardContent sx={{ padding: 2 }}>
                        <Grid container direction="column" sx={{ height: '100%' }} rowSpacing={1}>
                          <Grid item xs>
                            <Typography variant="h6" sx={{
                              fontWeight: 'bold', color: '#2d2d2d', display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              WebkitLineClamp: 2,
                              textOverflow: 'ellipsis',
                              minHeight: "64px"
                            }}>
                          {l.name}
                            </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="body2" sx={{ color: '#757575', minHeight: '40px' }}>
                          Địa điểm: {l.location}
                            </Typography>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="body2" sx={{ color: '#757575', fontWeight: 'bold' }}>
                          Quãng đường:{' '}
                              {distances[index] ? `${distances[index]} km` : 'Không xác định.'}
                            </Typography>
                          </Grid>

                          <Grid item xs>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2d2d2d' }}>
                            Giá: {priceFormatter(l.pricePerHour)} / VND
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <StarFill style={{ color: '#ffb742', marginRight: '8px' }} />
                              <Typography variant="body2" sx={{ color: '#2d2d2d' }}>
                              {calculateAverageRating(l.reviews)}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Link>
                  </Box>
                </Grid>
              ))
                  }
                </Grid>
            )}
          </Row>
        </Grid>
      </Grid>
      <Row
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '20px',
        }}
      >
        <Paginator
          style={{ backgroundColor: '#f9f9f9' }}
          first={first}
          rows={rows}
          totalRecords={listSpace.length}
          onPageChange={onPageChange}
        />
      </Row>
    </Container>
  );
};

export default ListSpace;
