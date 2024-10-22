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
  const { visibleCompare, setVisibleCompare, id, onValueChange  } = props;
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  console.log(selectedSpace);

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
    return spaces.filter(
      (spaces) => spaces.censorship === "Chấp nhận" && spaces._id !== id
    );
  };
  const onHide = () => {
    setVisibleCompare(false);
  };

  const handleSpaceSelect = (space) => {
    setSelectedSpace(space); 
    onValueChange(space); 
    onHide()
  };

  return (
    <div>
      <Dialog
        visible={visibleCompare}
        onHide={onHide}
        className="bg-light dialogForm"
        style={{ width: "60vw" }}
        modal
      >
        <Row style={{ margin: "20px" }}>
          {spaces.map((s) => (
            <Col md={4}>
              <Card
                style={{ position: "relative" }}
                onClick={() => handleSpaceSelect(s._id)}
              >
                <CardMedia
                  sx={{ height: 250 }}
                  image={s.images[0].url}
                  title="image spaceF"
                />
                <CardContent>
                  <Typography variant="p" sx={{ color: "text.secondary" }}>
                    {s.name}
                  </Typography>
                </CardContent>
              </Card>
            </Col>
          ))}
        </Row>
      </Dialog>
    </div>
  );
};

export default SelectSpaceToCompare;
