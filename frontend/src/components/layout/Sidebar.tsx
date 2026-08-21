import { NavLink } from "react-router-dom";
import { type Role } from "../../types";
import {
  IconDashboard, IconMembers, IconAttendance, IconSubscriptions, IconPlans,
  IconPayments, IconMeasurements, IconGymProfile, IconStaff, IconGyms,
  IconUsers, IconSaaS, IconSettings, IconChevronLeft, IconChevronRight,
} from "../ui/Icons";

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  roles: Role[];
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const NAV: NavSection[] = [
  {
    items: [
      { label: "Dashboard", to: "/dashboard", icon: <IconDashboard />, roles: ["gym_admin", "staff", "owner"] },
      { label: "Dashboard", to: "/super-dashboard", icon: <IconDashboard />, roles: ["super_admin"] },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Members", to: "/members", icon: <IconMembers />, roles: ["gym_admin", "staff", "owner"] },
      { label: "Attendance", to: "/attendance", icon: <IconAttendance />, roles: ["gym_admin", "staff", "owner"] },
      { label: "Subscriptions", to: "/subscriptions", icon: <IconSubscriptions />, roles: ["gym_admin", "staff", "owner"] },
      { label: "Plans", to: "/plans", icon: <IconPlans />, roles: ["gym_admin", "owner"] },
      { label: "Payments", to: "/payments", icon: <IconPayments />, roles: ["gym_admin", "staff", "owner"] },
      { label: "Body Measurements", to: "/measurements", icon: <IconMeasurements />, roles: ["gym_admin", "staff", "owner"] },
    ],
  },
  {
    title: "Gym",
    items: [
      { label: "Gym Profile", to: "/gym-profile", icon: <IconGymProfile />, roles: ["gym_admin", "owner"] },
      { label: "Staff", to: "/staff", icon: <IconStaff />, roles: ["gym_admin", "owner"] },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Gyms", to: "/gyms", icon: <IconGyms />, roles: ["super_admin"] },
      { label: "Users", to: "/users", icon: <IconUsers />, roles: ["super_admin"] },
      { label: "SaaS Subscriptions", to: "/saas-subscriptions", icon: <IconSaaS />, roles: ["super_admin"] },
      { label: "Settings", to: "/settings", icon: <IconSettings />, roles: ["gym_admin", "super_admin", "owner"] },
    ],
  },
];

interface SidebarProps {
  role: Role;
  gymName?: string;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function NavItems({ role, collapsed }: { role: Role; collapsed: boolean }) {
  return (
    <nav className="flex-1 overflow-y-auto py-2 overflow-x-hidden">
      {NAV.map((section, si) => {
        const visible = section.items.filter((i) => i.roles.includes(role));
        if (!visible.length) return null;
        return (
          <div key={si} className="mb-1">
            {!collapsed && section.title && (
              <div className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[#3d4f6b] select-none">
                {section.title}
              </div>
            )}
            {collapsed && section.title && <div className="mt-3 mb-1 border-t border-[#1e2d45]" />}
            {visible.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group flex items-center gap-3 mx-2 px-2.5 py-2 rounded-md text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-white shadow-md shadow-blue-500/15"
                      : "text-[#8fa3c0] hover:bg-[#1a2843] hover:text-[#d4e0f0]"
                  }`
                }
              >
                <span className="flex-shrink-0 opacity-90">{item.icon}</span>
                {!collapsed && (
                  <span className="truncate leading-none">{item.label}</span>
                )}
              </NavLink>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

export default function Sidebar({ role, gymName, collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          flex flex-col h-full flex-shrink-0 transition-all duration-200 select-none z-40
          fixed lg:relative lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          width: collapsed ? 52 : 220,
          background: "linear-gradient(180deg, #0d1628 0%, #0f1a2e 100%)",
          borderRight: "1px solid #1b2d47",
        }}
      >
        {/* Logo / Branding */}
        <div
          className="flex items-center h-12 flex-shrink-0 border-b"
          style={{ borderColor: "#1b2d47", padding: collapsed ? "0 14px" : "0 12px" }}
        >
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="w-[26px] h-[26px] bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] rounded-md flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-500/20">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M4.5 4.5L2 7l2.5 2.5M9.5 4.5L12 7l-2.5 2.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-[13px] font-bold text-white leading-tight">GymOS</div>
                {gymName && (
                  <div className="text-[10px] text-[#4d6a91] leading-tight truncate max-w-[130px]">{gymName}</div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="flex-shrink-0 ml-auto w-6 h-6 flex items-center justify-center rounded text-[#4d6a91] hover:text-[#8fa3c0] hover:bg-[#1a2843] transition-colors"
          >
            {collapsed ? <IconChevronRight size={12} /> : <IconChevronLeft size={12} />}
          </button>
        </div>

        <NavItems role={role} collapsed={collapsed} />

        {/* Bottom user hint when collapsed */}
        {collapsed && (
          <div className="py-3 border-t border-[#1b2d47] flex justify-center">
            <div className="w-7 h-7 rounded-full bg-[#1a2843] flex items-center justify-center">
              <IconUsers size={13} className="text-[#4d6a91]" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
