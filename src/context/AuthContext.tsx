"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile } from '../types/user';
import { notifyNewUserSignupAction } from '../lib/actions/email';

interface AuthContextType {
    user: FirebaseUser | null;
    profile: UserProfile | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    incrementUsage: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if we should use mock auth for development
        const isMockMode = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
            process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_api_key';

        if (isMockMode) {
            console.log("AuthContext: Running in Mock Mode");
            const mockUser = {
                uid: 'mock-123',
                email: 'demo@promptnexus.ai',
                displayName: 'Demo User'
            } as FirebaseUser;
            const mockProfile: UserProfile = {
                uid: 'mock-123',
                email: 'demo@promptnexus.ai',
                name: 'Demo User',
                role: 'admin',
                approved: true,
                dailyUsageCount: 5,
                lastUsageReset: new Date().toISOString(),
                createdAt: new Date().toISOString(),
            };

            setUser(mockUser);
            setProfile(mockProfile);
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch or create profile
                const profileRef = doc(db, 'users', firebaseUser.uid);
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    setProfile(profileSnap.data() as UserProfile);

                    // Subscribe to profile changes
                    onSnapshot(profileRef, (doc) => {
                        const data = doc.data() as UserProfile;
                        setProfile(data);
                        checkAndResetUsage(data);
                    });
                } else {
                    // New user setup
                    const newProfile: UserProfile = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email || '',
                        name: firebaseUser.displayName || '',
                        role: 'user',
                        approved: false,
                        dailyUsageCount: 0,
                        lastUsageReset: new Date().toISOString(),
                        createdAt: new Date().toISOString(),
                    };
                    await setDoc(profileRef, newProfile);
                    setProfile(newProfile);

                    // Notify admin of new signup via Server Action
                    notifyNewUserSignupAction(newProfile.name, newProfile.email);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const logout = async () => {
        await signOut(auth);
    };

    const checkAndResetUsage = async (currentProfile: UserProfile) => {
        const lastReset = new Date(currentProfile.lastUsageReset);
        const now = new Date();

        // If it's a new day, reset count
        if (now.toDateString() !== lastReset.toDateString()) {
            const profileRef = doc(db, 'users', currentProfile.uid);
            await updateDoc(profileRef, {
                dailyUsageCount: 0,
                lastUsageReset: now.toISOString()
            });
        }
    };

    const incrementUsage = async (): Promise<boolean> => {
        if (!profile || !user) return false;

        // Check limit
        if (profile.dailyUsageCount >= 20) return false;

        const profileRef = doc(db, 'users', profile.uid);
        await updateDoc(profileRef, {
            dailyUsageCount: profile.dailyUsageCount + 1
        });
        return true;
    };


    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            loginWithGoogle,
            logout,
            incrementUsage
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
