import { useState } from "react";
import Button from "../../components/ui/Button";
import { login as apiLogin } from "../../api/auth";
import { type AuthUser } from "../../types";

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

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

    const { data, error: loginError } = await apiLogin({ email, password });

    if (loginError) {
      setError(loginError);
      setLoading(false);
      return;
    }

    if (data?.user) {
      onLogin(data.user as AuthUser);
    } else {
      setError("Login failed — unexpected response.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#f7f6f5" }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col w-[440px] xl:w-[480px] flex-shrink-0 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0a1628 0%, #0f1e3a 50%, #0d1526 100%)" }}>
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #1d4ed8 1px, transparent 1px),
                            radial-gradient(circle at 75% 75%, #1d4ed8 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }} />

        <div className="relative flex items-center gap-3 px-8 py-5 border-b border-[#1b2d47]/60">
          <div className="w-8 h-8 bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M4.5 4.5L2 8l2.5 3.5M11.5 4.5L14 8l-2.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight">GymOS</span>
          <span className="text-[10px] text-[#3d5a85] font-medium bg-[#1a2843] px-2 py-0.5 rounded-full ml-1">v1.0</span>
        </div>

        <div className="relative flex-1 flex flex-col justify-center px-10 pb-12">
          <div className="mb-10">
            <h2 className="text-[24px] font-bold text-white leading-snug mb-4">
              Complete gym operations<br />in one place.
            </h2>
            <p className="text-[13px] text-[#5a7499] leading-relaxed max-w-[340px]">
              Members, attendance, subscriptions, payments, and staff — all managed through a single platform built for daily gym operations.
            </p>
          </div>

          <div className="space-y-5">
            {[
              { title: "Reception-optimized check-in", desc: "Check in members in under 3 seconds with fast member search.", icon: "⚡" },
              { title: "Expiry alerts & subscription tracking", desc: "Know exactly which memberships are expiring and when.", icon: "🔔" },
              { title: "Payment & revenue reporting", desc: "Track collected payments, pending balances, and monthly revenue.", icon: "📊" },
              { title: "Role-based access control", desc: "Super admin, gym admin, and staff — each sees only what they need.", icon: "🔐" },
            ].map(item => (
              <div key={item.title} className="flex gap-3.5 group">
                <div className="w-8 h-8 rounded-lg bg-[#1a2843]/80 border border-[#1b2d47]/50 flex items-center justify-center flex-shrink-0 text-sm group-hover:bg-[#1d4ed8]/10 group-hover:border-[#1d4ed8]/30 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[#c8d6f0]">{item.title}</div>
                  <div className="text-[11px] text-[#4a6a94] mt-0.5 leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative px-10 py-4 border-t border-[#1b2d47]/40">
          <p className="text-[10px] text-[#2d4a6b]">
            Powered by GymOS — Multi-tenant SaaS Platform
          </p>
        </div>
      </div>

      {/* Right: Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[380px] animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8h12M4.5 4.5L2 8l2.5 3.5M11.5 4.5L14 8l-2.5 3.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-bold text-[#111110]">GymOS</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[20px] font-bold text-[#111110] mb-1.5">Sign in to your account</h1>
            <p className="text-[13px] text-[#9b9895]">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
              <label className="block text-[12px] font-semibold text-[#111110] mb-1.5">
                Email address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                className="w-full h-10 text-sm border border-[#e5e3e0] rounded-lg px-3.5 bg-white text-[#111110] placeholder:text-[#c9c7c3] outline-none focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-[#111110]">
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
                  className="w-full h-10 text-sm border border-[#e5e3e0] rounded-lg px-3.5 pr-10 bg-white text-[#111110] placeholder:text-[#c9c7c3] outline-none focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 inset-y-0 flex items-center text-[#9b9895] hover:text-[#6b6966] transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
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
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3.5 py-3 animate-fade-in">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-red-500 flex-shrink-0 mt-0.5">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M7 4.5V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="7" cy="9.5" r="0.75" fill="currentColor"/>
                </svg>
                <p className="text-[12px] text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full justify-center !h-10 !text-[13px]" size="lg">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-[11px] text-[#c9c7c3]">
            GymOS &copy; {new Date().getFullYear()} — All rights reserved
          </p>
        </div>
      </div>
    </div>
  );
}
