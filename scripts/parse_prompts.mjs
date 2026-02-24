import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const content = readFileSync(resolve(import.meta.dirname, 'raw_prompts.txt'), 'utf8');
const lines = content.split('\n');

const prompts = [];
let currentPrompt = null;

for (let line of lines) {
    line = line.trim();
    // Match line like "1. Universal Clarity Prompt"
    const match = line.match(/^(\d+)\.\s+(.*)$/);
    if (match) {
        if (currentPrompt) {
            currentPrompt.content = currentPrompt.content.trim();
            prompts.push(currentPrompt);
        }
        currentPrompt = {
            title: match[2],
            description: match[2],
            category: "General",
            difficulty: "Beginner",
            content: "",
            tags: ["utility"],
            approved: true,
            authorId: "admin",
            authorName: "Nexus Admin",
            createdAt: new Date().toISOString()
        };
    } else if (currentPrompt) {
        currentPrompt.content += line + '\n';
    }
}

if (currentPrompt) {
    currentPrompt.content = currentPrompt.content.trim();
    prompts.push(currentPrompt);
}

// Enhancing default categories and tags based on titles
prompts.forEach(p => {
    let t = p.title.toLowerCase();
    if (t.includes('writing') || t.includes('content') || t.includes('story') || t.includes('rephr') || t.includes('rewrite')) p.category = "Writing";
    else if (t.includes('study') || t.includes('exam') || t.includes('learning')) p.category = "Education";
    else if (t.includes('career') || t.includes('planning') || t.includes('roadmap') || t.includes('productivity')) p.category = "Productivity";
    else if (t.includes('3d') || t.includes('face') || t.includes('photo') || t.includes('hair')) p.category = "Creative";
    else if (t.includes('ai') || t.includes('tech')) p.category = "Programming";

    // adjust tags
    p.tags = [p.category.toLowerCase(), "master"];

    // Default description to title but clearer
    p.description = `The ${p.title}. ${p.content.split('\n')[0].substring(0, 50)}...`;
});

writeFileSync(resolve(import.meta.dirname, 'parsed_prompts.json'), JSON.stringify(prompts, null, 2));
console.log(`Successfully parsed ${prompts.length} prompts to parsed_prompts.json`);
