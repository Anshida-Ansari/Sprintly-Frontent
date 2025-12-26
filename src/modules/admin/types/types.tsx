export interface InviteMemberPayload {
    name: string;
    email: string;
}

export interface InviteMemberResponse {
    message: string;
    inviteLink: string;
}
export interface VerifyInvitationResponse {
    success: boolean,
    data: {
        name: string;
        email: string;
        companyId: string;
    }

}


export interface SetPasswordPayload {
    token: string;
    password: string;
    confirmPassword: string;
}

export interface SetPasswordResponse {
    message: string;
}

export type ProjectStatus = 'Active' | 'Completed';

export interface IProject {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
    gitRepoUrl?: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
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