import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { priceFormatter } from "../utils/numberFormatter";
import useGeolocation from "../hooks/useGeolocation";
import axios from "axios";

const NearSpace = () => {
  const [nearSpaces, setNearSpaces] = useState([]);
  const { location } = useGeolocation();

  useEffect(() => {
    if (!location || !location.latitude || !location.longitude) return;
    axios.get(`http://localhost:9999/bookings/near-spaces`, {
      params: {
        lat: location.latitude,
        lng: location.longitude
      },
    }).then(res => {
      const sortedSpaces = res.data.sort((a, b) => {
        // Lấy giá trị số từ chuỗi khoảng cách (chuyển đổi từ "km" hoặc "m" thành số)
        const distanceA = parseFloat(a.distance);
        const distanceB = parseFloat(b.distance);
        return distanceA - distanceB;
      });
      setNearSpaces(sortedSpaces);
    }).catch(err => {
      setNearSpaces([]);
    });
  }, [location]);

  useEffect(() => {
    console.log(nearSpaces)
  }, [nearSpaces])

  return (
    <>
      {location && location.latitude && location.longitude && nearSpaces && (
        <div className="highlighted-spaces">
          <h2>Không Gian gần bạn</h2>
          {nearSpaces.length === 0 ? (
            <p>Không có địa điểm gần bạn nào.</p>
          ) : (
            Array.isArray(nearSpaces) &&
            nearSpaces.map((s) => (
              <div className="space-item" key={s._id}>
                <Link
                  to={`/spaces/${s?._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <img
                    className="d-block w-100"
                    src={s.images[0].url}
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      flexDirection: "row",
                    }}
                  >
                    <h4
                      style={{
                        marginLeft: "5px",
                        color: "#ADD8E6",
                      }}
                    >
                      Giá: {priceFormatter(s.pricePerHour)} / VND
                    </h4>
                    {s.distance && (
                      <h4
                        style={{
                          marginRight: "5px",
                          color: "#ADD8E6",
                        }}
                      >
                        {s.distance}
                      </h4>
                    )}
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default NearSpace;
