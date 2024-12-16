import { Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { priceFormatter } from '../utils/numberFormatter';
import { StarFill } from 'react-bootstrap-icons';
import { calculateAverageRating } from './Reviews';
import { Constants } from '../utils/constants';
export const Favorites = () => {
  const [spaceFavo, setSpaceFavos] = useState([]);

  useEffect(() => {
    axios
      .get(`${Constants.apiHost}/spaces/favorite`)
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
      const response = await axios.put(`${Constants.apiHost}/spaces/${spaceId}/favorite`);
      setSpaceFavos(prevSpaces =>
        prevSpaces.map(space =>
          space._id === spaceId ? { ...space, favorite: response.data.favorite } : space
        )
      );
      const updatedSpacesResponse = await axios.get(`${Constants.apiHost}/spaces/favorite`);
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
    <Container>
      <Row>
        <Col md={12}>
          <Row>
            {spaceFavo.map((spaceF, index) => (
              <Col md={3}>
                <div
                  style={{ position: "relative", height: "100%" }}
                  key={index}
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
                    {spaceF.favorite ? (
                      <FavoriteIcon style={{ color: "#FF385C" }} />
                    ) : (
                      <FavoriteBorderIcon style={{ color: "white" }} />
                    )}
                  </div>
                  <CardMedia
                    sx={{ height: 250 }}
                    image={spaceF?.images?.[0]?.url}
                    title="image spaceF"
                    style={{
                      objectFit: "cover",
                      borderTopLeftRadius: "15px",
                      borderTopRightRadius: "15px",
                      borderBottomLeftRadius: "15px",
                      borderBottomRightRadius: "15px",
                    }}
                  />
                  <CardContent style={{ padding: "20px 0" }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#2d2d2d",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {spaceF.name}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary", marginRight: 2 }}
                        style={{
                          marginLeft: "5px",
                          fontSize: "15px",
                          color: "#2d2d2d",
                          fontWeight: "bold",
                        }}
                      >
                        Giá:{" "}
                        {spaceF.pricePerHour
                          ? `${priceFormatter(spaceF.pricePerHour)} VND/Giờ`
                          : spaceF.pricePerDay
                            ? `${priceFormatter(spaceF.pricePerDay)} VND/Ngày`
                            : // : l.pricePerWeek
                              //   ? `${priceFormatter(l.pricePerWeek)} VND/Tuần`
                              spaceF.pricePerMonth
                              ? `${priceFormatter(spaceF.pricePerMonth)} VND/Tháng`
                              : ""}
                      </Typography>
                      <Typography
                        gutterBottom
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <StarFill
                          style={{
                            color: "#FFCC00",
                            margin: "3px 15px 15px 0",
                          }}
                        />
                        <span style={{ margin: "0 10px 13px -7px" }}>
                          {calculateAverageRating(spaceF.reviews)}
                        </span>
                      </Typography>
                    </div>
                  </CardContent>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
export default Favorites

