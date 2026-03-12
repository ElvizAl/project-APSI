import { Suspense } from "react";
import VerifyOtpClient from "@/components/auth/verify-otp-client";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyOtpClient />
    </Suspense>
  );
}
