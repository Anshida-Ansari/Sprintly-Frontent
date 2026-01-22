export interface Standup {
  _id: string;
  yesterday: string;
  today: string;
  blockers: string;
  user: {
    _id: string;
    name: string;
  };
  createdAt: string;
  comments: StandupComment[];
}

export interface StandupComment {
  _id: string;
  message: string;
  user: {
    name: string;
  };
  createdAt: string;
}

export interface SubmitStandupPayload {
  yesterday: string;
  today: string;
  blockers: string;
}
