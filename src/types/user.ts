export type UserRole = 'admin' | 'user';

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    role: UserRole;
    approved: boolean;
    dailyUsageCount: number;
    lastUsageReset: string; // ISO string
    createdAt: string; // ISO string
}
