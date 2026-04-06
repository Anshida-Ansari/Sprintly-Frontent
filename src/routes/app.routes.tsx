import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoutes from "./protected.route";
import { ROUTES } from "../constants/routes";

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
const SuperAdminLogs = lazy(() => import("../modules/superadmin/pages/superadmin.logs"));
const SuperAdminSettings = lazy(() => import("../modules/superadmin/pages/superadmin.settings"));
const MemberAccept = lazy(() => import("../modules/auth/pages/setPassword"));
const DeveloperLayout = lazy(() => import("../shared/layouts/developer.layout"));
const DashboardPage = lazy(() => import("../modules/developers/pages/developers.dashboard"));
const KanbanBoard = lazy(() => import("../modules/developers/pages/kanban-board"));
const Members = lazy(() => import("../modules/admin/pages/list.users"));
const Projects = lazy(() => import("../modules/admin/pages/projects"));
const ProjectDetail = lazy(() => import("../modules/admin/pages/project.detail"));
const UserStoriesPage = lazy(() => import("../modules/admin/pages/user-stories"));
const SprintsPage = lazy(() => import("../modules/admin/pages/sprints"));
const SprintPlanning = lazy(() => import("../modules/admin/pages/sprint-planning"));
const Meetings = lazy(() => import("../modules/admin/pages/meetings"));
const MeetingRoom = lazy(() => import("../modules/meeting/pages/MeetingRoom"));
const MeetingHistory = lazy(() => import("../modules/meeting/pages/MeetingHistory"));
const MyTasksPage = lazy(() => import("../modules/developers/pages/my.tasks"));
const DeveloperStandup = lazy(() => import("../modules/standup/pages/developer.standup"));
const DeveloperMeetings = lazy(() => import("../modules/meeting/pages/developer.meetings"));
const Settings = lazy(() => import("../modules/admin/pages/settings"));
const ProfilePage = lazy(() => import("../modules/profile/pages/profile.page"));
const DeveloperWorkLogs = lazy(() => import("../modules/developers/pages/worklogs"));
const AdminWorkLogs = lazy(() => import("../modules/admin/pages/worklogs"));

export const router = createBrowserRouter([
	// PUBLIC
	{
		path: ROUTES.PUBLIC.ROOT,
		element: <App />,
		children: [
			{ index: true, element: <LandingPage /> },
			{ path: ROUTES.PUBLIC.REGISTER.replace("/", ""), element: <Register /> },
			{ path: ROUTES.PUBLIC.LOGIN.replace("/", ""), element: <Login /> },
			{ path: ROUTES.PUBLIC.OTP.replace("/", ""), element: <OTP /> },
			{ path: ROUTES.PUBLIC.FORGOT_PASSWORD.replace("/", ""), element: <ForgotPassword /> },
			{ path: ROUTES.PUBLIC.FORGOT_OTP.replace("/", ""), element: <ForgotPasswordOtp /> },
			{ path: ROUTES.PUBLIC.RESET_PASSWORD.replace("/", ""), element: <ResetPassword /> },
			{ path: ROUTES.PUBLIC.MEMBER_ACCEPT.replace("/", ""), element: <MemberAccept /> },
		],
	},

	// PROTECTED
	{
		element: <ProtectedRoutes />,
		children: [
			// ADMIN
			{
				path: ROUTES.ADMIN.ROOT,
				element: <AdminLayout />,
				children: [
					{ path: ROUTES.ADMIN.DASHBOARD, element: <AdminDashboard /> },
					{ path: ROUTES.ADMIN.PROJECTS, element: <Projects /> },
					{ path: ROUTES.ADMIN.PROJECT_DETAIL, element: <ProjectDetail /> },
					{ path: ROUTES.ADMIN.MEMBERS, element: <Members /> },
					{ path: ROUTES.ADMIN.SPRINTS, element: <SprintsPage /> },
					{ path: ROUTES.ADMIN.SPRINT_PLANNING, element: <SprintPlanning /> },
					{ path: ROUTES.ADMIN.USER_STORIES, element: <UserStoriesPage /> },
					{ path: ROUTES.ADMIN.TEAM, element: <div>Team</div> },
					{ path: ROUTES.ADMIN.MEETINGS, element: <Meetings /> },
					{ path: "meetings/history", element: <MeetingHistory /> },
					{ path: ROUTES.ADMIN.REPORTS, element: <div>Reports</div> },
					{ path: ROUTES.ADMIN.SETTINGS, element: <Settings /> },
					{ path: ROUTES.ADMIN.PROFILE, element: <ProfilePage /> },
					{ path: ROUTES.ADMIN.WORKLOGS, element: <AdminWorkLogs /> },
				],
			},

			// SUPER ADMIN
			{
				path: ROUTES.SUPERADMIN.ROOT,
				element: <SuperAdminLayout />,
				children: [
					{ path: ROUTES.SUPERADMIN.DASHBOARD, element: <SuperAdminDashboard /> },
					{ path: ROUTES.SUPERADMIN.COMPANIES, element: <SuperAdminCompanyPage /> },
					{ path: ROUTES.SUPERADMIN.COMPANY_DETAIL, element: <SuperAdminCompanyDetail /> },
					{ path: ROUTES.SUPERADMIN.LOGS, element: <SuperAdminLogs /> },
					{ path: ROUTES.SUPERADMIN.SETTINGS, element: <SuperAdminSettings /> },
				],
			},

			// DEVELOPERS
			{
				path: ROUTES.DEVELOPER.ROOT,
				element: <DeveloperLayout />,
				children: [
					{ path: ROUTES.DEVELOPER.DASHBOARD, element: <DashboardPage /> },
					{ path: ROUTES.DEVELOPER.KANBAN, element: <KanbanBoard /> },
					{ path: ROUTES.DEVELOPER.TASKS, element: <MyTasksPage /> },
					{ path: ROUTES.DEVELOPER.PROJECTS, element: <Projects isReadOnly={true} /> },
					{ path: ROUTES.DEVELOPER.PROJECT_DETAIL, element: <ProjectDetail isReadOnly={true} /> },
					{ path: ROUTES.DEVELOPER.SPRINTS, element: <div>Sprints Page</div> },
					{ path: ROUTES.DEVELOPER.STANDUPS, element: <DeveloperStandup /> },
					{ path: ROUTES.DEVELOPER.MEETINGS, element: <DeveloperMeetings /> },
					{ path: "meetings/history", element: <MeetingHistory /> },
					{ path: ROUTES.DEVELOPER.PROFILE, element: <ProfilePage /> },
					{ path: ROUTES.DEVELOPER.WORKLOGS, element: <DeveloperWorkLogs /> },
				],
			},
			{ path: "/meeting/:roomId", element: <MeetingRoom /> },
		],
	},
]);
