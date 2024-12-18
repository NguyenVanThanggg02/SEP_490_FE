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
import { Constants } from "../utils/constants";

const SelectSpaceToCompare = (props) => {
  const { visibleCompare, setVisibleCompare, id, onValueChange,setCategoryId  } = props;
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  console.log(selectedSpace);

  useEffect(() => {
    axios
      .get(`${Constants.apiHost}/spaces/cate/${setCategoryId}`)
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
                style={{ position: "relative", marginBottom: "10px" }}
                onClick={() => handleSpaceSelect(s._id)}
              >
                <CardMedia
                  sx={{ height: 250 }}
                  image={s.images[0].url}
                  title="image spaceF"
                />
                <CardContent>
                  <Typography variant="p" sx={{ color: "text.secondary" }}>
                    {s.name.length > 28
                      ? `${s.name.slice(0, 25)}  ...`
                      : s.name}
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
