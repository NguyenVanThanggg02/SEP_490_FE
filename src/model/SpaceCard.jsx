import React from "react";
import { Carousel, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function SpaceCard() {
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
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-BVbpSZmLndA7MfHIxv2ahIKS/user-IBY8IaMXtVn7IVIdZeyvjx16/img-tELrStREKUbPRYNGVofiCrr8.png?st=2024-09-18T11%3A04%3A08Z&se=2024-09-18T13%3A04%3A08Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-09-18T03%3A46%3A04Z&ske=2024-09-19T03%3A46%3A04Z&sks=b&skv=2024-08-04&sig=lBnJo83RM58fMX1AQbDVum28bl/FR6IiFJrHPN78zSo%3D"
            alt="Slide 1"
            height="180"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-BVbpSZmLndA7MfHIxv2ahIKS/user-IBY8IaMXtVn7IVIdZeyvjx16/img-tELrStREKUbPRYNGVofiCrr8.png?st=2024-09-18T11%3A04%3A08Z&se=2024-09-18T13%3A04%3A08Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-09-18T03%3A46%3A04Z&ske=2024-09-19T03%3A46%3A04Z&sks=b&skv=2024-08-04&sig=lBnJo83RM58fMX1AQbDVum28bl/FR6IiFJrHPN78zSo%3D"
            alt="Slide 2"
            height="180"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-BVbpSZmLndA7MfHIxv2ahIKS/user-IBY8IaMXtVn7IVIdZeyvjx16/img-tELrStREKUbPRYNGVofiCrr8.png?st=2024-09-18T11%3A04%3A08Z&se=2024-09-18T13%3A04%3A08Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-09-18T03%3A46%3A04Z&ske=2024-09-19T03%3A46%3A04Z&sks=b&skv=2024-08-04&sig=lBnJo83RM58fMX1AQbDVum28bl/FR6IiFJrHPN78zSo%3D"
            alt="Slide 3"
            height="180"
          />
        </Carousel.Item>
      </Carousel>
      <Card.Body style={{ padding: "10px" }}>
        <Card.Title style={{ fontSize: "16px", fontWeight: "bold" }}>
          Drift off in the Up house
        </Card.Title>
        <Card.Text style={{ fontSize: "14px", color: "#757575" }}>
          Chủ nhà: Carl Fredricksen
        </Card.Text>
        <Card.Text style={{ fontSize: "14px", color: "#757575" }}>
          Đã hết phòng
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default SpaceCard;
