import { createBrowserRouter, } from "react-router-dom";
import { lazy } from "react";
import ProtectedRoutes from "./protected.route";
import App from "../App";

const Login = lazy(() => import("../modules/auth/pages/login"));
const Register = lazy(() => import("../modules/auth/pages/register"));
const OTP = lazy(() => import("../modules/auth/pages/otp"));
const LandingPage = lazy(() => import("../modules/landing/pages/Landing"));
const AdminDashboard = lazy(() => import("../modules/admin/pages/admin.dashboard"));
const SuperAdminDashboard = lazy(() => import("../modules/superadmin/pages/superadmin.dashboard"));
const ForgotPassword = lazy(() => import("../modules/auth/pages/forgotPassword"));
const ForgotPasswordOtp = lazy(() => import("../modules/auth/pages/forgotOtp"));
const ResetPassword = lazy(() => import("../modules/auth/pages/resetPassword"));
const AdminLayout = lazy(() => import("../shared/layouts/admin.layout"));
const SuperAdminLayout = lazy(() => import("../shared/layouts/superadmin.layout"));
const SuperAdminCompanyPage = lazy(() => import("../modules/superadmin/pages/superadmin.companies"));
const SuperAdminCompanyDetail = lazy(() => import("../modules/superadmin/pages/superadmin.companies.detail"));
const MemberAccept = lazy(() => import("../modules/auth/pages/setPassword"));
const DeveloperLayout = lazy(() => import("../shared/layouts/developer.layout"));
const DashboardPage = lazy(() => import("../modules/developers/pages/developers.dashboard"));
const Members = lazy(() => import("../modules/admin/pages/list.users"));
const Projects = lazy(() => import("../modules/admin/pages/projects"));
const ProjectDetail = lazy(() => import("../modules/admin/pages/project.detail"));
const UserStoriesPage = lazy(() => import("../modules/admin/pages/user-stories"));

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
      { path: "forgot-otp", element: <ForgotPasswordOtp /> },
      { path: "reset-password", element: <ResetPassword /> },
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
          { path: "projects", element: <Projects /> },
          { path: "projects/:projectId", element: <ProjectDetail /> },
          { path: "members", element: <Members /> },
          { path: "sprints", element: <div>Sprints</div> },
          { path: "user-stories", element: <UserStoriesPage /> },
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
          { path: "companies", element: <SuperAdminCompanyPage /> },
          { path: "companies/:companyId", element: <SuperAdminCompanyDetail /> },
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
