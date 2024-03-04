import React, { useState, Suspense, lazy } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Affix, FloatButton, Space, Spin } from "antd";
import { useParams } from "react-router-dom";
import "../css/App.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Menu from "./modules/BottonMenu";
import Footer from "./modules/footer";
import SlideRenderer from "./Components/slide";
const CollapseMenu = lazy(() => import("./modules/Collapse"));
function App() {
  const { Company } = useParams();
  const [contar, setContar] = useState(0);

  const handleLogoClick = async () => {
    setContar(contar + 1);
  };

  return (
    <div className="App background_fundo">
      <LazyLoadImage
        src={require("../assets/saimo.webp")}
        className="logo"
        alt="logo-principal"
        style={{ width: "300px", borderRadius: "100%", marginTop: "50px" }}
        loading="eager"
        decoding="async"
        onClick={() => handleLogoClick()}
      />
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
