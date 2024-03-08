import React from 'react'
import axios from 'axios'


export const AxiosInstance = axios.create({
    baseURL :"http://localhost:7000",

});