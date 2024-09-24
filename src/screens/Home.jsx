import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SpaceCard from "../model/SpaceCard";

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
    <div className="space-list">
      {spaces.length > 0 ? (
        spaces.map((space) => (
          <div key={space._id} onClick={() => handleCardClick(space._id)}>
            <SpaceCard space={space} />
          </div>
        ))
      ) : (
        <p>No spaces available</p>
      )}
    </div>
  );
};

export default Home;
