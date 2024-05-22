import React, { useState, Suspense, lazy, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FloatButton, Space, Spin } from "antd";
import { useParams } from "react-router-dom";
import "../../css/App.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Footer from "./Footer";
import SlideRenderer from "../Components/slide";
import { getImgLogoPublic } from "../../services/config";
import { getStyles } from "../../services/user.ws";
const CollapseMenu = lazy(() => import("./Collapse"));

function Cardapio() {
  const { idcompany, Company } = useParams();
  const [contar, setContar] = useState(0);
  const [logo, setLogo] = useState(null);
  const [styles, setStyles] = useState("");

  useEffect(() => {
    getStylesUser();
    getImgLogos(idcompany);
  }, []);

  const getStylesUser = async () => {
    const resp = await getStyles(Company, idcompany);
    setStyles(JSON.parse(resp[0].styles));
  };

  const handleLogoClick = async () => {
    setContar(contar + 1);
  };
  const getImgLogos = async (idcompany) => {
    const img = await getImgLogoPublic(idcompany);
    if (img.length > 0) setLogo(img[0].imagem);
  };

  const styleFundo = {
    background: styles.backgrondColor,
  };

  return (
    <div className="App background_fundo" style={styleFundo}>
      {logo && (
        <LazyLoadImage
          src={atob(logo)}
          className="logo"
          alt="logo-principal"
          style={{
            width: "100vw",
            maxWidth: 300,
            marginTop: "50px",
          }}
          loading="eager"
          decoding="async"
          onClick={() => handleLogoClick()}
        />
      )}

      <Suspense fallback={<Spin />}>
        <SlideRenderer index={contar} />
        <CollapseMenu props={(idcompany, Company)} />
      </Suspense>

      <Space direction="vertical" style={{ margin: "10px 0" }}></Space>

      <FloatButton.BackTop />

      <Footer />
      <div style={{ height: 30 }} />
    </div>
  );
}

export default Cardapio;
