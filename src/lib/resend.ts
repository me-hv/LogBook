import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "re_placeholder_key_for_builds";
export const resend = new Resend(resendApiKey);

// Defaults to Resend sandbox sender if not present
export const emailFrom = process.env.EMAIL_FROM || "LogBook <onboarding@resend.dev>";
