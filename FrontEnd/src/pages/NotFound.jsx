// src/pages/NotFound.js
import React from "react";

const NotFound = () => {
  return (
    <div className="error-container flex flex-col justify-center items-center" >
      <img
        src="https://res-console.cloudinary.com/dnszuaxw1/media_explorer_thumbnails/4a4d08fc7669c4f5df01f64f4aa55ddc/detailed"
        alt="404 Error"
        style={{ width: "300px", marginBottom: "2rem" }}
      />
      <h1 style={{ fontSize: "3rem", color: "#D4AF37", marginBottom: "1rem" }}>404 - NOT FOUND</h1>
      <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "2rem" }}>
      The page you're looking for doesn't exist or has been moved.
      </p>
      <a href="/" className="btn" style={{ padding: "0.8rem 1.5rem", backgroundColor: "#D4AF37", color: "white", textDecoration: "none", borderRadius: "5px", transition: "all 0.3s ease" }}>
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFound;
