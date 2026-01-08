export type LoginRequest = {
    email: string,
    password: string
}
export type RegisterRequest = {
    name: string,
    email: string,
    companyName: string,
    password: string,
    confirmPassword: string
}

export type VerifyOtpRequest = {
    token: string,
    otp: string
}

export type ResendOtpRequest = {
    token?: string,
    email?: string
}

export type ResetPasswordRequest = {
    email: string,
    newPassword: string,
    confirmPassword: string
}

export type ForgotPasswordRequest = {
    email: string
}


export type LogoutRequest = {
    refreshToken: string
}

export type ForgotRequest = {
    email: string
}
