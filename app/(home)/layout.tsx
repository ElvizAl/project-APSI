export const dynamic = "force-dynamic";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-stone-100 font-body antialiased overflow-x-hidden">
        {children}
    </div>
  );
}
