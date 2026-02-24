const { execSync } = require('child_process');
const fs = require('fs');

const envs = {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "AIzaSyB4iFoIyi7aWkNMox-QLMSw_M9XAL1_3w4",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "promptnexus-8ad22.firebaseapp.com",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "promptnexus-8ad22",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "promptnexus-8ad22.firebasestorage.app",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "137129706900",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "1:137129706900:web:e38f0409e325e8d2093b81",
    "NEXT_PUBLIC_GOOGLE_AI_API_KEY": "AIzaSyB7X3idpNyX_i6w_6n3gooZXVTUrBu0Wjo",
    "RESEND_API_KEY": "re_jR9rqEYD_KMzknjkcNDZdEcw31qjN64pH",
    "ADMIN_EMAIL": "aaryan.sri1978@gmail.com"
};

const keys = Object.keys(envs);

for (const key of keys) {
    console.log(`Removing ${key}...`);
    try {
        execSync(`vercel env rm ${key} production preview development -yes`, { stdio: 'ignore' });
    } catch (e) {
        // Ignore errors if it didn't exist
    }
}

for (const key of keys) {
    console.log(`Adding ${key}...`);
    fs.writeFileSync('temp_env.txt', envs[key]);
    try {
        execSync(`vercel env add ${key} production preview development < temp_env.txt`, { stdio: 'inherit' });
    } catch (e) {
        console.error(`Failed to add ${key}`, e.message);
    }
}

console.log('Done!');
fs.unlinkSync('temp_env.txt');
