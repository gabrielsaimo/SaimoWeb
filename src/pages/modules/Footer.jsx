import React from "react";
import logo from "../../assets/logo.webp";
const Footer = () => {
  const handleLogoClick = () => {
    window.location.href = "/";
  };
  return (
    <div
      onClick={() => handleLogoClick()}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        height: 50,
        color: "#FFF",
        fontSize: 12,
        zIndex: 5,
      }}
    >
      <p>Copyrights © 2024 Menu Digital </p>
      <div style={{ width: 10 }} />
      <img
        src={logo}
        alt="img"
        width={40}
        height={40}
        style={{ borderRadius: 50 }}
      />
    </div>
  );
};

export default Footer;
