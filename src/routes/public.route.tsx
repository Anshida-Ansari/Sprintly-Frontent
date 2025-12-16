import { Navigate, Outlet } from "react-router-dom";
import { UserAuth } from "../modules/auth/store/store";

export default function PublicRoutes(){
    const token = UserAuth((s)=>s.token)
    if(token){
        return <Navigate to='/' replace />

    }
    return <Outlet/>
}