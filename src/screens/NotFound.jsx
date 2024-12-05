import React from "react";
import "../style/notfound.css";
import notfound from "../assets/images/notfound.png";

const NotFound = () => {
  return (
    <div className="notfound">
      <div className="error-code" style={{color: "#4aa3df"}}>404 ERROR</div>
      <div className="error-message" style={{color: "#4aa3df"}}>Sorry, the page not found</div>
      <div className="error-image">
        <img
          alt="A cartoonish document with X eyes and a tongue sticking out, representing a 404 error"
          src={notfound}
          width="150"
          height="150"
        />
      </div>
      <a className="home-button" href="/">
        Return to the homepage
      </a>
    </div>
  );
};

export default NotFound;
