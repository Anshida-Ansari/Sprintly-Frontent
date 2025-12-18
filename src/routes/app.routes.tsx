import { createBrowserRouter,  } from "react-router-dom";
import ProtectedRoutes from "./protected.route";
import Login from "../modules/auth/pages/login"
import Register from "../modules/auth/pages/register";
import OTP from "../modules/auth/pages/otp";
import LandingPage from "../modules/landing/pages/Landing";
import App from "../App";
import AdminDashboard from "../modules/admin/pages/admin.dashboard";
import SuperAdminDashboard from "../modules/superadmin/pages/superadmin.dashboard";
import ForgotPassword from "../modules/auth/pages/forgotPassword";
import AdminLayout from "../shared/layouts/admin.layout";
import SuperAdminLayout from "../shared/layouts/superadmin.layout";
import SuperAdminCompanyPage from "../modules/superadmin/pages/superadmin.companies";
import SuperAdminCompanyDetail from "../modules/superadmin/pages/superadmin.companies.detail";
import MemberAccept from "../modules/auth/pages/setPassword";
import DeveloperLayout from "../shared/layouts/developer.layout";
import DashboardPage from "../modules/developers/pages/developers.dashboard";
import Members from "../modules/admin/pages/list.users";
//public routes
export const router = createBrowserRouter([
  // PUBLIC
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "otp", element: <OTP /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "member/accept", element: <MemberAccept /> },
    ],
  },

  // PROTECTED
  {
    element: <ProtectedRoutes />,
    children: [
      // ADMIN
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "projects", element: <div>Projects</div> },
          { path: "members", element: <Members/> },
          { path: "sprints", element: <div>Sprints</div> },
          { path: "user-stories", element: <div>User Stories</div> },
          { path: "team", element: <div>Team</div> },
          { path: "meetings", element: <div>Meetings</div> },
          { path: "reports", element: <div>Reports</div> },
          { path: "settings", element: <div>Settings</div> },
        ],
      },

      // SUPER ADMIN
      {
        path: "/superadmin",
        element: <SuperAdminLayout />,
        children: [
          { path: "dashboard", element: <SuperAdminDashboard /> },
          { path: "companies", element: <SuperAdminCompanyPage/> },
          {path:"companies/:companyId",element:<SuperAdminCompanyDetail/>},
          { path: "logs", element: <div>Active Logs</div> },
          { path: "subscriptions", element: <div>Subscription Plans</div> },
          { path: "settings", element: <div>Settings</div> },
        ],
      },

      // DEVELOPERS
      {
  path: "/developers",
  element: <DeveloperLayout />,  
  children: [
    { path: "dashboard", element: <DashboardPage /> },
    { path: "tasks", element: <div>My Tasks Page</div> },
    { path: "projects", element: <div>Projects Page</div> },
    { path: "sprints", element: <div>Sprints Page</div> },
    { path: "standups", element: <div>Issues Page</div> },
    { path: "Performance", element: <div>Settings Page</div> },
    { path: "Profile", element: <div>Settings Page</div> },
  ],
},
    ],
  },
]);

