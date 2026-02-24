'use server';

import { db } from '../firebase';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from 'firebase/firestore';

export type ActivityType = 'Executed' | 'Modified' | 'Created' | 'System';

export interface ActivityLog {
    id?: string;
    userId: string;
    title: string;
    type: ActivityType;
    tokens?: number;
    timestamp: string;
}

export async function logActivityAction(userId: string, title: string, type: ActivityType, tokens?: number) {
    try {
        const activityRef = collection(db, 'activityLogs');
        await addDoc(activityRef, {
            userId,
            title,
            type,
            tokens: tokens || null,
            timestamp: new Date().toISOString()
        });
        return { success: true };
    } catch (error: any) {
        console.error("Log activity error:", error);
        return { success: false, error: error.message };
    }
}

export async function getRecentActivityAction(userId: string, limitCount: number = 5) {
    try {
        const activityRef = collection(db, 'activityLogs');
        const q = query(
            activityRef,
            where('userId', '==', userId),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        const activities = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ActivityLog[];

        return { success: true, activities };
    } catch (error: any) {
        console.error("Get activity error:", error);
        return { success: false, error: error.message };
    }
}
