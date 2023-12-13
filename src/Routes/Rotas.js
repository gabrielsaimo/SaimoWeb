import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "../pages/App";
import Garçom from "../pages/modules/Garçom";
import Cozinha from "../pages/modules/Cozinha";
import Bar from "../pages/modules/BarMan";
import MenuDashboard from "../pages/modules/MenuDasboar";
import Login from "../pages/modules/Login";
import Home from "../pages/modules/Home";

export default function Rotas() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/Login/:msn?" element={<Login />} />
      <Route path="/Dashboard/:Company" element={<MenuDashboard />} />
      <Route path="/Garçom/:idCompany?" element={<Garçom />} />
      <Route path="/Catalogo/:Company?" element={<App />} />
      <Route path="/Cardapio/:Company?" element={<App />} />
      <Route parh="*">"404 - Not Found"</Route>
      <Route path="/Cozinha/:idCompany?" element={<Cozinha />}>
        "Cozinha"
      </Route>
      <Route path="/Bar" element={<Bar />}>
        "Bar"
      </Route>
    </Routes>
  );
}
