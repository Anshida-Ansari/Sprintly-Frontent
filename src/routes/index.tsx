import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import SprintlyLanding from "../shared/components/landingPage/LandingPage";
import AdminRegister from "../shared/components/Register/registerPage";
import SprintlyLogin from "../shared/components/Login/login";

export const router = createBrowserRouter([
    {
        path:'/',
        element: <App/>,
        children:[
            {
                index:true,
                element:<SprintlyLanding/>
            },
            {
                path:'register',
                element:<AdminRegister/>
            },
            {
                path:'login',
                element:<SprintlyLogin/>
            } 
        ]
    }
])