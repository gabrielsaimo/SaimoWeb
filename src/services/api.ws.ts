import axios from "axios";
const api = axios.create({
  baseURL: "https://saimo-back.vercel.app/",
});
const apiNotification = axios.create({
  baseURL: "http://192.168.12.11:3020/",
});

export { api, apiNotification };
