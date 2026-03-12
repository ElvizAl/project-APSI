import type { Metadata } from "next";
import { SignIn } from "@/components/auth/sign-in";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Masuk ke akun Glotomotif Anda untuk mulai jual beli mobil bekas.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return <SignIn />;
}