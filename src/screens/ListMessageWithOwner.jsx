import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const ListMessageWithOwner = () => {
  const location = useLocation();
  const [space, setSpace] = useState({});
  const { id } = location.state;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpaceById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:9999/spaces/${id}`);
      setSpace(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSpaceById(id);
  }, [id]);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <Container fluid>
      <Col md={12} style={{ border: "solid 2px #ECECEC", height: "88vh" }}>
        <h4 className="pt-4">Tin nhắn</h4>
        <Row>
          <Row
            style={{
              margin: "0 auto",
              width: "90%",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
            }}
          >
            <Col md={3} style={{ padding: "10px 5px" }}>
              <div
                style={{
                  position: "relative",
                  width: "60px",
                  height: "60px",
                }}
              >
                {/* space image */}
                <img
                  src={space.images[0]}
                  alt="background"
                  style={{
                    objectFit: "cover",
                    width: "60px",
                    height: "60px",
                    borderRadius: "12px",
                  }}
                />
                {/* user Avatar  */}
                <img
                  src={space.images[1]}
                  alt="avatar"
                  style={{
                    position: "absolute",
                    bottom: "-10px",
                    left: "70%",
                    transform: "translateX(-50%)",
                    objectFit: "cover",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    border: "2px solid white",
                  }}
                />
              </div>
            </Col>
            <Col md={9}>
              <h6>{space.name}</h6>
              <p>thời gian</p>
            </Col>
          </Row>
        </Row>
      </Col>
    </Container>
  );
};

export default ListMessageWithOwner;
