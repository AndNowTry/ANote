import axios from "axios"



export const api = axios.create({
    baseURL: "https://api.example.com",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})

api.interceptors.response.use(
    (response) => {
        console.log("Response:", response)
        return response
    },
    (error) => {
        console.error("Response error:", error.response)
        return Promise.reject(error)
    }
)
