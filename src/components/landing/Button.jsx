import * as React from "react";
import "./Button.css";

const Button = ({
  className = "",
  variant = "default",
  size = "default",
  ...props
}) => {
  const variantClass = `ui-button-${variant}`;
  const sizeClass = `ui-button-size-${size}`;

  return <button className={`${className}`} {...props} />;
};

export { Button };
