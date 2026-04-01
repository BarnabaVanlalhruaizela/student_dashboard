import axios from "axios";

const api = axios.create({
  baseURL: "https://api.shikshacom.com/api",
  withCredentials: true,
});

export default api;