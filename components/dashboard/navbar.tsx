"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/auth/logout-button";
import { usePathname } from "next/navigation";

const pathTitles: Record<string, string> = {
  "/dashboard": "Dasbor",
  "/dashboard/users": "Manajemen Pengguna",
  "/dashboard/contacts": "Kontak",
  "/dashboard/companies": "Perusahaan",
  "/dashboard/deals": "Kesepakatan",
  "/dashboard/tasks": "Tugas",
  "/dashboard/products": "Produk",
  "/dashboard/emails": "Email",
  "/dashboard/integrations": "Integrasi",
  "/dashboard/settings": "Pengaturan",
};

export function DashboardNavbar() {
  const pathname = usePathname();
  const pageTitle = pathTitles[pathname] || "Dasbor";
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-xl font-semibold capitalize">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <LogoutButton variant="outline" size="sm" />
      </div>
    </header>
  );
}
