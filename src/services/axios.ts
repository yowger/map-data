import axios from "axios"

const BASE_URL = "http://localhost:3000/api"

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
})
