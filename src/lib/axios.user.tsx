import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.APP_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})



api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },

    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const res = await api.post("/auth/refresh")

                const newToken = res.data.token
                localStorage.setItem("access_token", newToken)

                return api(originalRequest)
            } catch (error) {
                localStorage.removeItem("access_token")
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }

)

export default api