import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SpaceCard from "../model/SpaceCard";
import { Col, Container, Row } from "react-bootstrap";

const Home = () => {
  const [spaces, setSpaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:9999/spaces")
      .then((response) => {
        setSpaces(response.data);
      })
      .catch((error) => {
        console.error("Error fetching spaces:", error);
      });
  }, []);

  const handleCardClick = (id) => {
    navigate(`/spaces/${id}`);
  };

  return (
    <Container>
      <Row>
        <Col></Col>
      </Row>
      <Row>
        <div className="space-list row">
          {spaces.length > 0 ? (
            spaces.map((space) => (
              <div
                className="col-lg-3 col-md-6 col-sm-12 mb-2"
                key={space._id}
                onClick={() => handleCardClick(space._id)}

              >
                <SpaceCard space={space} />
              </div>
            ))
          ) : (
            <p>No spaces available</p>
          )}
        </div>
      </Row>
    </Container>
  );
};

export default Home;
