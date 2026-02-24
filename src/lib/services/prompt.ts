"use client";

import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Prompt, UserPromptCopy } from "@/types/prompt";

export const PromptService = {
    // Fetch community prompts
    async getCommunityPrompts(): Promise<Prompt[]> {
        const promptsRef = collection(db, "prompts");
        const snapshot = await getDocs(promptsRef);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Prompt));
    },

    // Duplicate prompt to user's personalized collection
    async duplicatePrompt(userId: string, prompt: Prompt): Promise<string> {
        const copyRef = collection(db, "userPromptCopies");
        const newCopy: Omit<UserPromptCopy, "id"> = {
            userId,
            originalPromptId: prompt.id,
            customContent: prompt.content,
            lastUsedAt: new Date().toISOString(),
        };

        const docRef = await addDoc(copyRef, {
            ...newCopy,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        return docRef.id;
    },

    // Get user's duplicated prompts
    async getUserPrompts(userId: string): Promise<UserPromptCopy[]> {
        const copyRef = collection(db, "userPromptCopies");
        const q = query(copyRef, where("userId", "==", userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserPromptCopy));
    }
};
