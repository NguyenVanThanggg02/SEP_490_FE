import React, { useState } from "react";
import { Carousel, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios";
import { priceFormatter } from "../utils/numberFormatter";


function SpaceCard({ space }) {
  const [favorite, setFavorite] = useState(space.favorite);

  const changeFavorite = async (event) => {
    event.stopPropagation()

    try {
      const response = await axios.put(`http://localhost:9999/spaces/${space._id}/favorite`);
      setFavorite(response.data.favorite);
    } catch (error) {
      console.error("Error change favorite:", error);
    }
  };


  return (
    <Card style={{ width: "18rem", border: "none", borderRadius: "15px", position: "relative", height:'350px' }}>
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1,
          cursor: "pointer",
        }}
        onClick={changeFavorite}
      >
        {/* Hiển thị icon dựa trên trạng thái favorite */}
        {favorite ? <FavoriteIcon style={{ color: "#FF385C" }} /> : <FavoriteBorderIcon style={{ color: "white" }} />}
      </div>
      <Carousel
        interval={null}
        controls={false}
        indicators={true}
        prevIcon={
          <span aria-hidden="true" className="carousel-control-prev-icon" />
        }
        nextIcon={
          <span aria-hidden="true" className="carousel-control-next-icon" />
        }
      >
        {space.images && space.images.length > 0 ? (
          space.images.map((img, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={img}
                alt={`Ảnh slide ${index + 1}`}
                height="180"
                style={{borderTopLeftRadius:'15px', borderTopRightRadius:'15px'}}
              />

            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="default-image-url.png"
              alt="Ảnh mặc định"
              height="180"
            />
          </Carousel.Item>
        )}
      </Carousel>
      <Card.Body style={{ padding: "10px" }}>
        <Card.Title style={{ fontSize: "16px", fontWeight: "bold" }}>
          {space.name}
        </Card.Title>

        <Card.Text style={{ fontSize: "14px", color: "#757575" }}>
          Địa điểm: {space.location}
        </Card.Text>
        <Card.Text style={{ fontSize: "14px", color: "#757575" }}>
          Giá mỗi giờ: {priceFormatter(space.pricePerHour)} VND
        </Card.Text>
        <Card.Text style={{ fontSize: "14px", color: "#757575" }}>
          Trạng thái: {space.status}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default SpaceCard;
