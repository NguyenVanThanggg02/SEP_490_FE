import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  CardMedia,
} from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import Comment from "./Comment";
import { Link, useParams } from "react-router-dom";

function BookingDetails() {
  const { id } = useParams();
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <Grid container spacing={3} style={{ padding: "20px" }}>
      {spaceData && (
        <>
          <Grid item xs={12}>
            <Typography variant="h6">{spaceData.name}</Typography>
            <Grid container spacing={2}>
              {images.length > 0 ? (
                images.map((imageUrl, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={`Space Image ${index + 1}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Grid>
                ))
              ) : (
                <Typography variant="body2">No images available</Typography>
              )}
            </Grid>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card style={{ padding: "20px" }}>
              <CardContent>
                <Typography variant="h6">
                  Chỗ ở là bầu không khí và vị trí
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {spaceData.description}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card style={{ padding: "20px" }}>
              <CardContent>
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
              </CardContent>
            </Card>
          </Grid>
          {/* Display Images */}

          <Grid item xs={12}>
            <Card>
              <CardContent>
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Comment />
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default BookingDetails;
