import { useState } from "react";
import { IconBell, IconChevronDown, IconLogOut, IconSettings } from "../ui/Icons";
import Avatar from "../ui/Avatar";
import { type AuthUser } from "../../data/fixtures";

interface HeaderProps {
  user: AuthUser;
  onLogout: () => void;
  title?: string;
  onMobileMenuToggle?: () => void;
}

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  gym_admin: "Gym Admin",
  staff: "Staff",
};

export default function Header({ user, onLogout, title, onMobileMenuToggle }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-white border-b border-[#e5e3e0] flex-shrink-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden w-8 h-8 flex items-center justify-center rounded-md text-[#6b6966] hover:bg-[#f0efed] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {title && (
          <h1 className="text-[13px] font-semibold text-[#111110]">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-1">
        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-md text-[#6b6966] hover:bg-[#f5f4f2] transition-colors">
          <IconBell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#1d4ed8] rounded-full ring-1 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#e5e3e0] mx-1" />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-md hover:bg-[#f5f4f2] transition-colors"
          >
            <Avatar initials={user.avatarInitials} size="sm" />
            <div className="hidden sm:block text-left">
              <div className="text-[12px] font-semibold text-[#111110] leading-tight">{user.name}</div>
              <div className="text-[10px] text-[#9b9895] leading-tight">{roleLabels[user.role]}</div>
            </div>
            <IconChevronDown size={12} className="text-[#9b9895] ml-0.5" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-[#e5e3e0] rounded-lg shadow-lg z-20 overflow-hidden py-1">
                <div className="px-3.5 py-2.5 border-b border-[#f0efed]">
                  <div className="text-[12px] font-semibold text-[#111110]">{user.name}</div>
                  <div className="text-[11px] text-[#9b9895] mt-0.5">{user.email}</div>
                </div>
                <button className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-[#3d3b38] hover:bg-[#f5f4f2] transition-colors">
                  <IconSettings size={13} className="text-[#9b9895]" />
                  Profile Settings
                </button>
                <div className="border-t border-[#f0efed] my-1" />
                <button
                  onClick={() => { setMenuOpen(false); onLogout(); }}
                  className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-[12px] text-red-600 hover:bg-red-50 transition-colors"
                >
                  <IconLogOut size={13} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
