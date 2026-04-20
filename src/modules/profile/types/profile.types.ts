export interface UserProfile {
	id?: string;
	phoneNumber?: string;
	address?: string;
	bio?: string;
	skills?: string[];
	avatarUrl?: string;
	linkedin?: string;
	github?: string;
}

export interface ProfileResponse {
	success: boolean;
	message: string;
	data: UserProfile;
}
