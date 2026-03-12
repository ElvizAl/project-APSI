import type { Metadata } from "next";
import { SignUp } from "@/components/auth/sign-up";

export const metadata: Metadata = {
  title: "Daftar Akun",
  description: "Buat akun Glotomotif gratis dan mulai cari mobil impian Anda hari ini.",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return <SignUp />;
}