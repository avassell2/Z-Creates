import axios from "axios";

const PORT = process.env.PORT || 8800;

export const makeRequest = axios.create({
  baseURL: `https://z-creates-yteg.onrender.com/${PORT}/api/`,
  withCredentials: true,
});
