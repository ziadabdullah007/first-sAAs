import { useState } from "react";
import { DEMO_USERS, type AuthUser } from "../../data/fixtures";
import Button from "../../components/ui/Button";

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

const roleColors: Record<string, string> = {
  super_admin: "text-red-400",
  gym_admin: "text-blue-400",
  staff: "text-emerald-400",
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  gym_admin: "Gym Admin",
  staff: "Staff",
};

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Email address is required."); return; }
    if (!password) { setError("Password is required."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const user = DEMO_USERS.find(u => u.email === email);
    if (!user || password !== "password") {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#f6f5f3" }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col w-[440px] xl:w-[480px] flex-shrink-0" style={{ background: "#0d1526" }}>
        <div className="flex items-center gap-3 px-8 py-5 border-b border-[#1b2d47]">
          <div className="w-7 h-7 bg-[#1d4ed8] rounded-md flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M4.5 4.5L2 8l2.5 3.5M11.5 4.5L14 8l-2.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[15px] font-semibold text-white tracking-tight">GymOS</span>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 pb-12">
          <div className="mb-8">
            <h2 className="text-[22px] font-bold text-white leading-snug mb-3">
              Complete gym operations in one place.
            </h2>
            <p className="text-[13px] text-[#6b7fa3] leading-relaxed">
              Members, attendance, subscriptions, payments, and staff — all managed through a single platform built for daily gym operations.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { title: "Reception-optimized check-in", desc: "Check in members in under 3 seconds with fast member search." },
              { title: "Expiry alerts & subscription tracking", desc: "Know exactly which memberships are expiring and when." },
              { title: "Payment & revenue reporting", desc: "Track collected payments, pending balances, and monthly revenue." },
              { title: "Role-based access control", desc: "Super admin, gym admin, and staff — each sees only what they need." },
            ].map(item => (
              <div key={item.title} className="flex gap-3">
                <div className="w-1 h-1 rounded-full bg-[#1d4ed8] mt-2 flex-shrink-0" />
                <div>
                  <div className="text-[12px] font-semibold text-[#c8d6f0]">{item.title}</div>
                  <div className="text-[11px] text-[#5a7499] mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demo credentials */}
        <div className="px-10 py-5 border-t border-[#1b2d47]">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#2d4a6b] mb-2">Demo Accounts</div>
          <div className="space-y-1.5">
            {DEMO_USERS.map(u => (
              <button
                key={u.email}
                onClick={() => { setEmail(u.email); setPassword("password"); setError(""); }}
                className="w-full flex items-center gap-3 px-2.5 py-1.5 rounded-md hover:bg-[#1a2843] transition-colors group text-left"
              >
                <div className="w-5 h-5 rounded bg-[#1a2843] group-hover:bg-[#243350] flex items-center justify-center text-[10px] font-bold text-[#5a7499]">
                  {u.avatarInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-mono text-[#5a7aaa] group-hover:text-[#7a9ac0] truncate">{u.email}</div>
                </div>
                <span className={`text-[10px] font-semibold ${roleColors[u.role]}`}>{roleLabels[u.role]}</span>
              </button>
            ))}
          </div>
          <div className="text-[10px] text-[#2d4a6b] mt-2">Password: <span className="font-mono text-[#3d6090]">password</span></div>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[360px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 bg-[#1d4ed8] rounded-md flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M4.5 4.5L2 8l2.5 3.5M11.5 4.5L14 8l-2.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-[#111110]">GymOS</span>
          </div>

          <div className="mb-7">
            <h1 className="text-[18px] font-bold text-[#111110] mb-1">Sign in to your account</h1>
            <p className="text-[12px] text-[#9b9895]">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-[#111110] mb-1.5">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                className="w-full h-9 text-sm border border-[#e5e3e0] rounded-md px-3 bg-white text-[#111110] placeholder:text-[#c9c7c3] outline-none focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-[#111110]">
                  Password <span className="text-red-500">*</span>
                </label>
                <button type="button" className="text-[11px] text-[#1d4ed8] hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  className="w-full h-9 text-sm border border-[#e5e3e0] rounded-md px-3 pr-9 bg-white text-[#111110] placeholder:text-[#c9c7c3] outline-none focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-2.5 inset-y-0 flex items-center text-[#9b9895] hover:text-[#6b6966]"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    {showPw
                      ? <><path d="M1.5 7S3.8 3.5 7 3.5 12.5 7 12.5 7 10.2 10.5 7 10.5 1.5 7 1.5 7z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>
                      : <><path d="M1.5 7S3.8 3.5 7 3.5 12.5 7 12.5 7 10.2 10.5 7 10.5 1.5 7 1.5 7z" stroke="currentColor" strokeWidth="1.2"/><circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2"/></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M7 4.5V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="7" cy="9.5" r="0.75" fill="currentColor"/>
                </svg>
                <p className="text-[12px] text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full justify-center" size="lg">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Mobile demo accounts */}
          <div className="lg:hidden mt-6 p-3.5 bg-white border border-[#e5e3e0] rounded-lg">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#9b9895] mb-2">Demo Accounts</div>
            <div className="space-y-1">
              {DEMO_USERS.map(u => (
                <button key={u.email} onClick={() => { setEmail(u.email); setPassword("password"); }}
                  className="w-full flex items-center justify-between py-1 text-left group"
                >
                  <span className="text-[11px] font-mono text-[#1d4ed8] group-hover:underline">{u.email}</span>
                  <span className="text-[10px] text-[#9b9895]">{roleLabels[u.role]}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-[#c9c7c3]">
            GymOS &copy; 2025 — All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
