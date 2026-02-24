import { readFileSync } from 'fs';
import { resolve } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
// Load env vars manually
try {
    const envPath = resolve(import.meta.dirname, '../.env.local');
    const envFile = readFileSync(envPath, 'utf8');
    envFile.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const match = trimmed.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^["'](.*)["']$/, '$1');
            process.env[key] = value;
        }
    });
    console.log("📍 Keys found in .env.local: ", Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_FIREBASE')));
} catch (e) {
    console.error("⚠️ Failed to load .env.local:", e.message);
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const promptsData = JSON.parse(readFileSync(resolve(import.meta.dirname, 'parsed_prompts.json'), 'utf8'));

async function seed() {
    console.log("🚀 Starting database seeding...");
    try {
        const promptsRef = collection(db, 'prompts');
        for (const prompt of promptsData) {
            console.log(`Adding: ${prompt.title}`);
            await addDoc(promptsRef, prompt);
        }
        console.log("✅ Seeding complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seed();
