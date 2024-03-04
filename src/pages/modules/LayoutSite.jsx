import { Button, ColorPicker } from "antd";
import React, { useMemo, useState } from "react";

const SlideRenderer = () => {
  const [fundoColor, setFundoColor] = useState("#1677ff");
  const [textColor, setTextColor] = useState("#1677ff");
  const fundobgColor = useMemo(
    () =>
      typeof fundoColor === "string" ? fundoColor : fundoColor.toHexString(),
    [fundoColor]
  );

  const textbgColor = useMemo(
    () => (typeof textColor === "string" ? textColor : textColor.toHexString()),
    [textColor]
  );

  const FundoStyle = {
    marginTop: 16,
    backgroundColor: fundobgColor,
    width: 300,
    height: 300,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    cursor: "pointer",
    color: fundobgColor === "#ffffff" ? "#000000" : "#ffffff",
    border: fundobgColor === "#ffffff" ? "solid 1px #000000" : "solid 1px red",
  };

  const TextStyle = {
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    fontSize: 50,
    cursor: "pointer",
    marginLeft: 16,
    color: textbgColor,
    border: textbgColor === "#ffffff" ? "solid 1px #000000" : "solid 1px red",
    borderRadius: 10,
  };
  return (
    <div style={{ display: "flex" }}>
      <ColorPicker value={fundoColor} onChange={setFundoColor}>
        <div style={FundoStyle}>Fundo do Site</div>
      </ColorPicker>
      <ColorPicker value={textColor} onChange={setTextColor}>
        <p style={TextStyle}>Texto do Site</p>
      </ColorPicker>
    </div>
  );
};

export default SlideRenderer;
