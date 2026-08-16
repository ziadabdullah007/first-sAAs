import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {
  MEMBERS, SUBSCRIPTIONS, PAYMENTS, ATTENDANCE, ATTENDANCE_TREND, REVENUE_TREND, type AuthUser,
} from "../data/fixtures";
import { statusBadge } from "../components/ui/Badge";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { IconMembers, IconAttendance, IconSubscriptions, IconPayments, IconWarning, IconPlus } from "../components/ui/Icons";

interface Props { user: AuthUser }

function KPI({ label, value, sub, icon, alert }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode; alert?: boolean }) {
  return (
    <div className="bg-white border border-[#e5e3e0] rounded-lg px-4 py-3.5 flex gap-3">
      {icon && (
        <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${alert ? "bg-amber-50 text-amber-600" : "bg-[#eff6ff] text-[#1d4ed8]"}`}>
          {icon}
        </div>
      )}
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wide text-[#9b9895] mb-1.5">{label}</div>
        <div className={`text-2xl font-bold leading-none tabular-nums ${alert ? "text-amber-700" : "text-[#111110]"}`}>{value}</div>
        {sub && <div className={`text-[11px] mt-1.5 ${alert ? "text-amber-600" : "text-[#9b9895]"}`}>{sub}</div>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#e5e3e0] rounded-lg px-3 py-2 shadow-sm">
      <div className="text-[11px] text-[#9b9895] mb-1">{label}</div>
      <div className="text-[13px] font-semibold text-[#111110]">{payload[0].value}</div>
    </div>
  );
};

export default function DashboardPage({ user }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const today = "2025-08-15";

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <div className="p-6"><DashboardSkeleton /></div>;
  }

  const activeMembers = MEMBERS.filter((m) => m.status === "active").length;
  const todayAttendance = ATTENDANCE.filter((a) => a.date === today).length;
  const currentlyIn = ATTENDANCE.filter((a) => a.date === today && !a.checkOut).length;

  const expiringSoon = SUBSCRIPTIONS.filter((s) => {
    if (s.status !== "active") return false;
    const days = Math.ceil((new Date(s.endDate).getTime() - new Date(today).getTime()) / 86400000);
    return days >= 0 && days <= 7;
  });

  const recentPayments = [...PAYMENTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const recentVisits = [...ATTENDANCE].sort((a, b) => b.date.localeCompare(a.date) || b.checkIn.localeCompare(a.checkIn)).slice(0, 6);

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">{user.gym ?? "Dashboard"}</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">Friday, August 15, 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => navigate("/members")}>
            <IconPlus size={13} /> Add Member
          </Button>
          <Button size="sm" onClick={() => navigate("/attendance")}>
            <IconAttendance size={13} /> Check In
          </Button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KPI
          label="Total Members"
          value={MEMBERS.length}
          sub={`${activeMembers} active · ${MEMBERS.length - activeMembers} inactive`}
          icon={<IconMembers size={15} />}
        />
        <KPI
          label="Today's Check-ins"
          value={todayAttendance}
          sub={`${currentlyIn} currently in gym`}
          icon={<IconAttendance size={15} />}
        />
        <KPI
          label="Expiring Soon"
          value={expiringSoon.length}
          sub="Memberships within 7 days"
          icon={<IconSubscriptions size={15} />}
          alert={expiringSoon.length > 0}
        />
        <KPI
          label="Aug Revenue"
          value={`EGP 12,450`}
          sub="Month to date · 11 payments"
          icon={<IconPayments size={15} />}
        />
      </div>

      {/* Action alert */}
      {expiringSoon.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          <IconWarning size={14} className="text-amber-600 flex-shrink-0" />
          <p className="text-xs text-amber-800 font-medium flex-1">
            {expiringSoon.length === 1
              ? `${expiringSoon[0].memberName}'s membership expires ${expiringSoon[0].endDate} — renew to avoid access loss.`
              : `${expiringSoon.length} memberships expire within 7 days: ${expiringSoon.map(s => s.memberName).join(", ")}.`
            }
          </p>
          <Button size="sm" variant="secondary" onClick={() => navigate("/subscriptions")}>
            Review Subscriptions
          </Button>
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Attendance chart — 2 cols */}
        <div className="xl:col-span-2 bg-white border border-[#e5e3e0] rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[12px] font-semibold text-[#111110]">Attendance — This Week</div>
              <div className="text-[11px] text-[#9b9895] mt-0.5">Daily check-ins, Aug 9–15</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-[#111110] tabular-nums">372</div>
              <div className="text-[11px] text-[#9b9895]">total this week</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={148}>
            <AreaChart data={ATTENDANCE_TREND} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f5f4f2" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9b9895" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9b9895" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={1.75} fill="url(#grad)" name="Check-ins" dot={false} activeDot={{ r: 4, strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Currently in gym */}
        <div className="bg-white border border-[#e5e3e0] rounded-lg">
          <div className="px-4 py-3 border-b border-[#e5e3e0] flex items-center justify-between">
            <div className="text-[12px] font-semibold text-[#111110]">Currently In Gym</div>
            <span className="text-[11px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md">
              {currentlyIn} active
            </span>
          </div>
          <div className="divide-y divide-[#f5f4f2]">
            {ATTENDANCE.filter(a => a.date === today && !a.checkOut).length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-[#9b9895]">No active visits right now.</div>
            ) : ATTENDANCE.filter(a => a.date === today && !a.checkOut).map(a => {
              const m = MEMBERS.find(mb => mb.id === a.memberId);
              return (
                <div key={a.id} className="flex items-center gap-3 px-4 py-2.5">
                  <Avatar initials={m?.avatarInitials ?? "??"} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[#111110] truncate">{a.memberName}</div>
                    <div className="text-[11px] text-[#9b9895]">Since {a.checkIn}</div>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                </div>
              );
            })}
          </div>
          <div className="px-4 py-2.5 border-t border-[#e5e3e0]">
            <button onClick={() => navigate("/attendance")} className="text-[11px] text-[#1d4ed8] hover:underline">
              View full attendance log →
            </button>
          </div>
        </div>
      </div>

      {/* Revenue + Recent tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="bg-white border border-[#e5e3e0] rounded-lg p-4">
          <div className="text-[12px] font-semibold text-[#111110] mb-0.5">Revenue Trend</div>
          <div className="text-[11px] text-[#9b9895] mb-4">Last 6 months, EGP</div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={REVENUE_TREND} margin={{ top: 0, right: 0, left: -26, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f5f4f2" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ fontSize: 11, border: "1px solid #e5e3e0", borderRadius: 6, background: "white", boxShadow: "none" }}
                formatter={(v: number) => [`EGP ${v.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#1d4ed8" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent payments */}
        <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e3e0] flex items-center justify-between">
            <div className="text-[12px] font-semibold text-[#111110]">Recent Payments</div>
            <button onClick={() => navigate("/payments")} className="text-[11px] text-[#1d4ed8] hover:underline">View all</button>
          </div>
          <div className="divide-y divide-[#f5f4f2]">
            {recentPayments.map(p => (
              <div key={p.id} className="flex items-center px-4 py-2.5 gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-[#111110] truncate">{p.memberName}</div>
                  <div className="text-[11px] text-[#9b9895]">{p.date} · {p.method.replace("_", " ")}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[12px] font-semibold text-[#111110] tabular-nums">EGP {p.amount.toLocaleString()}</div>
                  <div className="mt-0.5">{statusBadge(p.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent check-ins */}
        <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e3e0] flex items-center justify-between">
            <div className="text-[12px] font-semibold text-[#111110]">Recent Activity</div>
            <button onClick={() => navigate("/attendance")} className="text-[11px] text-[#1d4ed8] hover:underline">View all</button>
          </div>
          <div className="divide-y divide-[#f5f4f2]">
            {recentVisits.map(a => {
              const m = MEMBERS.find(mb => mb.id === a.memberId);
              return (
                <div key={a.id} className="flex items-center px-4 py-2.5 gap-2.5">
                  <Avatar initials={m?.avatarInitials ?? "??"} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-medium text-[#111110] truncate">{a.memberName}</div>
                    <div className="text-[11px] text-[#9b9895] font-mono">{a.date} · {a.checkIn}</div>
                  </div>
                  {!a.checkOut && (
                    <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">Active</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Expiring memberships detail */}
      {expiringSoon.length > 0 && (
        <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-[#e5e3e0]">
            <div className="text-[12px] font-semibold text-[#111110]">Expiring Memberships — Next 7 Days</div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[#fafaf9] border-b border-[#e5e3e0]">
                <th className="text-left px-4 py-2">Member</th>
                <th className="text-left px-4 py-2">Plan</th>
                <th className="text-left px-4 py-2">Expires</th>
                <th className="text-left px-4 py-2">Auto-renew</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {expiringSoon.map((s, i) => {
                const days = Math.ceil((new Date(s.endDate).getTime() - new Date(today).getTime()) / 86400000);
                const m = MEMBERS.find(mb => mb.id === s.memberId);
                return (
                  <tr key={s.id} className={`${i < expiringSoon.length - 1 ? "border-b border-[#f5f4f2]" : ""} hover:bg-[#fafaf9]`}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={m?.avatarInitials ?? "??"} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{s.memberName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[#6b6966]">{s.planName}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-medium text-amber-700">{s.endDate}</span>
                      <span className="text-[11px] text-amber-500 ml-1.5">in {days}d</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[#6b6966]">{s.autoRenew ? "Yes" : "No"}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button className="text-[11px] text-[#1d4ed8] hover:underline">Renew</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
