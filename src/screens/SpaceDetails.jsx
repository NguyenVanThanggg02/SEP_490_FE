import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Comment from "./Comment";
import { Link, useParams } from "react-router-dom";
import { ImageList, ImageListItem, Dialog, DialogContent } from '@mui/material';
import { Row } from "react-bootstrap";


function SpaceDetails() {
  const { id } = useParams();
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClickOpen = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };


  useEffect(() => {
    const fetchSpaceData = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/spaces/${id}`);
        setSpaceData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaceData();
  }, [id]);

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        Error loading data.
      </Typography>
    );

  // Ensure spaceData and its properties are properly initialized
  const appliances = spaceData?.appliancesId || [];
  const images = spaceData?.images || [];

  return (
    <Container fluid spacing={3} style={{ padding: "20px" }}>
      {spaceData && (
        <>
          <Container item xs={12}>
            <Typography variant="h4" className="pb-5">{spaceData.name}</Typography>
            <Row container spacing={2}  >
              {images.length > 0 ? (
                <div>
                  <ImageList cols={3} >
                    {images.map((item) => (
                      <ImageListItem key={item} onClick={() => handleClickOpen(item)}>
                        <img
                          src={`${item}?w=164&h=164&fit=crop&auto=format`}
                          alt={item.title}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>

                  <Dialog open={open} onClose={handleClose} maxWidth="md">
                    <DialogContent>
                      {selectedImage && (
                        <img
                          src={selectedImage}
                          alt="Chi tiết ảnh"
                          style={{ width: '100%', height: 'auto' }}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <Typography variant="body2">No images available</Typography>
              )}
            </Row>
          </Container>

          <Container fluid item xs={12} md={7}>
            <Typography variant="h6">
              Chỗ ở là bầu không khí và vị trí
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {spaceData.description}
            </Typography>
            <Divider />
            <Typography variant="h6">Tiện nghi</Typography>
            <List>
              {appliances.length > 0 ? (
                appliances.map((appliance) => (
                  <ListItem key={appliance._id}>
                    <ListItemIcon>
                      {/* Replace with actual icon based on appliance data */}
                      <AcUnitIcon /> {/* Example icon */}
                    </ListItemIcon>
                    <ListItemText primary={appliance.name} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body2">
                  No appliances available
                </Typography>
              )}
            </List>
          </Container>
          <Container fluid item xs={12} md={5}>
            <Typography
              variant="h5"
              style={{ textDecoration: "line-through", color: "gray" }}
            >
              ₫{spaceData.pricePerHour.toLocaleString()}
            </Typography>
            <Typography
              variant="h4"
              style={{ color: "#ff5a5f", fontWeight: "bold" }}
            >
              ₫{(spaceData.pricePerHour * 0.8).toLocaleString()}{" "}
              {/* Example discount */}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {spaceData.location}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Diện tích: {spaceData.area}
            </Typography>
            <Button variant="contained" color="primary" fullWidth>
              Đặt phòng
            </Button>
            <Typography
              variant="body2"
              style={{ color: "#ff5a5f", marginTop: "10px" }}
            >
              Ưu đãi đặc biệt: tiết kiệm ₫
              {(spaceData.pricePerHour * 0.2).toLocaleString()}
            </Typography>
          </Container>
          {/* Display Images */}

          <Container item xs={12}>
            <Typography variant="h6">
              Chủ nhà: {spaceData.host?.name || "Unknown"}
            </Typography>
            <Link to="/mess" state={{ id }}>
              <Button sx={{ backgroundColor: "black", color: "white" }}>
                Nhắn tin cho chủ nhà
              </Button>
            </Link>
            <Typography variant="body2" color="textSecondary">
              {spaceData.host?.experience} tháng kinh nghiệm đón tiếp khách
            </Typography>
          </Container>
          <Row item md={12}>
            <Comment />
          </Row>
        </>
      )}
    </Container>
  );
}

export default SpaceDetails;
