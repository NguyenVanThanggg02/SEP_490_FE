import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HotSpace from "../components/HotSpace";
import HowWork from "../components/HowWork";
import UserFeed from "../components/UserFeed";
import "../style/landing.css";
import NearSpace from "../components/NearSpace";
import ProposedSpaces from './ProposedSpaces';

const Landing = ({isLoggedIn, setIsLoggedIn}) => {
  return (
    <div>
      <Hero isLoggedIn={isLoggedIn}></Hero>
      <Features></Features>
      <ProposedSpaces />
      <NearSpace />
      <HotSpace></HotSpace>
      <HowWork></HowWork>
    </div>
  );
};

export default Landing;
