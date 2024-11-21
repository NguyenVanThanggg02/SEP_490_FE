import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { priceFormatter } from "../utils/numberFormatter";

const Similar = ({ spaceData }) => {
  const [similarSpace, setSimilarSpace] = useState([]);

  useEffect(() => {
    if (spaceData.categoriesId) {
      axios
        .get(`http://localhost:9999/spaces/cate/${spaceData.categoriesId._id}`)
        .then((response) => {
          const filteredSimilarSpace = response.data
            .filter((p) => p._id !== spaceData._id)
            .slice(0, 4);
          setSimilarSpace(filteredSimilarSpace);
        })
        .catch((error) => {
          console.error("Error fetching similar products:", error);
        });
    }
  }, [spaceData]);

  return (
    <Container
      className="similarproduct mb-4"
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
      <Row style={{ display: "flex", justifyContent: "center" }}>
        <h3
          style={{ margin: "20px", display: "flex", justifyContent: "center" }}
        >
          Địa Điểm Tương Tự
        </h3>
      </Row>
      <Row>
        {similarSpace.slice(-5).map((s) => (
          <Col
            md={3}
            xs={12}
            style={{ textAlign: "center", paddingBottom: "40px" }}
            key={s._id}
          >
            <div>
              <Link
                to={`/spaces/${s._id}`}
                className="text-dark"
                style={{ textDecoration: "none" }}
              >
                <Image
                  style={{ height: "230px", borderRadius: "7px" }}
                  src={
                    s.images && s.images.length > 0
                      ? s.images[0].url
                      : "default-image-url.png"
                  }
                  alt={s.name}
                  width="250"
                  preview
                />
                <div className="text-center mt-4" >
                  <div>
                    <h6 style={{ fontSize: "20px" }}>
                      {s.name.length > 28
                        ? `${s.name.slice(0, 20)}  ...`
                        : s.name}
                    </h6>
                  </div>
                  <div>
                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                      {" "}
                      Giá mỗi giờ: {priceFormatter(s.pricePerHour)} VND{" "}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Similar;
