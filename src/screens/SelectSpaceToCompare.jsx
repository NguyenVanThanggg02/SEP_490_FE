import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const SelectSpaceToCompare = (props) => {
  const { visibleCompare, setVisibleCompare, position } = props;
  const [spaces, setSpaces] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9999/spaces")
      .then((response) => {
        const filterItems = filterSapces(response.data);
        setSpaces(filterItems);
      })
      .catch((error) => {
        console.error("Error fetching spaces:", error);
      });
  }, []);
  const filterSapces = (spaces) => {
    return spaces.filter((spaces) => spaces.censorship === "Chấp nhận");
  };
  const onHide = () => {
    setVisibleCompare(false);
  };

  const dialogFooter = (
    <div style={{ margin: "20px" }}>
      <div style={{ display: "flex", justifyContent: "end" }}>
        <Button className="btn btn-dark">
          <Link style={{color:'white', textDecoration:'none'}} to={"/compare"}>Tiếp theo</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <Dialog
        visible={visibleCompare}
        onHide={onHide}
        footer={dialogFooter}
        className="bg-light dialogForm"
        style={{ width: "40vw" }}
        position={position}
        modal
      >
        <Row style={{ margin: "20px" }}>
          <Col md={6}>
            <Card style={{ position: "relative" }}>
              <CardMedia
                sx={{ height: 250 }}
                image="https://thietkenoithat.com/Portals/0/xNews/uploads/2022/10/11/thiet-ke-van-phong-hien-dai(1)_1.jpg"
                title="image spaceF"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  abc
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  abf
                </Typography>
              </CardContent>
            </Card>
          </Col>
          <Col md={6}>
            <Card style={{ position: "relative" }}>
              <CardMedia
                sx={{ height: 250 }}
                image="https://thietkenoithat.com/Portals/0/xNews/uploads/2022/10/11/thiet-ke-van-phong-hien-dai(1)_1.jpg"
                title="image spaceF"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  abc
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  abf
                </Typography>
              </CardContent>
            </Card>
          </Col>
        </Row>
      </Dialog>
    </div>
  );
};

export default SelectSpaceToCompare;
