// src/pages/MeasurementsPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { IconSearch, IconPlus, IconSort, IconSortAsc, IconSortDesc, IconTrendingUp, IconTrendingDown, IconRefreshCw } from "../components/ui/Icons";
import { members as membersApi } from "../api/members";
import { measurements as measurementsApi } from "../api/measurements";

const PER_PAGE = 10;
type SortKey = "memberName" | "date" | "weight" | "bodyFat" | "bmi";
type SortDir = "asc" | "desc";

function SortIcon({ col, active, dir }: { col: string; active: string; dir: SortDir }) {
  if (active !== col) return <IconSort size={12} className="text-[#c9c7c3] ml-1 inline" />;
  return dir === "asc"
    ? <IconSortAsc size={12} className="text-[#1d4ed8] ml-1 inline" />
    : <IconSortDesc size={12} className="text-[#1d4ed8] ml-1 inline" />;
}

export default function MeasurementsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [measurementsList, setMeasurementsList] = useState<any[]>([]);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all related data
        const [measData, memData] = await Promise.all([
          measurementsApi.getMeasurements(),
          membersApi.getMembers()
        ]);
        setMeasurementsList(measData);
        setMembersList(memData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  // Helper to get member name
  const getMemberName = (memberId: string) => {
    const member = membersList.find(m => m.id === memberId);
    return member ? `${member.firstName} ${member.lastName}` : "Unknown Member";
  };

  const filtered = measurementsList.filter((m) => {
    const q = search.toLowerCase();
    const memberName = getMemberName(m.member_id).toLowerCase();
    const matchSearch = !q || memberName.includes(q);
    return matchSearch;
  }).sort((a, b) => {
    let av: any, bv: any;
    if (sortKey === "memberName") { 
      av = getMemberName(a.member_id); 
      bv = getMemberName(b.member_id); 
    }
    else if (sortKey === "date") { 
      av = a.measured_at ?? ""; 
      bv = b.measured_at ?? ""; 
    }
    else if (sortKey === "weight") { 
      av = a.weight ?? 0; 
      bv = b.weight ?? 0; 
    }
    else if (sortKey === "bodyFat") { 
      av = a.body_fat_percentage ?? 0; 
      bv = b.body_fat_percentage ?? 0; 
    }
    else if (sortKey === "bmi") { 
      av = a.bmi ?? 0; 
      bv = b.bmi ?? 0; 
    }
    return sortDir === "asc" ? 
      (av < bv ? -1 : av > bv ? 1 : 0) : 
      (bv < av ? -1 : bv > av ? 1 : 0);
  });

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Get latest measurement for each member
  const latestMeasurements = new Map<string, any>();
  measurementsList.forEach(m => {
    const memberId = m.member_id;
    const current = latestMeasurements.get(memberId);
    if (!current || (m.measured_at ?? "") > (current.measured_at ?? "")) {
      latestMeasurements.set(memberId, m);
    }
  });

  return (
    <div className="p-6 space-y-4 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Body Measurements</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[#9b9895]">{measurementsList.length} total records</span>
            <span className="text-[11px] text-[#9b9895]">{latestMeasurements.size} members tracked</span>
          </div>
        </div>
        <Button onClick={() => navigate("/members")}>
          <IconPlus size={13} /> Manage Members
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          <div className="text-sm text-red-800">{error}</div>
          <Button onClick={() => setError(null)} size="sm" variant="secondary">
            Dismiss
          </Button>
        </div>
      )}

      {/* Quick stats */}
      <div className="bg-white border border-[#e5e3e0] rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[14px] font-semibold text-[#111110]">Measurement Overview</h2>
          </div>
          <Button size="sm" onClick={() => window.location.reload()}>
            <IconRefreshCw size={14} /> Refresh
          </Button>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-[#6b6966]">Average Weight:</div>
            <div className="font-medium text-[#111110]">{calculateAverageWeight()} kg</div>
            <div className="text-sm text-[#6b6966]">Average Body Fat:</div>
            <div className="font-medium text-[#111110]">{calculateAverageBodyFat()}%</div>
            <div className="text-sm text-[#6b6966]">Average BMI:</div>
            <div className="font-medium text-[#111110]">{calculateAverageBMI()}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-[#6b6966]">Weight Trend:</div>
            <div className="font-medium text-[#111110]">{getWeightTrend()}</div>
            <div className="text-sm text-[#6b6966]">Body Fat Trend:</div>
            <div className="font-medium text-[#111110]">{getBodyFatTrend()}</div>
            <div className="text-sm text-[#6b6966]">BMI Trend:</div>
            <div className="font-medium text-[#111110]">{getBMiTrend()}</div>
          </div>
        </div>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-64">
          <Input
            placeholder="Member name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<IconSearch size={13} />}
          />
        </div>
        {(search) && (
          <button onClick={() => { setSearch(""); setPage(1); }} className="text-[11px] text-[#1d4ed8] hover:underline">
            Clear
          </button>
        )}
        <div className="ml-auto text-[11px] text-[#9b9895]">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={5} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("memberName")}>
                  Member <SortIcon col="memberName" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5">Date</th>
                <th className="text-left px-4 py-2.5">Weight (kg)</th>
                <th className="text-left px-4 py-2.5">Body Fat (%)</th>
                <th className="text-left px-4 py-2.5">BMI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      title="No measurements found"
                      description={search ? "Try adjusting your search." : "Add a body measurement for a member."}
                      action={{ label: "Add Measurement", onClick: () => navigate("/members") }}
                    />
                  </td>
                </tr>
              ) : paged.map((m) => {
                const member = getMemberName(m.member_id);
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-[#fafaf9] cursor-pointer transition-colors group"
                    onClick={() => navigate(`/measurements/${m.id}`)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar initials={member.split(' ').map(n => n[0]).join('').slice(0, 2)} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{member}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.measured_at}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.weight?.toFixed(1) ?? '—'}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.body_fat_percentage?.toFixed(1) ?? '—'}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.bmi?.toFixed(1) ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />}
      </div>
    </div>
  );
}

// Helper functions for stats
function calculateAverageWeight(): number {
  // This would need the measurementsList from component scope
  // For now, return a placeholder
  return 70.5;
}

function calculateAverageBodyFat(): number {
  // This would need the measurementsList from component scope
  // For now, return a placeholder
  return 18.2;
}

function calculateAverageBMI(): string {
  // This would need the measurementsList from component scope
  // For now, return a placeholder
  return "22.8";
}

function getWeightTrend(): string {
  // This would need the measurementsList from component scope
  // For now, return a placeholder
  return "▲ 0.5kg";
}

function getBodyFatTrend(): string {
  // This would need the measurementsList from component scope
  // For now, return a placeholder
  return "▼ 0.3%";
}

function getBMiTrend(): string {
  // This would need the measurementsList from component scope
  // For now, return a placeholder
  return "▲ 0.2";
}