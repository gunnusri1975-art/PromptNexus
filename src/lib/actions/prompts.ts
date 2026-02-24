'use server';

import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, limit, orderBy } from 'firebase/firestore';

const EXAMPLE_PROMPTS = [
    {
        title: "Advanced Business Analytics",
        description: "A comprehensive prompt for analyzing quarterly fiscal reports and extracting key KPIs.",
        category: "Business",
        difficulty: "Professional",
        content: "You are an expert financial analyst. Analyze the following fiscal data and provide: 1. Key revenue drivers, 2. Potential cost-cutting areas, 3. Market sentiment analysis. [DATA]: ",
        tags: ["finance", "analytics", "reporting"],
        approved: true,
        authorId: "admin",
        authorName: "Nexus Admin",
        createdAt: new Date().toISOString()
    },
    {
        title: "Creative Story World-Builder",
        description: "Generate deep lore and environmental descriptions for fantasy or sci-fi settings.",
        category: "Creative",
        difficulty: "Expert",
        content: "Draft a 500-word history of a civilization that lives entirely on floating islands. Focus on their 'Wind-Catcher' technology and social hierarchy based on altitude.",
        tags: ["writing", "fantasy", "lore"],
        approved: true,
        authorId: "admin",
        authorName: "Nexus Admin",
        createdAt: new Date().toISOString()
    },
    {
        title: "Python Microservice Generator",
        description: "Quickly scaffold a FastAPI service with database models and JWT auth.",
        category: "Coding",
        difficulty: "Expert",
        content: "Create a Python FastAPI boilerplate with: 1. SQLAlchemy async models, 2. Pydantic schemas, 3. JWT authentication middleware. Focus on clean code and PEP 8 standards.",
        tags: ["python", "fastapi", "backend"],
        approved: true,
        authorId: "admin",
        authorName: "Nexus Admin",
        createdAt: new Date().toISOString()
    },
    {
        title: "SEO Strategy Architect",
        description: "Plan a content cluster strategy for high-competition keywords.",
        category: "Marketing",
        difficulty: "Intermediate",
        content: "Based on the keyword [KEYWORD], create a pillar-cluster content map for the next 3 months, including LSI keywords and meta-description templates.",
        tags: ["seo", "marketing", "content"],
        approved: true,
        authorId: "admin",
        authorName: "Nexus Admin",
        createdAt: new Date().toISOString()
    }
];

export async function seedInitialPromptsAction() {
    try {
        // Check if prompts already exist
        const promptsRef = collection(db, 'prompts');
        const q = query(promptsRef, limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            return { success: false, message: "Prompts already exist. Seeding skipped." };
        }

        // Add example prompts
        for (const prompt of EXAMPLE_PROMPTS) {
            await addDoc(promptsRef, prompt);
        }

        return { success: true, message: `Successfully seeded ${EXAMPLE_PROMPTS.length} prompts.` };
    } catch (error: any) {
        console.error("Seeding error:", error);
        return { success: false, message: error.message };
    }
}
export async function getPromptsAction() {
    try {
        const promptsRef = collection(db, 'prompts');
        const q = query(promptsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const prompts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, prompts };
    } catch (error: any) {
        console.error("Get prompts error:", error);
        return { success: false, message: error.message };
    }
}

export async function submitPromptAction(promptData: any) {
    try {
        const promptsRef = collection(db, 'prompts');
        await addDoc(promptsRef, {
            ...promptData,
            approved: false, // Default to false for moderation
            createdAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        console.error("Submit prompt error:", error);
        return { success: false, message: error.message };
    }
}

export async function addPromptAction(promptData: {
    title: string;
    description: string;
    content: string;
    category: string;
    difficulty: string;
    tags: string[];
}) {
    try {
        const promptsRef = collection(db, 'prompts');
        await addDoc(promptsRef, {
            ...promptData,
            approved: true,
            authorId: 'admin',
            authorName: 'Nexus Admin',
            createdAt: new Date().toISOString(),
        });
        return { success: true };
    } catch (error: any) {
        console.error("Add prompt error:", error);
        return { success: false, message: error.message };
    }
}

export async function deletePromptAction(promptId: string) {
    try {
        const promptRef = doc(db, 'prompts', promptId);
        await deleteDoc(promptRef);
        return { success: true };
    } catch (error: any) {
        console.error("Delete prompt error:", error);
        return { success: false, message: error.message };
    }
}
