import React from "react";
import { Carousel, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function SpaceCard({ space }) {
  return (
    <Card style={{ width: "18rem", border: "none", borderRadius: "15px" }}>
      <Carousel
        interval={null}
        controls={true}
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
          Giá mỗi giờ: {space.pricePerHour} VND
        </Card.Text>
        <Card.Text style={{ fontSize: "14px", color: "#757575" }}>
          Trạng thái: {space.status}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default SpaceCard;
