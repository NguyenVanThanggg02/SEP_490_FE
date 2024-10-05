import { Box } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Row,
  Table,
  Button,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import { Image } from "antd";

const DetailForAdmin = ({ id, onBack }) => {
  const [space, setSpace] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const now = 60;

  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/spaces/${id}`);
        setSpace(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceData();
  }, [id]);

  const handleShowAllImages = () => {
    setShowAllImages(true);
  };

  const handleCloseModal = () => {
    setShowAllImages(false);
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <Button className="btn btn-success m-3" onClick={onBack}>
        Quay lại
      </Button>
      <Box style={{ display: "flex", justifyContent: "center" }}>
        <Row style={{ width: "100%" }}>
          <Col md={12}>
            <Table bordered hover className="horizontal-table">
              <tbody>
                <tr>
                  <th>Ảnh</th>
                  <td style={{ display: "flex", justifyContent: "start" }}>
                    <Image.PreviewGroup>
                      {space.images &&
                        space.images
                          .slice(0, 3)
                          .map((imgUrl, index) => (
                            <Image
                              key={index}
                              src={imgUrl}
                              alt={`Space image ${index + 1}`}
                              fluid
                              style={{ maxWidth: "200px", padding: "10px" }}
                            />
                          ))}
                    </Image.PreviewGroup>
                    {space.images && space.images.length > 3 && (
                      <Button
                        className="btn btn-success"
                        onClick={handleShowAllImages}
                        style={{ height: "40px", marginTop: "45px" }}
                      >
                        Xem tất cả
                      </Button>
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Tên</th>
                  <td>{space.name}</td>
                </tr>
                <tr>
                  <th>Mô tả</th>
                  <td>{space.description}</td>
                </tr>
                <tr>
                  <th>Diện tích</th>
                  <td>{space.area}</td>
                </tr>
                <tr>
                  <th>Giá phòng</th>
                  <td>{space.pricePerHour}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <ProgressBar
            style={{ padding: "0" }}
            variant="info"
            now={now}
            label={`${now}%`}
          />
        </Row>
      </Box>
      <Modal show={showAllImages} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tất cả ảnh</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ display: "flex", flexWrap: "wrap" }}>
          <Image.PreviewGroup>
            {space.images &&
              space.images.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Space image ${index + 1}`}
                  fluid
                  style={{ maxWidth: "768px", padding: "10px" }}
                />
              ))}
          </Image.PreviewGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default DetailForAdmin;
