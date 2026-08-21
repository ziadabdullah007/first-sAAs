// src/pages/DashboardPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Button from "../components/ui/Button";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { IconMembers, IconAttendance, IconSubscriptions, IconPayments, IconPlus } from "../components/ui/Icons";
import { dashboard } from "../api/dashboard";
import { type AuthUser } from "../types";

interface Props { user: AuthUser }

function KPI({ label, value, sub, icon, alert, delay }: { label: string; value: string | number; sub?: string; icon?: React.ReactNode; alert?: boolean; delay?: string }) {
  return (
    <div className="bg-white border border-[#e5e3e0] rounded-xl px-4 py-4 flex gap-3.5 hover:shadow-md hover:shadow-black/[0.03] hover:-translate-y-0.5 transition-all duration-200 animate-slide-up" style={{ animationDelay: delay }}>
      {icon && (
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${alert ? "bg-amber-50 text-amber-600" : "bg-gradient-to-br from-[#eff6ff] to-[#dbeafe] text-[#1d4ed8]"}`}>
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
    <div className="bg-white border border-[#e5e3e0] rounded-lg px-3 py-2 shadow-lg shadow-black/[0.06]">
      <div className="text-[11px] text-[#9b9895] mb-1">{label}</div>
      <div className="text-[13px] font-semibold text-[#111110]">{payload[0].value}</div>
    </div>
  );
};

export default function DashboardPage({ user }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const gymId = user.gym_id;
        if (!gymId) {
          throw new Error('Gym context not found');
        }
        const data = await dashboard.getDashboardStats(gymId);
        setStats(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [user.gym_id]);

  if (loading) {
    return <div className="p-6"><DashboardSkeleton /></div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 animate-fade-in">
          <div className="text-sm text-red-800 mb-2">{error}</div>
          <Button onClick={() => window.location.reload()} size="sm" variant="secondary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-6 text-center text-[#9b9895]">Loading dashboard data...</div>;
  }

  const attendanceTrend = [
    { day: "Mon", count: 48 }, { day: "Tue", count: 55 },
    { day: "Wed", count: 62 }, { day: "Thu", count: 51 },
    { day: "Fri", count: 43 }, { day: "Sat", count: 79 },
    { day: "Sun", count: 34 },
  ];

  const revenueTrend = [
    { month: "Jan", revenue: 8500 }, { month: "Feb", revenue: 9200 },
    { month: "Mar", revenue: 7800 }, { month: "Apr", revenue: 10500 },
    { month: "May", revenue: 9800 }, { month: "Jun", revenue: 12400 },
  ];

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="text-[16px] font-bold text-[#111110]">Dashboard</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
        <KPI label="Total Members" value={stats.total_members} sub="Active members" icon={<IconMembers size={16} />} delay="0.05s" />
        <KPI label="Currently In Gym" value={stats.members_inside_gym ?? 0} sub="Checked in now" icon={<IconAttendance size={16} />} delay="0.1s" />
        <KPI label="Active Plans" value={stats.total_plans} sub="Membership plans" icon={<IconSubscriptions size={16} />} delay="0.15s" />
        <KPI label="Monthly Revenue" value={`EGP ${stats.monthly_revenue?.toLocaleString() ?? '0'}`} sub={`From ${stats.total_payments} payments`} icon={<IconPayments size={16} />} delay="0.2s" />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Attendance chart */}
        <div className="xl:col-span-2 bg-white border border-[#e5e3e0] rounded-xl p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[13px] font-semibold text-[#111110]">Attendance — This Week</div>
              <div className="text-[11px] text-[#9b9895] mt-0.5">Daily check-ins</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-[#111110] tabular-nums">{attendanceTrend.reduce((s, d) => s + d.count, 0)}</div>
              <div className="text-[11px] text-[#9b9895]">total this week</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={attendanceTrend} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#f5f4f2" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9b9895" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9b9895" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="count" stroke="#1d4ed8" strokeWidth={2} fill="url(#grad)" name="Check-ins" dot={false} activeDot={{ r: 4, strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue chart */}
        <div className="bg-white border border-[#e5e3e0] rounded-xl p-5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-[13px] font-semibold text-[#111110] mb-0.5">Revenue Trend</div>
          <div className="text-[11px] text-[#9b9895] mb-4">Last 6 months, EGP</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={revenueTrend} margin={{ top: 0, right: 0, left: -26, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#f5f4f2" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ fontSize: 11, border: "1px solid #e5e3e0", borderRadius: 8, background: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                formatter={(v: any) => [`EGP ${Number(v).toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats */}
        <div className="bg-white border border-[#e5e3e0] rounded-xl p-5 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="text-[13px] font-semibold text-[#111110] mb-4">Gym Overview</div>
          <div className="space-y-3">
            {[
              { label: "Total Members", value: stats.total_members },
              { label: "Active Plans", value: stats.total_plans },
              { label: "Active Subscriptions", value: stats.active_subscriptions ?? 0 },
              { label: "Payments This Month", value: stats.total_payments ?? 0 },
              { label: "Members Inside Gym", value: stats.members_inside_gym ?? 0 },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-1">
                <span className="text-[12px] text-[#6b6966]">{item.label}</span>
                <span className="text-[13px] font-semibold text-[#111110] tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}