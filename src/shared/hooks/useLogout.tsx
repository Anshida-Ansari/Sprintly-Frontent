import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../modules/auth/store/store";

export function useLogout(){
    const navigate = useNavigate()

    const logout = ()=>{
        UserAuth.getState().logout()
        navigate('/login',{replace:true})
    }
    return logout
}