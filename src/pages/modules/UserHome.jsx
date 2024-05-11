import React, { useState, useCallback, useMemo, useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import { Button, Divider, Spin } from "antd";
import {
  BookOutlined,
  FieldTimeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { getImgLogo } from "../../services/config";

function UseHome() {
  const [language, setLanguage] = useState(localStorage.getItem("i18nextLng"));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { idcompany, Company } = useParams();
  const [imgSrc, setImgSrc] = useState(null);
  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setLanguage(localStorage.getItem("i18nextLng"));
  }, []);

  const buttonStyle = useMemo(
    () => ({
      width: "80vw",
      maxWidth: 400,
      height: "11vh",
      fontSize: "6vh",
    }),
    []
  );

  const styles = useMemo(
    () => ({
      button1: {
        ...buttonStyle,
        backgroundColor: "#00a758",
        color: "#753d00",
      },
      button2: {
        ...buttonStyle,
        backgroundColor: "#753d00",
        color: "#00a758",
      },
      button3: {
        ...buttonStyle,
        backgroundColor: "#FFF",
        color: "#00a758",
        fontSize: "5vh",
      },
    }),
    [buttonStyle]
  );

  const renderButton = useCallback(
    (link, style, icon, text) => (
      <div className="App-header-content-button">
        <Link to={link}>
          <Button style={style} shape="round" icon={icon} size={"middle"}>
            <b style={{ fontSize: "1.1em" }}>{text}</b>
          </Button>
        </Link>
      </div>
    ),
    []
  );
  useEffect(() => {
    getImgLogos();
  }, []);

  const getImgLogos = async () => {
    const img = await getImgLogo(idcompany);
    if (img[0]) {
      setImgSrc(img[0]);
    }
  };

  return (
    <div className="App background_fundo">
      <div className="App-header-content">
        <div className="App-header-content-logo" style={{ marginTop: 50 }}>
          {imgSrc ? (
            <img
              src={atob(imgSrc.imagem)}
              alt="logo"
              className="logohome"
              style={{
                width: 300,
                marginRight: 5,
                borderRadius: 500,
                marginLeft: 16,
                border: "solid 1px #000000",
              }}
            />
          ) : (
            <Spin />
          )}

          <img />
        </div>

        <Divider />
        {renderButton(
          `/Cardapio/${idcompany}/${Company}`,
          styles.button1,
          <BookOutlined />,
          "Cardápio"
        )}
        <Divider />
        {renderButton(
          `/Delivery/${idcompany}/${Company}`,
          styles.button2,
          <ShoppingOutlined />,
          "Delivery"
        )}
        <Divider />
        {renderButton(
          `/Reserva/${idcompany}/${Company}`,
          styles.button3,
          <FieldTimeOutlined />,
          "Reserva"
        )}
        <Divider />
      </div>
    </div>
  );
}

export default React.memo(UseHome);
