import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { priceFormatter } from "../utils/numberFormatter";

const Similar = ({ spaceData }) => {
  const [similarSpaces, setSimilarSpaces] = useState([]);

  useEffect(() => {
    if (spaceData.categoriesId) {
      axios
        .get(`http://localhost:9999/spaces/cate/${spaceData.categoriesId._id}`)
        .then((response) => {
          const filteredSpaces = response.data
            .filter((space) => space._id !== spaceData._id)
            .slice(0, 4);
          setSimilarSpaces(filteredSpaces);
        })
        .catch((error) => {
          console.error("Error fetching similar spaces:", error);
        });
    }
  }, [spaceData]);

  return (
    <Container
      className="similar-product mb-4"
      fluid
      style={{
        boxShadow: "5px 10px 10px 5px #C0C0C0",
        borderRadius: "20px",
        marginTop: "20px",
        width: "100%",
        padding: "0 30px",
        backgroundColor: "white",
      }}
    >
      <Row className="justify-content-center">
        <h3 style={{ margin: "20px" }}>Địa Điểm Tương Tự</h3>
      </Row>
      <Row>
        {similarSpaces.map((space) => (
          <Col
            md={3}
            xs={12}
            className="text-center"
            style={{ paddingBottom: "40px" }}
            key={space._id}
          >
            <Link
              to={`/spaces/${space._id}`}
              className="text-dark"
              style={{ textDecoration: "none" }}
            >
              <Image
                style={{ height: "230px", borderRadius: "7px" }}
                src={
                  space.images && space.images.length > 0
                    ? space.images[0]
                    : "default-image-url.png"
                }
                alt={space.name}
                width="250"
              />
              <div className="text-center m-2">
                <h6 style={{ fontSize: "20px" }}>{space.name}</h6>
                <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                  Giá mỗi giờ: {priceFormatter(space.pricePerHour)} VND
                </span>
              </div>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Similar;
