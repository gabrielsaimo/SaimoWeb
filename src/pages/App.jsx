import React, { useState, useEffect, Suspense, lazy } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Affix, Button, FloatButton, Input, Modal, Space, Spin } from "antd";
import { Link, useParams } from "react-router-dom";
import "../css/App.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Menu from "./modules/BottonMenu";
import Msn from "./modules/Msn";
import Footer from "./modules/footer";
import { getStatusPedidos } from "../services/Pedidos.ws";
const CollapseMenu = lazy(() => import("./modules/Collapse"));
function App() {
  const { Company } = useParams();
  console.log("🚀 ~ file: App.jsx:14 ~ App ~ idCompany:", Company);
  const [visible2, setVisible2] = useState(false);
  const [contar, setContar] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  useEffect(() => {
    if (contar > 10 && contar < 15) {
      setVisible2(true);
    }
  }, [contar]);

  const handleLogoClick = async () => {
    setContar(contar + 1);
  };

  const getMesas = (e) => {
    setPedidos([]);
    if (e === "") return;
    getPedidos(e);
  };

  async function getPedidos(e) {
    const data = await getStatusPedidos(e);
    setPedidos(data);
  }

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
          <Menu />
        </Affix>
      </div>

      <Suspense fallback={<Spin />}>
        <CollapseMenu props={Company} />
      </Suspense>

      <Space direction="vertical" style={{ margin: "10px 0" }}></Space>

      <FloatButton.BackTop />
      <Msn />
      <Footer />
      <div style={{ height: 30 }} />
    </div>
  );
}

export default App;
