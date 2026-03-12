import { HomeNavbar } from "@/components/layout/home-navbar";

export const dynamic = "force-dynamic";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-stone-100 font-body antialiased overflow-x-hidden min-h-screen flex flex-col">
      <HomeNavbar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
