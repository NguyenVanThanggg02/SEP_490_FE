import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export const Favorites = () => {
  const [spaceFavo, setSpaceFavos] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/spaces/favorite")
      .then((response) => {
        const filterItems = filterSapces(response.data);
        setSpaceFavos(filterItems);
      })
      .catch((error) => {
        console.error("Error fetching spaces:", error);
      });
  }, []);
  const filterSapces = (spaces) => {
    return spaces.filter((spaces) => spaces.censorship === "Chấp nhận");
  };
  const changeFavorite = async (spaceId, event) => {
    event.stopPropagation()
    try {
      const response = await axios.put(`http://localhost:9999/spaces/${spaceId}/favorite`);
      setSpaceFavos(prevSpaces =>
        prevSpaces.map(space =>
          space._id === spaceId ? { ...space, favorite: response.data.favorite } : space
        )
      );
      const updatedSpacesResponse = await axios.get("http://localhost:9999/spaces/favorite");
      setSpaceFavos(updatedSpacesResponse.data); 

    } catch (error) {
      console.error("Error change favorite:", error);
    }
  };

  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/spaces/${id}`);
  };

  return (
    <Container fluid>
      <Row>
        <Col md={7}>
          <Row>
            {spaceFavo.map((spaceF, index) => (
              <Col md={4}>
                <Card style={{ position: "relative" }} key={index}
                  onClick={() => handleCardClick(spaceF._id)}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      zIndex: 1,
                      cursor: "pointer",
                    }}
                    onClick={(event) => changeFavorite(spaceF._id, event)}
                  >
                    {/* Hiển thị icon dựa trên trạng thái liked */}
                    {spaceF.favorite ? <FavoriteIcon style={{ color: "#FF385C" }} /> : <FavoriteBorderIcon style={{ color: "white" }} />}
                  </div>
                  <CardMedia
                    sx={{ height: 250 }}
                    image={spaceF.images[0]}
                    title="image spaceF"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {spaceF.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {spaceF.pricePerHour} VND / hour
                    </Typography>
                  </CardContent>
                </Card>


              </Col>
            ))}

          </Row>
        </Col>
        <Col md={5}>
          <img src="https://preview.redd.it/google-maps-never-ceases-to-amaze-me-v0-0r498ftiaouc1.jpeg?width=1290&format=pjpg&auto=webp&s=2eacadf939a50eb88a6100ddf389d22980ad3d3d"
            alt="map"
            style={{ width: "100%" }} />
        </Col>
      </Row>
    </Container>
  )
}
export default Favorites

