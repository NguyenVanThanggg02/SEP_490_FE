import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import "../style/sliderBanner.css";
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.png";
import banner3 from "../assets/images/banner3.png";

const SliderBanner = () => {
  return (
    <Carousel>
      <Carousel.Item className="slider">
        <img className="d-block w-100" src={banner1} alt="First slide" />
      </Carousel.Item>
      <Carousel.Item className="slider">
        <img className="d-block w-100" src={banner2} alt="Second slide" />
      </Carousel.Item>
      <Carousel.Item className="slider"> 
        <img className="d-block w-100" src={banner3} alt="Third slide" />
      </Carousel.Item>
    </Carousel>
  );
};

export default SliderBanner;
