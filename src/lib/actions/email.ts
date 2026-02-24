"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminNotificationAction(subject: string, html: string) {
    if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
        console.warn("Email Action: RESEND_API_KEY or ADMIN_EMAIL missing.");
        return { success: false, error: "Missing config" };
    }

    try {
        await resend.emails.send({
            from: 'PromptNexus <onboarding@resend.dev>',
            to: process.env.ADMIN_EMAIL,
            subject,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error("Failed to send admin notification:", error);
        return { success: false, error: String(error) };
    }
}

export async function notifyNewUserSignupAction(userName: string, userEmail: string) {
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2>New User Signup on PromptNexus</h2>
        <p>A new user has signed up and is awaiting approval:</p>
        <ul>
          <li><strong>Name:</strong> ${userName}</li>
          <li><strong>Email:</strong> ${userEmail}</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Admin Panel</a></p>
      </div>
    `;
    return await sendAdminNotificationAction(`New Signup: ${userName}`, html);
}
