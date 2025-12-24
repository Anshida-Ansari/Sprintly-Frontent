import axios from "axios";
import { UserAuth } from "../modules/auth/store/store";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})



api.interceptors.request.use(
    (config) => {
        const token = UserAuth.getState().token

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },

    (error) => Promise.reject(error)
)


const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})
api.interceptors.response.use(
    (response) => response,
    async (error) => {


        const originalRequest = error.config
        const authState = UserAuth.getState()

        if (!authState.isAuthenticated) {
            return Promise.reject(error)
        }
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {

                const res = await refreshApi.post("/auth/refresh")


                const newToken = res.data.data.accessToken
                const user = UserAuth.getState().user
                UserAuth.getState().login(user!, newToken)
                originalRequest.headers.Authorization = `Bearer ${newToken}`
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