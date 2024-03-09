import React, { useState, Suspense, lazy, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Affix, FloatButton, Space, Spin } from "antd";
import { useParams } from "react-router-dom";
import "../css/App.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Menu from "./modules/BottonMenu";
import Footer from "./modules/footer";
import SlideRenderer from "./Components/slide";
import { getlogoName } from "../services/config";
import { getStyles } from "../services/user.ws";
const CollapseMenu = lazy(() => import("./modules/Collapse"));
const CompanyName = window.location.href.split("/").pop();

function App() {
  const { Company } = useParams();
  const [contar, setContar] = useState(0);
  const [logo, setLogo] = useState(null);
  const [styles, setStyles] = useState("");

  useEffect(() => {
    getImgLogos(CompanyName);
    getStylesUser();
  }, []);

  const getStylesUser = async () => {
    const resp = await getStyles(CompanyName);
    setStyles(JSON.parse(resp[0].styles));
  };

  const handleLogoClick = async () => {
    setContar(contar + 1);
  };
  const getImgLogos = async (company) => {
    const img = await getlogoName(company);
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
            borderRadius: "100%",
            marginTop: "50px",
          }}
          loading="eager"
          decoding="async"
          onClick={() => handleLogoClick()}
        />
      )}
      <div style={{ display: "flex" }}>
        <Affix
          offsetTop={10}
          style={{ position: "fixed", right: 10, top: 10, zIndex: 9 }}
        >
          <Menu props={Company} />
        </Affix>
      </div>

      <Suspense fallback={<Spin />}>
        <SlideRenderer index={contar} />
        <CollapseMenu props={Company} />
      </Suspense>

      <Space direction="vertical" style={{ margin: "10px 0" }}></Space>

      <FloatButton.BackTop />

      <Footer />
      <div style={{ height: 30 }} />
    </div>
  );
}

export default App;
