import React from "react";
import "../style/notfound.css";
const NotFound = () => {
  return (
    <div className="container">
      <div className="error-code" style={{color: "#4aa3df"}}>404 ERROR</div>
      <div className="error-message" style={{color: "#4aa3df"}}>Sorry, the page not found</div>
      <div className="error-image">
        <img
          alt="A cartoonish document with X eyes and a tongue sticking out, representing a 404 error"
          src="https://oaidalleapiprodscus.blob.core.windows.net/private/org-RcpoXHkzChYnDbFAyeQ8tamr/user-ehrvabJ3DufsCu8YJ7PqY5gl/img-21llMrpN6YZ2B7RbHXKymnAB.png?st=2024-09-27T15%3A36%3A53Z&se=2024-09-27T17%3A36%3A53Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-09-26T23%3A18%3A56Z&ske=2024-09-27T23%3A18%3A56Z&sks=b&skv=2024-08-04&sig=rSh%2BnlMfNW3mCdX0OSAFP4VXk45YPfRJcgtckxspRRE%3D"
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
