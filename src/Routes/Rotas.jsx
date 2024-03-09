import React from "react";
import { Routes, Route } from "react-router-dom";

import App from "../pages/App";
import Garçom from "../pages/modules/Garçom";
import Cozinha from "../pages/modules/Cozinha";
import Bar from "../pages/modules/BarMan";
import MenuDashboard from "../pages/modules/MenuDasboar";
import Login from "../pages/modules/Login";
import Home from "../pages/modules/Home";
import Error404 from "../pages/modules/Error404";
import Polices from "../pages/modules/Polices";
import Forgot from "../pages/modules/forgot";
import Company from "../pages/modules/Company";

export default function Rotas() {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/Login/:msn?" element={<Login />} />
      <Route path="/Forgot" element={<Forgot />} />
      <Route path="/Company" element={<Company />} />
      <Route path="/Dashboard/:Company" element={<MenuDashboard />} />
      <Route path="/Garçom/:Company" element={<Garçom />} />
      <Route path="/Catalogo/:Company" element={<App />} />
      <Route path="/Cardapio/:Company" element={<App />} />
      <Route path="/privacy-policy" element={<Polices />} />
      <Route path="/*" element={<Error404 />}></Route>
      <Route path="*" element={<Error404 />}></Route>
      <Route path="/Cozinha/:Company" element={<Cozinha />}>
        "Cozinha"
      </Route>
      <Route path="/Bar" element={<Bar />}>
        "Bar"
      </Route>
    </Routes>
  );
}
