import axios from "axios";
const bearerToken = localStorage.getItem("access_token");
const api = axios.create({
  baseURL: "https://saimo-back.vercel.app/",
  //baseURL: "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${bearerToken}`.replace(/['"]+/g, ""),
  },
});

const apiNotification = axios.create({
  baseURL: "http://192.168.12.11:3020/",
});

export { api, apiNotification };
