import React from "react";
import "./FeaturedCardTemplate.css";

export default function FeaturedCardTemplate({
  image,
  section,
  title,
  date,
  onClick,
}) {
  return (
    <>
      <div className="Card-Parent" onClick={onClick}>
        <div className="Card-Header">
          <img src={image} alt="sample pic" fetchpriority="high" />
        </div>
        <div className="Card-Body">
          <p className="CardBody-Section">{section}</p>
          <p className="CardBody-Title">{title}</p>
          <p className="CardBody-Date">{date}</p>
        </div>
      </div>
    </>
  );
}
