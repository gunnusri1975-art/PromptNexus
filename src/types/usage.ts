export interface UsageLog {
    id?: string;
    userId: string;
    timestamp: string; // ISO string
    promptId?: string;
    tokensUsed?: number;
    type: 'chat' | 'tool';
}
