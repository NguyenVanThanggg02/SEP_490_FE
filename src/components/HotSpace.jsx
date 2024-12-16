import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { priceFormatter } from "../utils/numberFormatter";
import { Constants } from "../utils/constants";

const HotSpace = () => {
  const [topSpaces, setTopSpaces] = useState([]);

  useEffect(() => {
    fetch(`${Constants.apiHost}/bookings/top-spaces`)
      .then((resp) => resp.json())
      .then((data) => {
        setTopSpaces(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  
  return (
    <div className="highlighted-spaces">
      <h2>Không Gian Nổi Bật</h2>
      {topSpaces.length === 0 ? (
        <p>Không có địa điểm nổi bật nào.</p>
      ) : (
        Array.isArray(topSpaces) &&
        topSpaces.map((s) => (
          <div className="space-item">
            <Link to={`/spaces/${s?._id}`} style={{ textDecoration: "none" }}>
              <img
                className="d-block w-100"
                src={s.images?.[0]?.url}
                alt="Ảnh"
                height="370"
                style={{
                  borderTopLeftRadius: "15px",
                  borderTopRightRadius: "15px",
                  borderBottomLeftRadius: "15px",
                  borderBottomRightRadius: "15px",
                }}
              />

              <h2
                style={{
                  color: "#ADD8E6",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {s.name}
              </h2>
              <h3
                style={{
                  color: "#ADD8E6",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Địa điểm: {s.location}
              </h3>
              <h4
                style={{
                  marginLeft: "5px",
                  color: "#ADD8E6",
                }}
              >
                Giá: {priceFormatter(s.pricePerHour)} / VND
              </h4>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default HotSpace;
