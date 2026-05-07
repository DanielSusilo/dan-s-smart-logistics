import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  Anchor,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { BrandLogo } from "./BrandLogo";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotificationBell } from "./NotificationBell";

const adminNav = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Manage Shipments", url: "/admin/shipments", icon: Package },
  { title: "User Registry", url: "/admin/registry", icon: Users },
];

const customsNav = [
  { title: "Pending Verifications", url: "/customs", icon: ShieldCheck, end: true },
  { title: "Cleared Goods", url: "/customs/cleared", icon: CheckCircle2 },
];

export function DashboardLayout({
  children,
  variant,
  title,
  subtitle,
}: {
  children: ReactNode;
  variant: "admin" | "customs";
  title: string;
  subtitle?: string;
}) {
  const items = variant === "admin" ? adminNav : customsNav;
  const { address, disconnect } = useWallet();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-subtle">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
            <BrandLogo />
          </SidebarHeader>
          <SidebarContent className="px-2 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="font-mono text-[10px] uppercase tracking-widest">
                {variant === "admin" ? "Operations" : "Customs"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={item.end}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-smooth",
                              isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                                : "text-sidebar-foreground hover:bg-sidebar-accent",
                            )
                          }
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div className="rounded-lg bg-sidebar-accent p-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-primary">
                  <Anchor className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-mono text-[11px] text-sidebar-foreground/90">
                    {address}
                  </div>
                  <div className="text-[10px] text-sidebar-foreground/60">
                    {variant === "admin" ? "Admin" : "Bea Cukai"}
                  </div>
                </div>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <h1 className="font-display text-base font-semibold text-foreground sm:text-lg">
                  {title}
                </h1>
                {subtitle && (
                  <p className="hidden text-xs text-muted-foreground sm:block">{subtitle}</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                disconnect();
                navigate("/");
              }}
              className="gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Disconnect</span>
            </Button>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}