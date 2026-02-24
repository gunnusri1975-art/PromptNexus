export type PromptCategory = 'productivity' | 'coding' | 'creative' | 'marketing' | 'learning' | 'other';

export interface Prompt {
    id: string;
    title: string;
    description: string;
    content: string; // The full template
    category: PromptCategory;
    tags: string[];
    createdBy: string; // User UID
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

export interface UserPromptCopy {
    id: string;
    userId: string;
    originalPromptId: string;
    customContent: string;
    lastUsedAt: string; // ISO string
}
