/* eslint-disable react/jsx-no-undef */
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes/Rotas";
import ReactDOM from "react-dom/client";
import "../src/css/index.css";
import reportWebVitals from "./reportWebVitals";
import { sendToVercelAnalytics } from "./vitals";
import "atropos/css";
import { Analytics } from "@vercel/analytics/react";
import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <ConfigProvider locale={ptBR}>
      <Analytics />
      <Routes />
    </ConfigProvider>
  </BrowserRouter>
);

reportWebVitals(sendToVercelAnalytics);
