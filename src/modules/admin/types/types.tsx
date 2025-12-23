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

export interface CreateProjectPayload {
    name: string;
    description: string;
    startDate: string | Date;
    endDate: string | Date;
    gitRepoUrl?: string;
}

export interface CreateProjectResponse {
    success: boolean;
    message: string;
    data: any; // Using any for now, can be specific Project type later
}