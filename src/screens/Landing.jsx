import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HotSpace from "../components/HotSpace";
import HowWork from "../components/HowWork";
import UserFeed from "../components/UserFeed";
import "../style/landing.css";
const Landing = () => {
  return (
    <div>
      <Header></Header>
      <Hero></Hero>
      <Features></Features>
      <HotSpace></HotSpace>
      <HowWork></HowWork>
      <UserFeed></UserFeed>
    </div>
  );
};

export default Landing;
