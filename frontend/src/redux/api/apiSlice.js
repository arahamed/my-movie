import {fetchBaseQuery,createApi}from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants.js";

const apiSlice = createApi({
    baseQuery:fetchBaseQuery({baseUrl:BASE_URL}),
    endpoints:()=>({}),
})


export default apiSlice;