import { Resend } from "resend";
import { render } from "@react-email/render";

export async function sendEmail({ to, subject, react }) {
    console.log("sendEmail called:", { to, subject, hasReact: !!react });
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        // Pre-render the React component to HTML for better production compatibility
        const html = await render(react);

        const data = await resend.emails.send({
            from: 'Finance Tracker <onboarding@resend.dev>',
            to,
            subject,
            html,  // Use pre-rendered HTML instead of react prop
        });

        console.log("Email sent successfully:", data);
        return { success: true, data }
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: error.message || String(error) }
    }
}