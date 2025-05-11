import axios from "axios";


export const makeRequest = axios.create({
  baseURL: "https://z-creates-production.up.railway.app/api/",
  withCredentials: true,
});
