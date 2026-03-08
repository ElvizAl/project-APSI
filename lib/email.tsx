import { OTPTemplate } from "@/components/email/otp-template";
import { resend } from "@/lib/resend";

export async function sendVerificationEmail(email: string, otp: string) {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Verifikasi kode OTP kamu",
      react: <OTPTemplate otp={otp} />,
    });

    return data;
}