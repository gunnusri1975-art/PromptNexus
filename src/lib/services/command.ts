import { CommandCode } from "@/types/commandCode";

// Initial set of standard command codes
export const DEFAULT_COMMAND_CODES: CommandCode[] = [
    {
        code: "SUM90",
        expansion: "Summarize the following text in exactly 90 words with a professional tone:",
        description: "Brief professional summary",
        inputPlaceholder: "[Enter text to summarize]"
    },
    {
        code: "EXP2",
        expansion: "Explain the following concept like I am 5 years old, using 2 metaphors:",
        description: "ELIs format with metaphors",
        inputPlaceholder: "[Enter concept]"
    },
    {
        code: "TONE:Expert",
        expansion: "Rewrite the following input using highly technical, expert-level terminology and deep industrial context:",
        description: "Professional technical rewrite",
        inputPlaceholder: "[Enter draft text]"
    }
];

export const CommandService = {
    // Detect and expand command codes in a string
    expandInput(text: string): string {
        let expanded = text;

        DEFAULT_COMMAND_CODES.forEach(cmd => {
            // Look for /CODE at the start or mid-text
            const regex = new RegExp(`/${cmd.code}`, 'g');
            expanded = expanded.replace(regex, cmd.expansion);
        });

        return expanded;
    },

    // Get all available shortcuts
    getAvailableCommands(): CommandCode[] {
        return DEFAULT_COMMAND_CODES;
    }
};
