import React, { useEffect, useRef, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { priceFormatter } from '../utils/numberFormatter';

export default function ProposedSpaces() {
  const isFirstMount = useRef(true);
  const [proposedSpaces, setProposedSpaces] = useState([]);
  useEffect(() => {
    if (isFirstMount.current || process.env.NODE_ENV === 'production') {
      const userId = localStorage.getItem('userId');

      fetch(`http://localhost:9999/spaces/proposed/${userId}`)
        .then((resp) => resp.json())
        .then((res) => {
          console.log(res);
          setProposedSpaces(res.data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }

    return () => {
      isFirstMount.current = false;
    };
  }, []);

  return (
    <>
      {proposedSpaces?.length ? (
        <div className="highlighted-spaces">
          <h2>Đề xuất</h2>
          <Carousel>
            {Array.isArray(proposedSpaces) &&
              proposedSpaces.map((s) => (
                <Carousel.Item className="slider">
                  <div
                    // className="space-item"
                    style={{
                      marginBottom: '43px',
                    }}
                    key={s._id}
                  >
                    <Link
                      to={`/spaces/${s?._id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div className="space-item ">
                        <img
                          className="d-block w-100"
                          src={s.images?.[0]?.url}
                          alt="Ảnh"
                          height="370"
                          style={{
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                            borderBottomLeftRadius: '15px',
                            borderBottomRightRadius: '15px',
                          }}
                        />
                        <h2 style={{ color: '#ADD8E6' }}>{s.name}</h2>
                        <h3 style={{ color: '#ADD8E6' }}>
                          Địa điểm: {s.location}
                        </h3>
                        <h4
                          style={{
                            marginLeft: '5px',
                            color: '#ADD8E6',
                          }}
                        >
                          Giá: {priceFormatter(s.pricePerHour)} / VND
                        </h4>
                      </div>
                    </Link>
                  </div>
                </Carousel.Item>
              ))}
          </Carousel>
        </div>
      ) : null}
    </>
  );
}
