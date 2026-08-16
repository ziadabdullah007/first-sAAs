import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { GYMS, MEMBERS, SUBSCRIPTIONS, PAYMENTS } from "../data/fixtures";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { IconGyms, IconMembers, IconPayments, IconWarning } from "../components/ui/Icons";

function KPI({ label, value, sub, icon, trend }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode; trend?: "up" | "down" | "neutral" }) {
  return (
    <div className="bg-white border border-[#e5e3e0] rounded-lg px-4 py-3.5 flex items-start gap-3">
      {icon && (
        <div className="w-8 h-8 rounded-md bg-[#eff6ff] flex items-center justify-center flex-shrink-0 text-[#1d4ed8] mt-0.5">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-[#9b9895] font-medium uppercase tracking-wide mb-1.5">{label}</div>
        <div className="text-2xl font-bold text-[#111110] leading-none tabular-nums">{value}</div>
        {sub && (
          <div className={`text-[11px] mt-1.5 ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-[#9b9895]"}`}>
            {trend === "up" && "▲ "}
            {trend === "down" && "▼ "}
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

const REVENUE_BY_GYM = [
  { name: "Elite Fitness", revenue: 27800 },
  { name: "Fitness Club", revenue: 18200 },
  { name: "Iron Temple", revenue: 15400 },
  { name: "Maximus", revenue: 11200 },
  { name: "Pharaoh", revenue: 2100 },
];

const MONTHLY_TREND = [
  { month: "Mar", gyms: 4, members: 678 },
  { month: "Apr", gyms: 4, members: 702 },
  { month: "May", gyms: 5, members: 731 },
  { month: "Jun", gyms: 5, members: 756 },
  { month: "Jul", gyms: 6, members: 789 },
  { month: "Aug", gyms: 6, members: 812 },
];

export default function SuperDashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return <div className="p-6"><DashboardSkeleton /></div>;
  }

  const activeGyms = GYMS.filter(g => g.status === "active").length;
  const totalMembers = GYMS.reduce((s, g) => s + g.memberCount, 0);
  const totalRevenue = PAYMENTS.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const trialGyms = GYMS.filter(g => g.status === "trial");
  const suspendedGyms = GYMS.filter(g => g.status === "suspended");

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">System Overview</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">Friday, August 15, 2025 — All gyms</p>
        </div>
        <Button size="sm" onClick={() => navigate("/gyms")}>
          Manage Gyms
        </Button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Active Gyms" value={activeGyms} sub={`${GYMS.length} total registered`} icon={<IconGyms size={15} />} />
        <KPI label="Total Members" value={totalMembers.toLocaleString()} sub="Across all gyms" icon={<IconMembers size={15} />} trend="up" />
        <KPI label="Platform Revenue" value={`EGP ${totalRevenue.toLocaleString()}`} sub="All collected payments" icon={<IconPayments size={15} />} />
        <KPI label="SaaS MRR" value="EGP 5,893" sub="3× Professional, 3× Starter" trend="up" />
      </div>

      {/* Alerts */}
      {(trialGyms.length > 0 || suspendedGyms.length > 0) && (
        <div className="space-y-2">
          {trialGyms.map(g => (
            <div key={g.id} className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
              <IconWarning size={14} className="text-amber-600 flex-shrink-0" />
              <span className="text-xs text-amber-800 font-medium flex-1">
                <strong>{g.name}</strong> is on a trial plan — expires soon. Convert to paid or suspend.
              </span>
              <Button size="sm" variant="secondary" onClick={() => navigate("/saas-subscriptions")}>Review</Button>
            </div>
          ))}
          {suspendedGyms.map(g => (
            <div key={g.id} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              <IconWarning size={14} className="text-red-600 flex-shrink-0" />
              <span className="text-xs text-red-800 font-medium flex-1">
                <strong>{g.name}</strong> is suspended — access disabled for all users.
              </span>
              <Button size="sm" variant="secondary" onClick={() => navigate("/gyms")}>Manage</Button>
            </div>
          ))}
        </div>
      )}

      {/* Charts + Gym table */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Revenue by gym */}
        <div className="lg:col-span-2 bg-white border border-[#e5e3e0] rounded-lg p-4">
          <div className="text-[12px] font-semibold text-[#111110] mb-0.5">Revenue by Gym</div>
          <div className="text-[11px] text-[#9b9895] mb-4">August 2025, EGP</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={REVENUE_BY_GYM} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip
                contentStyle={{ fontSize: 11, border: "1px solid #e5e3e0", borderRadius: 6, background: "white", boxShadow: "none" }}
                formatter={(v: number) => [`EGP ${v.toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#1d4ed8" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform growth */}
        <div className="lg:col-span-3 bg-white border border-[#e5e3e0] rounded-lg p-4">
          <div className="text-[12px] font-semibold text-[#111110] mb-0.5">Platform Growth — Members</div>
          <div className="text-[11px] text-[#9b9895] mb-4">Total members across all active gyms, last 6 months</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={MONTHLY_TREND} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f0efed" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9b9895" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9b9895" }} axisLine={false} tickLine={false} domain={[600, 900]} />
              <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e5e3e0", borderRadius: 6, background: "white" }} />
              <Bar dataKey="members" fill="#1d4ed8" radius={[2, 2, 0, 0]} name="Members" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All gyms overview */}
      <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-[#e5e3e0] flex items-center justify-between">
          <div className="text-[12px] font-semibold text-[#111110]">All Gyms</div>
          <button onClick={() => navigate("/gyms")} className="text-[11px] text-[#1d4ed8] hover:underline">View all</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
              <th className="text-left px-4 py-2.5">Gym</th>
              <th className="text-left px-4 py-2.5">Plan</th>
              <th className="text-left px-4 py-2.5">Members</th>
              <th className="text-left px-4 py-2.5">Status</th>
              <th className="text-left px-4 py-2.5">City</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {GYMS.map((g, i) => (
              <tr key={g.id} className={`hover:bg-[#fafaf9] transition-colors ${i < GYMS.length - 1 ? "border-b border-[#f0efed]" : ""}`}>
                <td className="px-4 py-2.5">
                  <div className="text-[13px] font-medium text-[#111110]">{g.name}</div>
                  <div className="text-[11px] text-[#9b9895]">{g.owner}</div>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{g.subscription}</td>
                <td className="px-4 py-2.5">
                  <span className="text-[13px] font-medium text-[#111110] tabular-nums">{g.memberCount}</span>
                </td>
                <td className="px-4 py-2.5">{statusBadge(g.status)}</td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{g.city}</td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => navigate("/gyms")} className="text-[11px] text-[#1d4ed8] hover:underline">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
