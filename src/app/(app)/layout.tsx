import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/features/search/components/command-palette";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col lg:pl-56">
        <Topbar />
        <main className="flex-1 px-4 py-6 pb-20 md:px-6 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
      <CommandPalette />
    </div>
  );
}
