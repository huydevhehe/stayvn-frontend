import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL 
})

axiosClient.interceptors.request.use((config) => {
    config.headers["ngrok-skip-browser-warning"] = "true"
    const token = localStorage.getItem("token")

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default axiosClient