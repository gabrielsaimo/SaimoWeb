import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "../pages/App";
import Garçom from "../pages/modules/Garçom";
import Cozinha from "../pages/modules/Cozinha";
import Bar from "../pages/modules/BarMan";
import MenuDashboard from "../pages/modules/MenuDasboar";
import Login from "../pages/modules/Login";
import Home from "../pages/modules/Home";
import { Button, Result } from "antd";

export default function Rotas() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/Login/:msn?" element={<Login />} />
      <Route path="/Dashboard/:Company" element={<MenuDashboard />} />
      <Route path="/Garçom/:Company" element={<Garçom />} />
      <Route path="/Catalogo/:Company" element={<App />} />
      <Route path="/Cardapio/:Company" element={<App />} />
      <Route
        path="/*"
        element={
          <Result
            status="404"
            title="404"
            subTitle="Desculpe, a página que você visitou não existe."
            extra={
              <Button type="primary" href="/">
                Voltar para o inicio
              </Button>
            }
          />
        }
      ></Route>
      <Route
        path="*"
        element={
          <Result
            status="404"
            title="404"
            subTitle="Desculpe, a página que você visitou não existe."
            extra={
              <Button type="primary" href="/">
                Voltar para o inicio
              </Button>
            }
          />
        }
      ></Route>
      <Route path="/Cozinha/:Company" element={<Cozinha />}>
        "Cozinha"
      </Route>
      <Route path="/Bar" element={<Bar />}>
        "Bar"
      </Route>
    </Routes>
  );
}
