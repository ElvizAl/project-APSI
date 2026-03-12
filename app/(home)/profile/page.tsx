import { Suspense } from "react";
import { ProfileForm } from "@/components/profile/profile-form";
import { GantiPasswordForm } from "@/components/profile/ganti-password-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Star, Ticket, CarFront, Clock } from "lucide-react";

export const metadata = {
  title: "Profil Saya | Glotomotif",
  description: "Edit profil pengguna Glotomotif Anda",
};

async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/sign-in");
  }

  const { user } = session;
  const initials = user.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Akun Saya</h1>
          <p className="text-zinc-500 mt-1 text-sm">Kelola informasi pribadi dan alamat pengiriman Anda</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Profile Card */}
          <div className="space-y-4">

            {/* User Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
              <div className="h-24 bg-gradient-to-br from-violet-600 to-primary" />
              <div className="px-6 pb-6 -mt-12">
                <Avatar className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary/20">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                  <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3">
                  <p className="font-bold text-zinc-900 text-lg leading-tight">{user.name || "Pengguna"}</p>
                  <p className="text-zinc-500 text-sm mt-0.5">{user.email}</p>
                  <Badge className="mt-2 rounded-full text-xs bg-primary/10 text-primary hover:bg-primary/10 border-none">
                    {user.role === "admin" ? "Administrator" : "Member"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Aktivitas</p>
              <div className="space-y-3">
                {[
                  { icon: CarFront, label: "Mobil Dibeli", value: "0 Unit" },
                  { icon: Star, label: "Wishlist", value: "0 Mobil" },
                  { icon: Ticket, label: "Promo Dipakai", value: "0 Promo" },
                  { icon: Clock, label: "Bergabung", value: new Date(user.createdAt).toLocaleDateString("id-ID", { month: "long", year: "numeric" }) },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-zinc-100 rounded-lg">
                        <Icon className="h-3.5 w-3.5 text-zinc-500" />
                      </div>
                      <span className="text-sm text-zinc-600">{label}</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 bg-green-50 rounded-2xl p-4 border border-green-100">
              <div className="p-2 bg-green-100 rounded-xl">
                <ShieldCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Akun Terverifikasi</p>
                <p className="text-xs text-green-600">Email sudah terkonfirmasi</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Edit Form + Ganti Password */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profil Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-900">Edit Profil</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Lengkapi data Anda agar proses pembelian lebih mudah
                </p>
              </div>
              <ProfileForm />
            </div>

            {/* Ganti Password Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 sm:p-8">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-zinc-900">Keamanan Akun</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Perbarui password untuk menjaga keamanan akun Anda
                </p>
              </div>
              <GantiPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<ProfileLoadingSkeleton />}>
      <ProfilePage />
    </Suspense>
  );
}
