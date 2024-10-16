import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HotSpace from "../components/HotSpace";
import HowWork from "../components/HowWork";
import UserFeed from "../components/UserFeed";
import "../style/landing.css";
const Landing = ({isLoggedIn, setIsLoggedIn}) => {
  return (
    <div>
      <Hero isLoggedIn={isLoggedIn}></Hero>
      <Features></Features>
      <HotSpace></HotSpace>
      <HowWork></HowWork>
      <UserFeed></UserFeed>
    </div>
  );
};

export default Landing;
