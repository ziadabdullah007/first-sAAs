// src/pages/SuperDashboardPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { IconGyms, IconMembers, IconPayments, IconWarning } from "../components/ui/Icons";
import { gyms } from "../api/gyms";

function KPI({ label, value, sub, icon, trend, delay }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode; trend?: "up" | "down" | "neutral"; delay?: string }) {
  return (
    <div className="bg-white border border-[#e5e3e0] rounded-xl px-4 py-3.5 flex items-start gap-3 hover:shadow-md hover:shadow-black/[0.03] hover:-translate-y-0.5 transition-all duration-200 animate-slide-up" style={{ animationDelay: delay }}>
      {icon && (
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] flex items-center justify-center flex-shrink-0 text-[#1d4ed8] mt-0.5">
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
  const [gymsList, setGymsList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await gyms.getGyms();
        setGymsList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6"><DashboardSkeleton /></div>;
  }

  const activeGyms = gymsList.filter(g => g.status === "active").length;
  const trialGyms = gymsList.filter(g => g.status === "trial");
  const suspendedGyms = gymsList.filter(g => g.status === "suspended");

  return (
    <div className="p-6 max-w-[1400px] space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[16px] font-bold text-[#111110]">System Overview</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} — All gyms</p>
        </div>
        <Button size="sm" onClick={() => navigate("/gyms")}>
          Manage Gyms
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
          <div className="text-sm text-red-800">{error}</div>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Active Gyms" value={activeGyms} sub={`${gymsList.length} total registered`} icon={<IconGyms size={15} />} delay="0.05s" />
        <KPI label="Total Gyms" value={gymsList.length} sub="Across platform" icon={<IconMembers size={15} />} trend="up" delay="0.1s" />
        <KPI label="Platform Revenue" value="—" sub="Connect analytics" icon={<IconPayments size={15} />} delay="0.15s" />
        <KPI label="SaaS MRR" value="—" sub="Connect billing" trend="up" delay="0.2s" />
      </div>

      {/* Alerts */}
      {(trialGyms.length > 0 || suspendedGyms.length > 0) && (
        <div className="space-y-2">
          {trialGyms.map(g => (
            <div key={g.id} className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
              <IconWarning size={14} className="text-amber-600 flex-shrink-0" />
              <span className="text-xs text-amber-800 font-medium flex-1">
                <strong>{g.name}</strong> is on a trial plan — expires soon.
              </span>
              <Button size="sm" variant="secondary" onClick={() => navigate("/saas-subscriptions")}>Review</Button>
            </div>
          ))}
          {suspendedGyms.map(g => (
            <div key={g.id} className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <IconWarning size={14} className="text-red-600 flex-shrink-0" />
              <span className="text-xs text-red-800 font-medium flex-1">
                <strong>{g.name}</strong> is suspended — access disabled.
              </span>
              <Button size="sm" variant="secondary" onClick={() => navigate("/gyms")}>Manage</Button>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 bg-white border border-[#e5e3e0] rounded-xl p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="text-[13px] font-semibold text-[#111110] mb-0.5">Revenue by Gym</div>
          <div className="text-[11px] text-[#9b9895] mb-4">Monthly, EGP</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={REVENUE_BY_GYM} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e5e3e0", borderRadius: 8, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }} formatter={(v: any) => [`EGP ${Number(v).toLocaleString()}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#1d4ed8" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 bg-white border border-[#e5e3e0] rounded-xl p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-[13px] font-semibold text-[#111110] mb-0.5">Platform Growth — Members</div>
          <div className="text-[11px] text-[#9b9895] mb-4">Total members, last 6 months</div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={MONTHLY_TREND} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f0efed" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9b9895" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9b9895" }} axisLine={false} tickLine={false} domain={[600, 900]} />
              <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e5e3e0", borderRadius: 8, background: "white" }} />
              <Bar dataKey="members" fill="#1d4ed8" radius={[4, 4, 0, 0]} name="Members" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gyms table */}
      <div className="bg-white border border-[#e5e3e0] rounded-xl overflow-hidden animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <div className="px-4 py-3 border-b border-[#e5e3e0] flex items-center justify-between">
          <div className="text-[13px] font-semibold text-[#111110]">All Gyms</div>
          <button onClick={() => navigate("/gyms")} className="text-[11px] text-[#1d4ed8] hover:underline">View all</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
              <th className="text-left px-4 py-2.5">Gym</th>
              <th className="text-left px-4 py-2.5">Email</th>
              <th className="text-left px-4 py-2.5">Status</th>
              <th className="text-left px-4 py-2.5">Address</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {gymsList.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-sm text-[#9b9895]">No gyms found</td>
              </tr>
            ) : gymsList.map((g, i) => (
              <tr key={g.id} className={`hover:bg-[#fafaf9] transition-colors ${i < gymsList.length - 1 ? "border-b border-[#f0efed]" : ""}`}>
                <td className="px-4 py-2.5">
                  <div className="text-[13px] font-medium text-[#111110]">{g.name}</div>
                  <div className="text-[11px] text-[#9b9895]">{g.owner_name}</div>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{g.email}</td>
                <td className="px-4 py-2.5">{statusBadge(g.status)}</td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{g.address ?? '—'}</td>
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
