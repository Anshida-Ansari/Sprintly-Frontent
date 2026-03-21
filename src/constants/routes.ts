export const ROUTES = {
    PUBLIC: {
        ROOT: "/",
        LOGIN: "/login",
        REGISTER: "/register",
        OTP: "/otp",
        FORGOT_PASSWORD: "/forgot-password",
        FORGOT_OTP: "/forgot-otp",
        RESET_PASSWORD: "/reset-password",
        MEMBER_ACCEPT: "/member/accept",
    },

    ADMIN: {
        ROOT: "/admin",
        DASHBOARD: "dashboard",
        PROJECTS: "projects",
        PROJECT_DETAIL: "projects/:projectId",
        MEMBERS: "members",
        SPRINTS: "sprints",
        SPRINT_PLANNING: "sprint-planning",
        USER_STORIES: "user-stories",
        MEETINGS: "meetings",
        MEETING_ROOM: "meeting/:roomId",
        TEAM: "team",
        REPORTS: "reports",
        SETTINGS: "settings",
        PROFILE: "profile",
    },

    SUPERADMIN: {
        ROOT: "/superadmin",
        DASHBOARD: "dashboard",
        COMPANIES: "companies",
        COMPANY_DETAIL: "companies/:companyId",
        LOGS: "logs",
        SUBSCRIPTIONS: "subscriptions",
        SETTINGS: "settings",
    },

    DEVELOPER: {
        ROOT: "/developers",
        DASHBOARD: "dashboard",
        KANBAN: "kanban",
        TASKS: "tasks",
        PROJECTS: "projects",
        PROJECT_DETAIL: "projects/:projectId",
        SPRINTS: "sprints",
        STANDUPS: "standups",
        MEETINGS: "meetings",
        MEETING_ROOM: "meeting/:roomId",
        PERFORMANCE: "Performance",
        PROFILE: "profile",
    },
}

export const buildPath = {
    admin: (segment: string) => `${ROUTES.ADMIN.ROOT}/${segment}`,
    superadmin: (segment: string) => `${ROUTES.SUPERADMIN.ROOT}/${segment}`,
    developer: (segment: string) => `${ROUTES.DEVELOPER.ROOT}/${segment}`,
}