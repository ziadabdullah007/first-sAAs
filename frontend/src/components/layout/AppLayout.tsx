import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { type AuthUser } from "../../types";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/super-dashboard": "Dashboard",
  "/members": "Members",
  "/attendance": "Attendance",
  "/subscriptions": "Subscriptions",
  "/plans": "Membership Plans",
  "/payments": "Payments",
  "/measurements": "Body Measurements",
  "/gym-profile": "Gym Profile",
  "/staff": "Staff",
  "/gyms": "Gyms",
  "/users": "Users",
  "/saas-subscriptions": "SaaS Subscriptions",
  "/settings": "Settings",
};

interface AppLayoutProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function AppLayout({ user, onLogout }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title = Object.entries(TITLES).find(([path]) =>
    location.pathname === path || location.pathname.startsWith(path + "/")
  )?.[1] ?? "";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f7f6f5]">
      <Sidebar
        role={user.role}
        gymName={user.gym_id ? undefined : undefined}
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          user={user}
          onLogout={onLogout}
          title={title}
          onMobileMenuToggle={() => setMobileOpen((v) => !v)}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
