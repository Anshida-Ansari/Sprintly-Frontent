export interface InviteMemberPayload {
	name: string;
	email: string;
	role: string;
}

export interface InviteMemberResponse {
	message: string;
	inviteLink: string;
}
export interface VerifyInvitationResponse {
	success: boolean;
	data: {
		name: string;
		email: string;
		companyId: string;
	};
}

export interface SetPasswordPayload {
	token: string;
	password: string;
	confirmPassword: string;
}

export interface SetPasswordResponse {
	message: string;
}

// Member Types
export type MemberRole =
	| "superadmin"
	| "admin"
	| "lead"
	| "developers"
	| "developer";
export type MemberStatus = "active" | "block" | "pending";

export interface IMember {
	id: string;
	_id: string;
	name: string;
	email: string;
	role: MemberRole;
	status: MemberStatus;
	companyId: string;
	createdAt: string;
	updatedAt: string;
}

export interface GetMembersResponse {
	success: boolean;
	data: IMember[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export type ProjectStatus = "Active" | "Completed";

export interface IProject {
	id: string;
	name: string;
	description: string;
	status: ProjectStatus;
	startDate: string;
	endDate: string;
	gitRepoUrl?: string;
	members: IMember[];
	createdAt: string;
	updatedAt: string;
	analytics?: {
		totalStories: number;
		completedStories: number;
		progressPercentage: number;
	};
}

export interface GetProjectsResponse {
	success: boolean;
	data: IProject[];
	total: number;
	page: number;
	limit: number;
}

export interface CreateProjectPayload {
	name: string;
	description: string;
	startDate: string | Date;
	endDate: string | Date;
	gitRepoUrl?: string;
	leadId?: string;
}

export interface EditProjectPayload {
	projectId: string;
	name?: string;
	description?: string;
	startDate?: string | Date;
	endDate?: string | Date;
	gitRepoUrl?: string;
	status?: ProjectStatus;
}

export interface CreateProjectResponse {
	success: boolean;
	message: string;
	data: any;
}

export const UserStoryStatus = {
	IN_REVIEW: "In review",
	IN_PROGRESS: "In progress",
	IN_PENDING: "In pending",
	DONE: "Done",
} as const;

export type UserStoryStatus =
	(typeof UserStoryStatus)[keyof typeof UserStoryStatus];

export const PriorityStatus = {
	LOW: "Low",
	MEDIUM: "Medium",
	HIGH: "High",
} as const;

export type PriorityStatus =
	(typeof PriorityStatus)[keyof typeof PriorityStatus];

export interface IComment {
	userId: string;
	userName?: string;
	message: string;
	createdAt: string;
}

export interface AddCommentPayload {
	message: string;
}

export interface IUserStory {
	id: string;
	projectId: string;
	companyId: string;
	title: string;
	description: string;
	status: UserStoryStatus;
	priority: PriorityStatus;
	sprintId?: string;
	assignedTo?: string;
	estimationPoints?: number;
	acceptanceCriteria?: string[];
	comments?: IComment[];
	createdAt: string;
	updatedAt?: string;
}

export interface CreateUserStoryPayload {
	title: string;
	description?: string;
	priority?: PriorityStatus;
	sprintId?: string;
	assignedTo?: string;
	estimationPoints?: number;
	acceptanceCriteria?: string[];
}

export interface EditUserStoryPayload {
	title?: string;
	description?: string;
	status?: UserStoryStatus;
	priority?: PriorityStatus;
	sprintId?: string;
	assignedTo?: string;
	estimationPoints?: number;
	acceptanceCriteria?: string[];
}

export interface GetUserStoriesResponse {
	success: boolean;
	data: IUserStory[];
	total: number;
	page: number;
	limit: number;
}

export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export interface ISprint {
	id: string;
	_id: string;
	projectId: string;
	name: string;
	goal?: string;
	startDate: string;
	endDate: string;
	status: SprintStatus;
	createdAt: string;
	updatedAt: string;
}

export interface CreateSprintPayload {
	name: string;
	description?: string;
	goal?: string;
	startDate: string | Date;
	endDate: string | Date;
}

export interface EditSprintPayload {
	name?: string;
	goal?: string;
	startDate?: string | Date;
	endDate?: string | Date;
	status?: SprintStatus;
}

export interface GetSprintsResponse {
	success: boolean;
	data: ISprint[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export type SubtaskStatus = "In pending" | "In progress" | "Done";

export interface ISubtask {
	id: string;
	_id: string;
	userStoryId: string;
	companyId: string;
	title: string;
	status: SubtaskStatus;
	assignedTo?: string;
	estimatedHours?: number;
	actualHours?: number;
	comments?: IComment[];
	attachments?: { fileUrl: string; fileName: string }[];
	createdAt: string;
	updatedAt?: string;
}

export interface CreateSubtaskPayload {
	title: string;
	estimatedHours?: number;
}

export interface UpdateSubtaskTimePayload {
	estimatedHours?: number;
	actualHours?: number;
}

export interface UpdateSubtaskStatusPayload {
	status: SubtaskStatus;
}

export interface AssignSubtaskPayload {
	assignedTo: string;
}

export interface GetSubtasksResponse {
	success: boolean;
	data: ISubtask[];
}
