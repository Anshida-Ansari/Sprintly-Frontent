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