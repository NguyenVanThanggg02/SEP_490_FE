import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [spaceFavorites, setSpaceFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteSpaces();
  }, []);

  const fetchFavoriteSpaces = async () => {
    try {
      const response = await axios.get("http://localhost:9999/spaces/favorite");
      const filteredSpaces = response.data.filter(space => space.censorship === "Chấp nhận");
      setSpaceFavorites(filteredSpaces);
    } catch (error) {
      console.error("Error fetching spaces:", error);
    }
  };

  const toggleFavorite = async (spaceId, event) => {
    event.stopPropagation();
    try {
      const response = await axios.put(`http://localhost:9999/spaces/${spaceId}/favorite`);
      setSpaceFavorites(prevSpaces =>
        prevSpaces.map(space =>
          space._id === spaceId ? { ...space, favorite: response.data.favorite } : space
        )
      );
      await fetchFavoriteSpaces(); // Refresh favorites list
    } catch (error) {
      console.error("Error changing favorite:", error);
    }
  };

  const handleCardClick = (id) => navigate(`/spaces/${id}`);

  const renderFavoriteIcon = (isFavorite, spaceId) => (
    isFavorite ? 
      <FavoriteIcon style={{ color: "#FF385C" }} onClick={(e) => toggleFavorite(spaceId, e)} /> :
      <FavoriteBorderIcon style={{ color: "white" }} onClick={(e) => toggleFavorite(spaceId, e)} />
  );

  return (
    <Container>
      <Row>
        <Col md={12}>
          <Row>
            {spaceFavorites.map((space, index) => (
              <Col md={3} key={index}>
                <div
                  style={{ position: "relative", height: "100%" }}
                  onClick={() => handleCardClick(space._id)}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      zIndex: 1,
                      cursor: "pointer",
                    }}
                  >
                    {renderFavoriteIcon(space.favorite, space._id)}
                  </div>
                  <CardMedia
                    sx={{ height: 250 }}
                    image={space.images[0]}
                    title="image space"
                    style={{
                      objectFit: "cover",
                      borderRadius: "15px",
                    }}
                  />
                  <CardContent style={{ padding: '20px 0' }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {space.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {space.pricePerHour} VND / hour
                    </Typography>
                  </CardContent>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Favorites;
