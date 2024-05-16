import axios from "axios";
import { message } from "antd";

const bearerToken = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: "https://saimo-back.vercel.app/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${bearerToken}`.replace(/['"]+/g, ""),
  },
});

api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida, apenas retorne a resposta
    return response;
  },
  (error) => {
    // Se a resposta tiver um status 401, redirecione para a página de login
    if (error.response && error.response.status === 401) {
      window.location.href = "/login/token";
    }
    if (error.response && error.response.status === 500) {
      message.error("Erro interno no servidor");
    }

    // Se a resposta tiver um status diferente de 401, apenas rejeite o erro
    return Promise.reject(error);
  }
);

const apiNotification = axios.create({
  baseURL: "http://192.168.12.11:3020/",
});

export { api, apiNotification };
