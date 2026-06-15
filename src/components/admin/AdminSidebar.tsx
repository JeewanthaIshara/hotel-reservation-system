"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BedDouble, 
  Sliders, 
  CalendarCheck, 
  Users, 
  Building,
  Banknote
} from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Manage Rooms", icon: BedDouble },
  { href: "/admin/room-types", label: "Room Types", icon: Sliders },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/payments", label: "Financial Ledger", icon: Banknote }, // 🟢 Added Financial Link
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r h-full shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b gap-2">
        <Building className="h-5 w-5 text-primary" />
        <span className="font-bold tracking-tight text-lg">AuraStay Admin</span>
      </div>

      {/* Navigation Map */}
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "" : "text-muted-foreground/70 group-hover:text-foreground")} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}