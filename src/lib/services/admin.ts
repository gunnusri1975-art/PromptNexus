import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export const AdminService = {
    // Approve a user
    async approveUser(userId: string) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            approved: true,
            updatedAt: new Date().toISOString()
        });
    },

    // Reject/Delete a user
    async rejectUser(userId: string) {
        const userRef = doc(db, "users", userId);
        await deleteDoc(userRef);
    },

    // Update user role
    async updateUserRole(userId: string, role: 'admin' | 'user') {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            role,
            updatedAt: new Date().toISOString()
        });
    }
};
