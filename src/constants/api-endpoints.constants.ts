export const API_ENDPOINTS = {
	AUTH: {
		REGISTER_ADMIN: "auth/admin/register",
		VERIFY_OTP: "/auth/verify-otp",
		LOGIN: "/auth/login",
		VERIFY_FORGOT_OTP: "/auth/verify-forgot-otp",
		RESEND_OTP: "/auth/resend-otp",
		RESET_PASSWORD: "/auth/reset-password",
		FORGOT_PASSWORD_POST: "/auth/forgot-password",
		LOGOUT: "/auth/logout",
		ME: "/auth/me",
		SET_PASSWORD: "auth/set-password",
		FORGOT_PASSWORD_GET: "/forgot-password",
	},

	SUPERADMIN: {
		COMPANIES: "/superadmin/companies",
		COMPANY_STATUS: (companyId: string) =>
			`superadmin/company/${companyId}/status`,
		COMPANY_DETAIL: (companyId: string) => `superadmin/company/${companyId}`,
		DASHBOARD_STATS: "/superadmin/dashboard/stats",
		SUBSCRIPTION_ANALYTICS: "/superadmin/subscription-analytics",
		REVENUE_ANALYTICS: "/superadmin/analytics/revenue",
		SUBSCRIPTION_DISTRIBUTION: "/superadmin/analytics/subscriptions",
		TOP_COMPANIES: "/superadmin/analytics/top-companies",
		SUBSCRIPTION_REPORTS: "/superadmin/reports/subscriptions",
		PAYMENT_REPORTS: "/superadmin/reports/payments",
		EXPIRING_REPORTS: "/superadmin/reports/expiring-soon",
		TRIAL_REPORTS: "/superadmin/reports/trials",
		PLATFORM_ANALYTICS: "/superadmin/analytics/platform",
	},

	ADMIN: {
		PROJECT: {
			CREATE: "project/create-project",
			UPDATE: (projectId: string) => `project/update-project/${projectId}`,
			LIST: "project/projects",
			GET_BY_ID: (projectId: string) => `project/get-projects/${projectId}`,
			ADD_MEMBER: (projectId: string) => `project/${projectId}/add-member`,
		},
		SPRINT: {
			CREATE: (projectId: string) => `/project/${projectId}/sprints`,
			LIST: (projectId: string) => `/project/${projectId}/sprints`,
			EDIT: (projectId: string, sprintId: string) =>
				`/project/${projectId}/sprints/${sprintId}`,
			START: (sprintId: string) => `/project/${sprintId}/start`,
			COMPLETE: (sprintId: string) => `/project/${sprintId}/complete`,
			DELETE: (sprintId: string) => `/project/${sprintId}/delete`,
			ACTIVE: (projectId: string) => `/project/${projectId}/active-sprint`,
		},
		USERSTORY: {
			CREATE: (projectId: string) => `projects/${projectId}/user-stories`,
			UPDATE: (projectId: string, userStoryId: string) =>
				`projects/${projectId}/user-stories/${userStoryId}`,
			LIST: (projectId: string) => `projects/${projectId}/user-stories`,
			ASSIGN_SPRINT: (projectId: string) =>
				`projects/${projectId}/assign-sprint`,
			ASSIGN_MEMBER: (userStoryId: string) =>
				`projects/${userStoryId}/assign-member`,
			ADD_COMMENT: (userStoryId: string) => `projects/${userStoryId}/comments`,
		},
		SUBTASK: {
			LIST: (userStoryId: string) => `userstory/subtask/${userStoryId}`,
			CREATE: (userStoryId: string) => `userstory/${userStoryId}/subtask`,
			UPDATE_STATUS: (subtaskId: string) => `userstory/${subtaskId}/status`,
			UPDATE_TIME: (subtaskId: string) => `userstory/${subtaskId}/time`,
			ASSIGN: (subtaskId: string) => `userstory/${subtaskId}/assign-members`,
			DELETE: (subtaskId: string) => `userstory/${subtaskId}`,
			ADD_COMMENT: (subtaskId: string) => `userstory/${subtaskId}/comments`,
			UPLOAD_URL: `userstory/upload-url`,
			ADD_ATTACHMENT: (subtaskId: string) =>
				`userstory/${subtaskId}/attachments`,
			DOWNLOAD_URL: `userstory/download-url`,
		},
		MEMBER: {
			INVITE: "admin/invite-member",
			VERIFY_INVITATION: "admin/verify-invitation",
			LIST: "/admin/members",
			BLOCK: (userId: string) => `admin/block-user/${userId}`,
		},
		MEETING: {
			CREATE: "meeting",
			LIST_BY_PROJECT: (projectId: string) => `meeting/project/${projectId}`,
			UPDATE_STATUS: (meetingId: string) => `meeting/${meetingId}/status`,
			HISTORY: (projectId: string) => `meeting/history/${projectId}`,
		},
		ANALYTICS: {
			SPRINT_BURNDOWN: (sprintId: string) =>
				`/projects/burndown/sprint/${sprintId}`,
			USER_BURNDOWN: (sprintId: string) =>
				`/projects/burndown/user/${sprintId}`,
		},
	},

	GITHUB: {
		AUTH_INITIATE: "/github/auth/initiate",
		STATUS: "/github/status",
		DISCONNECT: "/github/disconnect",
	},

	REPORTS: {
		PROJECT_REPORT: (projectId: string) => `projects/${projectId}/reports-list`,
		ALL_PROJECTS_REPORT: `reports/projects`,
		SPRINT_REPORT: (projectId: string) =>
			`projects/${projectId}/reports/sprints`,
		ALL_SPRINTS_REPORT: `reports/sprints`,
		STORY_REPORT: (projectId: string) =>
			`projects/${projectId}/reports/stories`,
		ALL_STORIES_REPORT: `reports/userstories`,
		TASK_REPORT: (projectId: string) => `projects/${projectId}/reports/tasks`,
		ALL_TASKS_REPORT: `reports/subtasks`,
		USER_PERFORMANCE_REPORT: (projectId: string) =>
			`projects/${projectId}/reports/users`,
		ALL_PERFORMANCE_REPORT: `reports/performance`,
	},

	DEVELOPER: {
		DASHBOARD: (companyId: string) => `/companies/${companyId}/dashboard`,
		MY_TASKS: "projects/my-tasks",
		UPDATE_USERSTORY_STATUS: (userStoryId: string) =>
			`userstory/${userStoryId}/status`,
		ADD_COMMENT: (userStoryId: string) => `projects/${userStoryId}/comments`,
	},

	WORKLOG: {
		CREATE: "worklogs",
		MY_WORKLOGS: "worklogs/me",
		ADMIN_WORKLOGS: "worklogs/admin",
	},

	STANDUP: {
		BASE: (projectId: string, sprintId?: string) =>
			sprintId
				? `/project/sprint/${projectId}/${sprintId}/standups`
				: `/project/sprint/project/${projectId}/standups`,
		SUBMIT: (base: string) => base,
		LIST: (base: string) => base,
		TODAY: (base: string) => `${base}/today`,
		ADD_COMMENT: (base: string, standupId: string) =>
			`${base}/${standupId}/comments`,
	},

	PROFILE: {
		ME: (companyId: string) => `/companies/${companyId}/profile/me`,
		UPDATE: (companyId: string) => `/companies/${companyId}/profile`,
	},

	SHARED: {
		AI_CHAT: "/ai/chat",
		NOTIFICATIONS: "/notifications",
		NOTIFICATION_READ: (id: string) => `/notifications/${id}/read`,
		NOTIFICATIONS_READ_ALL: "/notifications/read-all",
	},
};
