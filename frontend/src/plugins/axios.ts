import axios from "axios"



export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT),
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
