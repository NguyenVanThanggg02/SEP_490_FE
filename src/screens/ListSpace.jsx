import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  Carousel,
  Col,
  Container,
  FormSelect,
  Row,
} from "react-bootstrap";
import { Search, Star, StarFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Paginator } from "primereact/paginator";
import "primereact/resources/themes/saga-blue/theme.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "../style/listSpace.css";
import { priceFormatter } from "../utils/numberFormatter";

const ListSpace = () => {
  const [categories, setCategories] = useState([]);
  const [listSpace, setListSpace] = useState([]);
  const [search, setSearch] = useState("");
  const [noResult, setNoResult] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(9);
  const [, setCurrentPage] = useState(1);
  const [, setSpaceFavos] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const productsOnPage = listSpace.slice(first, first + rows);
  const [districts, setDistricts] = useState([]);
  const [districtSearch, setDistrictSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false); 
  const [, setSelectedCate] = useState(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [areaList, setAreaList] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  console.log(selectedAreas);
  
  useEffect(() => {
    fetch("http://localhost:9999/spaces")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListSpace(data);
          const uniqueAreas = [...new Set(data.map(space => space.area))];
          setAreaList(uniqueAreas);
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
  const loadData = async () => {
    try {
      let response;
      if (search) {
        response = await axios.get(
          `http://localhost:9999/spaces/search/${search}`
        );
      }else if (filteredDistricts){
         response = await axios.get("http://localhost:9999/spaces/filter", {
          params: {
            location: districtSearch,
      }})}
      else {
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
  
  // const handleChooseCate = (e, category) => {
  //   const selectedCateId = category._id;
  //   const isChecked = e.target.checked;

  //   if (isChecked) {
  //     getSpaceByCate(selectedCateId);
  //   } else {
  //     loadData();
  //   }
  // };
  const handleAreaSelect = (e) => {
    const area = e.target.value;
    const isChecked = e.target.checked;
  
    if (isChecked) {
      setSelectedAreas((prev) => [...prev, area]);
    } else {
      setSelectedAreas((prev) => prev.filter((a) => a !== area));
    }
  };
  const handleChooseCate = (e) => {
    const selectedCateId = e.target.value;
    if (selectedCateId !== "0") {
      const selectedBrand = categories.find((b) => b._id === selectedCateId);
      setSelectedCate(selectedBrand);
      getSpaceByCate(selectedCateId);
    } else {
      setSelectedCate(null);
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
        const response = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
        // https://provinces.open-api.vn/api/
        setDistricts(response.data.data); 
        console.log(districts);
        
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  const filteredDistricts = districts.filter((district) =>
    district.name.toLowerCase().includes(districtSearch.toLowerCase())
  );
  useEffect(() => {
    if (districtSearch === "") {
      loadData(); 
    }
  }, [districtSearch]); 
  useEffect(() => {
    handleFilter(districtSearch); 
  }, [selectedAreas, districtSearch]);
  
  const handleFilter = async (districtName) => {
  try {
      const response = await axios.get("http://localhost:9999/spaces/filter", {
        params: {
          location: districtName,
          minPrice,
          maxPrice,
          area: selectedAreas,
        },
      });
      if (response.data && response.data.length > 0) {
        setListSpace(response.data);
        setNoResult(false); 
      } else {
        setListSpace([]); 
        setNoResult(true); 
      }

  } catch (error) {
    console.error("Error fetching filtered spaces:", error);
  }
};

const handleDistrictSelect = (districtName) => {
  setDistrictSearch(districtName); 
  setShowSuggestions(false); 
  handleFilter(districtName); 
};

  return (
    <Container>
      <Row>
        <Col md={3}>
          <Row>
            <div class="filter-container">
              {/* <div className="filter-section">
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
              </div> */}
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
                      width: "276px",
                    }}
                  ></input>
                  <Search
                    onClick={handleSearch}
                    style={{
                      height: "50px",
                      position: "absolute",
                      right: "5%",
                      borderLeft: "1px solid #ddd",
                      cursor: "pointer",
                      paddingLeft: "11px",
                      fontSize: "30px",
                    }}
                  />
                </div>
              </Col>
              <FormSelect
                className="items_option"
                style={{
                  height: "50px",
                  width: "99%",
                  padding: "0px 5px 0 10px",
                  border: "solid #CCC 1px",
                  borderRadius: "10px",
                  margin: "20px 0",
                }}
                onChange={handleChooseCate}
              >
                <option value="0">Tất cả địa điểm</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </FormSelect>

              <div className="custom-filter-section">
                <div className="filter-section-title">Tiện nghi: </div>
                <div className="custom-scrollable-filter">
                  {applianceNames.map((name, index) => (
                    <div className="custom-filter-item" key={index}>
                      <label>
                        <input
                          type="checkbox"
                          value={name}
                          style={{marginRight:'7px'}}
                          // onChange={(e) => handleChooseCate(e, name)}
                        />
                        {name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="custom-filter-section">
                <div className="filter-section-title">Diện tích: </div>
                <div className="custom-scrollable-filter">
                  {areaList.map((area, index) => (
                    <div className="custom-filter-item" key={index}>
                      <label>
                        <input
                          type="checkbox"
                          value={area}
                          onChange={handleAreaSelect} 
                          style={{marginRight:'7px'}}
                        />
                        {area}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-section" style={{ border: "none" }}>
                <div
                  className="filter-section-title"
                  style={{ marginRight: "10px" }}
                >
                  Giá:
                </div>
                <div
                  style={{
                    borderBottom: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="text"
                    placeholder="  Từ"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{
                      height: "40px",
                      border: "solid #CCC 1px",
                      borderRadius: "10px",
                      width: "117px",
                      marginRight: "10px",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="  Đến"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{
                      height: "40px",
                      border: "solid #CCC 1px",
                      borderRadius: "10px",
                      width: "117px",
                    }}
                  />
                  <Search
                    onClick={handleFilter}
                    style={{
                      height: "50px",
                      cursor: "pointer",
                      paddingLeft: "11px",
                      fontSize: "30px",
                    }}
                  />
                </div>
              </div>

              <div className="filter-section" style={{ borderBottom: "none" }}>
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
                    {showSuggestions && districtSearch && (
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
                            onMouseDown={() =>
                              handleDistrictSelect(district.name)
                            }
                          >
                            {district.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* <Button
                onClick={handleAll}
                className="btn btn-success"
                style={{ marginLeft: "30%" }}
              >
                Xem tất cả
              </Button> */}
            </div>
          </Row>
        </Col>

        <Col md={9}>
          <Row>
            {noResult ? (
              <Col md={12}>
                <h4 style={{ margin: "20px", textAlign: "center" }}>
                  Không có địa điểm nào !!!
                </h4>
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
                      height: "433px",
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
                      style={{ textDecoration: "none", marginTop: "10px" }}
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
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Card.Text
                            style={{
                              marginLeft: "5px",
                              fontSize: "15px",
                              color: "#2d2d2d",
                              fontWeight: "bold",
                            }}
                          >
                            Giá: {priceFormatter(l.pricePerHour)} / VND
                          </Card.Text>
                          <Card.Text
                            style={{ color: "#2d2d2d", display: "flex" }}
                          >
                            <StarFill
                              style={{
                                color: "#FFCC00",
                                margin: "3px 15px 15px 0",
                              }}
                            />
                            <span style={{ margin: "0 10px 17px -7px" }}>
                              4.5
                            </span>
                          </Card.Text>
                        </div>
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
