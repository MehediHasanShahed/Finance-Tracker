import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
    console.log("sendEmail called:", { to, subject, hasReact: !!react });
    console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const data = await resend.emails.send({
            from: 'Finance Tracker <onboarding@resend.dev>',
            to,
            subject,
            react,
        });

        console.log("Email sent successfully:", data);
        return { success: true, data }
    } catch (error) {
        console.error('Failed to send email:', error);
        return { success: false, error: error.message || String(error) }
    }
}