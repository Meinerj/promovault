import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  BarChart3,
  Users,
  CreditCard,
  Settings,
} from "lucide-react";

const clientNav = [
  { label: "Dashboard", href: "/client", icon: LayoutDashboard },
  { label: "My Profile", href: "/client/profile", icon: Building2 },
  { label: "Analytics", href: "/client/analytics", icon: BarChart3 },
  { label: "Leads", href: "/client/leads", icon: Users },
  { label: "Subscription", href: "/client/subscription", icon: CreditCard },
  { label: "Settings", href: "/client/settings", icon: Settings },
];

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "BUSINESS_CLIENT") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white border-r">
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/client" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900">
              <span className="text-sm font-bold text-brand-400">M</span>
            </div>
            <span className="text-lg font-bold text-navy-900">
              Mind<span className="text-brand-400">Spark.ai</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {clientNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-navy-900 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-600 text-sm font-bold">
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session.user.name}</p>
              <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b bg-white flex items-center px-6">
          <h1 className="text-lg font-semibold text-navy-900">Business Portal</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
