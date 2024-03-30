import React from "react";
import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: "https://quickkchat.onrender.com",
});
