import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes/Rotas";
import ReactDOM from "react-dom/client";
import "../src/css/index.css";
import reportWebVitals from "./reportWebVitals";
import { sendToVercelAnalytics } from "./vitals";
import "atropos/css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { Analytics } from "@vercel/analytics/react";
import { ConfigProvider } from "antd";
import ptBR from "antd/lib/locale/pt_BR";
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={ptBR}>
        <Analytics />
        <Routes />
      </ConfigProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

reportWebVitals(sendToVercelAnalytics);
