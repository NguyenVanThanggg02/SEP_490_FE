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
const ListSpace = () => {
  const [categories, setCategories] = useState([]);
  const [listSpace, setListSpace] = useState([]);
  const [search, setSearch] = useState("");
  const [noResult, setNoResult] = useState(false);
  const [selectedCate, setSelectedCate] = useState(null);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const productsOnPage = listSpace.slice(first, first + rows); 


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
      setNoResult(true);

    } catch (error) {
      alert("Lỗi khi gọi API lấy danh sách sản phẩm theo cate ", error);
    }
  };
  const onPageChange = (event) => {
    setFirst(event.first);
    setCurrentPage(event.page + 1);
    setRows(event.rows);
  };
  return (
    <Container>
      <Row style={{ display: "flex" }}>
        <Col md={6}>
          <input
            type="text"
            placeholder="  Tìm kiếm...."
            onChange={(e) => setSearch(e.target.value)}
            style={{
              height: "50px",
              width: "400px",
              paddingLeft: "10px",
              border: "solid #CCC 1px",
              margin: "20px",
              borderRadius: "10px",
            }}
          ></input>
          <Button
            type="submit"
            onClick={handleSearch}
            style={{
              marginLeft: "20px",
              height: "50px",
              paddingLeft: "10px",
              border: "solid #3399FF 1px",
              margin: "20px",
              boxShadow: "4px 5px 10px 3px #3399FF",
              borderRadius: "10px",
            }}
          >
            <Search /> Tìm kiếm
          </Button>
        </Col>
        <Col md={6}>
          <FormSelect
            className="items_option"
            style={{
              height: "50px",
              width: "35%",
              padding: "0px 5px 0 10px",
              border: "solid #CCC 1px",
              margin: "20px",
              borderRadius: "10px",
            }}
            onChange={handleChooseCate}
          >
            <option value="0">Tất cả</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </FormSelect>
        </Col>
      </Row>
      <Row style={{paddingTop:'20px'}}>
        {noResult ? (
          <Col style={{ textAlign: "center" }}>
            <h6 style={{ margin: "20px" }}>Không có sản phẩm nào !!!</h6>
          </Col>
        ) : (
          productsOnPage.map((l) => (
            <Col key={l._id} md={3} sm={6} xs={12} className="mb-4">
              <Card
                style={{
                  width: "18rem",
                  border: "none",
                  borderRadius: "15px",
                  position: "relative",
                  height: "370px",
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
                ></div>
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
                          height="180"
                          style={{
                            borderTopLeftRadius: "15px",
                            borderTopRightRadius: "15px",
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
                        height="180"
                      />
                    </Carousel.Item>
                  )}
                </Carousel>
                <Card.Body style={{ padding: "10px" }}>
                  <Card.Title style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {l.name}
                  </Card.Title>

                  <Card.Text style={{ fontSize: "14px", color: "#757575" }}>
                    Địa điểm: {l.location}
                  </Card.Text>
                  <Card.Text style={{ fontSize: "14px", color: "#757575" }}>
                    Giá mỗi giờ: {l.pricePerHour} VND
                  </Card.Text>
                  <Card.Text style={{ fontSize: "14px", color: "#757575" }}>
                    Trạng thái: {l.status}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
      <Row
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Paginator
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
