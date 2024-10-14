import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Carousel,
  Col,
  Container,
  FormSelect,
  Row,
} from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/saga-blue/theme.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "../style/listSpace.css";

const ListSpace = () => {
  const [categories, setCategories] = useState([]);
  const [listSpace, setListSpace] = useState([]);
  const [search, setSearch] = useState("");
  const [noResult, setNoResult] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);
  const [spaceFavo, setSpaceFavos] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const productsOnPage = listSpace.slice(first, first + rows);
  const [showAll, setShowAll] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [districtSearch, setDistrictSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false); 

  useEffect(() => {
    fetch("http://localhost:9999/spaces")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListSpace(data);
        } else {
          setListSpace([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setListSpace([]);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9999/categories")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching brands:", error));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:9999/appliances")
      .then((response) => setAppliances(response.data))
      .catch((error) => console.error("Error fetching appliances:", error));
  }, []);

  const applianceNames = appliances
    .map((item) => item.appliances.map((appliance) => appliance.name))
    .flat();
  const displayedAppliances = showAll
    ? applianceNames
    : applianceNames.slice(0, 5);
  console.log(applianceNames);

  const loadData = async () => {
    try {
      let response;
      if (search) {
        response = await axios.get(
          `http://localhost:9999/spaces/search/${search}`
        );
      } else {
        response = await axios.get("http://localhost:9999/spaces");
      }
      const spaces = response.data;
      console.log(spaces);

      if (spaces.length === 0) {
        setNoResult(true);
      } else {
        setNoResult(false);
        setListSpace(spaces);
      }
    } catch (error) {
      alert("Lỗi khi load dữ liệu");
    }
  };
  const handleSearch = () => {
    loadData();
  };

  useEffect(() => {
    if (search === "") {
      loadData();
    }
  }, [search]);
  const handleChooseCate = (e, category) => {
    const selectedCateId = category._id;
    const isChecked = e.target.checked;

    if (isChecked) {
      getSpaceByCate(selectedCateId);
    } else {
      loadData();
    }
  };

  const changeFavorite = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:9999/spaces/${id}/favorite`
      );
      setSpaceFavos((prevSpace) => ({
        ...prevSpace,
        favorite: response.data.favorite,
      }));
      loadData();
    } catch (error) {
      console.error("Error change favorite:", error);
    }
  };
  const getSpaceByCate = async (selectedCateId) => {
    try {
      let response;
      if (selectedCateId) {
        response = await axios.get(
          `http://localhost:9999/spaces/cate/${selectedCateId}`
        );
      } else {
        response = await axios.get("http://localhost:9999/spaces");
      }
      setListSpace(response.data);
      if (response.data.length === 0) {
        setNoResult(true);
    } else {
        setNoResult(false);
    }
    } catch (error) {
      alert("Lỗi khi gọi API lấy danh sách sản phẩm theo cate ", error);
    }
  };
  const onPageChange = (event) => {
    setFirst(event.first);
    setCurrentPage(event.page + 1);
    setRows(event.rows);
  };

  // lấy thành phố
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get("https://provinces.open-api.vn/api/");
        setDistricts(response.data); 
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(districtSearch.toLowerCase())
  );
  return (
    <Container>
      <Row>
        <Col md={3}>
          <Row>
            <Col md={7} style={{ display: "flex" }}>
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="  Tìm kiếm...."
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    height: "50px",
                    border: "solid #CCC 1px",
                    borderRadius: "10px",
                    width: "301px",
                  }}
                ></input>
                  <Search onClick={handleSearch}
                  style={{
                    height: "50px",
                    position: "absolute",
                    right: "5%",
                    borderLeft: "1px solid #ddd",
                    cursor:'pointer',
                    paddingLeft: "11px",
                    fontSize:'30px',
                  }} />
              </div>
            </Col>
          </Row>

          <Row>
            <div class="filter-container">
              <div className="filter-section">
                <div className="filter-section-title">
                  Chọn theo thể loại không gian:
                </div>
                {categories.map((category) => (
                  <div className="filter-item" key={category._id}>
                    <label>
                      <input
                        type="checkbox"
                        value={category._id}
                        onChange={(e) => handleChooseCate(e, category)}
                      />
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>

              <div className="filter-section">
                <div className="filter-section-title">Tiện nghi: </div>
                {displayedAppliances.map((name, index) => (
                  <div className="filter-item" key={index}>
                    <label>
                      <input
                        type="checkbox"
                        value={name}
                        onChange={(e) => handleChooseCate(e, name)}
                      />
                      {name}
                    </label>
                  </div>
                ))}

                <div className="show-more" onClick={() => setShowAll(!showAll)}>
                  {showAll
                    ? "Thu gọn"
                    : `Hiển thị tất cả ${applianceNames.length} loại`}
                </div>
              </div>

              <div class="filter-section" style={{borderBottom:'none'}}>
                <div class="filter-section-title">Giá: </div>
                <input
                  type="text"
                  placeholder=" Nhập giá"
                  style={{
                    height: "50px",
                    border: "solid #CCC 1px",
                    borderRadius: "10px",
                    width: "280px",
                  }}
                ></input>
              </div>

              <div className="filter-section" style={{borderBottom:'none'}}>
                <div className="filter-section-title">Thành phố: </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      placeholder=" Nhập quận...."
                      value={districtSearch}
                      onChange={(e) => setDistrictSearch(e.target.value)}
                      onFocus={() => setShowSuggestions(true)} 
                      onBlur={() => setShowSuggestions(false)} 
                      style={{
                        height: "50px",
                        border: "solid #CCC 1px",
                        borderRadius: "10px",
                        width: "285px",
                      }}
                    />
                    {showSuggestions &&
                      districtSearch && ( 
                        <div
                          style={{
                            position: "absolute",
                            zIndex: 1000,
                            backgroundColor: "white",
                            border: "1px solid #CCC",
                            width: "285px",
                            maxHeight: "200px",
                            overflowY: "scroll",
                          }}
                        >
                          {filteredDistricts.map((district) => (
                            <div
                              key={district.code}
                              style={{
                                padding: "5px",
                                cursor: "pointer",
                              }}
                              onMouseDown={() => {
                                setDistrictSearch(district.name);
                                setShowSuggestions(false); // Ẩn gợi ý sau khi chọn
                              }}
                            >
                              {district.name}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Col>

        <Col md={9}>
          <Row>
            {noResult ? (
              <Col md={4}>
                <h6 style={{ margin: "20px" }}>Không có sản phẩm nào !!!</h6>
              </Col>
            ) : (
              productsOnPage.map((l) => (
                <Col key={l._id} md={4} sm={6} xs={12} className="mb-4">
                  <div
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: "15px",
                      overflow: "hidden",
                      boxShadow: "0 0 30px rgba(0, 0, 0, 0.04)", // Soft shadow for a cozy effect
                      position: "relative",
                      height: "400px",
                      backgroundColor: "#f5f5f5", // Soft background to resemble the cozy theme
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        zIndex: 1,
                        cursor: "pointer",
                      }}
                      onClick={() => changeFavorite(l._id)}
                    >
                      {l.favorite ? (
                        <FavoriteIcon style={{ color: "#FF385C" }} />
                      ) : (
                        <FavoriteBorderIcon style={{ color: "white" }} />
                      )}
                    </div>
                    <Carousel
                      interval={null}
                      controls={false}
                      indicators={true}
                      prevIcon={
                        <span
                          aria-hidden="true"
                          className="carousel-control-prev-icon"
                        />
                      }
                      nextIcon={
                        <span
                          aria-hidden="true"
                          className="carousel-control-next-icon"
                        />
                      }
                    >
                      {l.images && l.images.length > 0 ? (
                        l.images.map((img, index) => (
                          <Carousel.Item key={index}>
                            <img
                              className="d-block w-100"
                              src={img}
                              alt={`Ảnh slide ${index + 1}`}
                              height="270"
                              style={{
                                objectFit: "cover",
                                borderTopLeftRadius: "15px",
                                borderTopRightRadius: "15px",
                                borderBottomLeftRadius: "15px",
                                borderBottomRightRadius: "15px",
                              }}
                            />
                          </Carousel.Item>
                        ))
                      ) : (
                        <Carousel.Item>
                          <img
                            className="d-block w-100"
                            src="default-image-url.png"
                            alt="Ảnh mặc định"
                            height="220"
                          />
                        </Carousel.Item>
                      )}
                    </Carousel>
                    <Link
                      to={`/spaces/${l._id}`}
                      style={{ textDecoration: "none", marginTop: "20px" }}
                    >
                      <Card.Body>
                        <Card.Title
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            color: "#2d2d2d",
                          }}
                        >
                          {l.name}
                        </Card.Title>
                        <Card.Text
                          style={{ fontSize: "14px", color: "#757575" }}
                        >
                          Địa điểm: {l.location}
                        </Card.Text>
                        <Card.Text
                          style={{
                            fontSize: "15px",
                            color: "#2d2d2d",
                            fontWeight: "bold",
                          }}
                        >
                          <p> Trạng thái: {l.status}</p>
                        </Card.Text>
                      </Card.Body>
                    </Link>
                  </div>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Paginator
          style={{ backgroundColor: "#f9f9f9" }}
          first={first}
          rows={rows}
          totalRecords={listSpace.length}
          onPageChange={onPageChange}
        />
      </Row>
    </Container>
  );
};

export default ListSpace;
