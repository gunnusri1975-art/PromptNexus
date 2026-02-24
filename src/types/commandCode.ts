export interface CommandCode {
    code: string; // e.g., "SUM90"
    expansion: string; // e.g., "Summarize the following text in exactly 90 words:"
    description: string;
    inputPlaceholder?: string;
}
