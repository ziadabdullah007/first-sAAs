import { useState, useEffect } from "react";
import { GYMS } from "../data/fixtures";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import EmptyState from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { IconSearch, IconPlus, IconGyms, IconMembers } from "../components/ui/Icons";

export default function GymsPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "trial" | "suspended">("");

  useEffect(() => { const t = setTimeout(() => setLoading(false), 750); return () => clearTimeout(t); }, []);

  const filtered = GYMS.filter(g => {
    const q = search.toLowerCase();
    return (!q || g.name.toLowerCase().includes(q) || g.owner.toLowerCase().includes(q) || g.city.toLowerCase().includes(q))
      && (!statusFilter || g.status === statusFilter);
  });

  return (
    <div className="p-6 max-w-[1400px] space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Gyms</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[#9b9895]">{GYMS.length} registered</span>
            <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{GYMS.filter(g => g.status === "active").length} active</span>
            <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">{GYMS.filter(g => g.status === "trial").length} trial</span>
          </div>
        </div>
        <Button><IconPlus size={13} /> Create Gym</Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Gyms", value: GYMS.length, icon: <IconGyms size={15} /> },
          { label: "Active", value: GYMS.filter(g => g.status === "active").length, icon: null },
          { label: "Trial", value: GYMS.filter(g => g.status === "trial").length, icon: null },
          { label: "Total Members", value: GYMS.reduce((s, g) => s + g.memberCount, 0).toLocaleString(), icon: <IconMembers size={15} /> },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-[#e5e3e0] rounded-lg px-4 py-3 flex items-center gap-3">
            {stat.icon && <div className="text-[#1d4ed8] opacity-70">{stat.icon}</div>}
            <div>
              <div className="text-[11px] text-[#9b9895]">{stat.label}</div>
              <div className="text-lg font-bold text-[#111110] tabular-nums">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-60">
          <Input placeholder="Search gyms..." value={search} onChange={e => setSearch(e.target.value)} leftIcon={<IconSearch size={13} />} />
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-[#f0efed] rounded-md">
          {([["", "All"], ["active", "Active"], ["trial", "Trial"], ["suspended", "Suspended"]] as ["" | "active" | "trial" | "suspended", string][]).map(([v, l]) => (
            <button key={v} onClick={() => setStatusFilter(v)}
              className={`px-3 py-1 rounded text-[12px] font-medium transition-all ${statusFilter === v ? "bg-white shadow-sm text-[#111110]" : "text-[#6b6966] hover:text-[#111110]"}`}
            >{l}</button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
        {loading ? <TableSkeleton rows={6} cols={7} /> : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5">Gym</th>
                <th className="text-left px-4 py-2.5">Owner / Admin</th>
                <th className="text-left px-4 py-2.5">Phone</th>
                <th className="text-left px-4 py-2.5">City</th>
                <th className="text-left px-4 py-2.5">Members</th>
                <th className="text-left px-4 py-2.5">SaaS Plan</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="text-left px-4 py-2.5">Created</th>
                <th className="px-4 py-2.5 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {filtered.length === 0 ? (
                <tr><td colSpan={9}><EmptyState title="No gyms found" description="No gyms match your current search." /></td></tr>
              ) : filtered.map(g => (
                <tr key={g.id} className="hover:bg-[#fafaf9] transition-colors cursor-pointer">
                  <td className="px-4 py-2.5">
                    <div className="text-[13px] font-semibold text-[#111110]">{g.name}</div>
                    <div className="text-[11px] text-[#9b9895]">{g.email}</div>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{g.owner}</td>
                  <td className="px-4 py-2.5 text-[12px] font-mono text-[#6b6966]">{g.phone}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{g.city}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-[13px] font-semibold text-[#111110] tabular-nums">{g.memberCount}</span>
                  </td>
                  <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{g.subscription}</td>
                  <td className="px-4 py-2.5">{statusBadge(g.status)}</td>
                  <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{g.createdAt}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-2">
                      <button className="text-[11px] text-[#1d4ed8] hover:underline" onClick={e => e.stopPropagation()}>View</button>
                      <button className="text-[11px] text-[#6b6966] hover:underline" onClick={e => e.stopPropagation()}>Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
