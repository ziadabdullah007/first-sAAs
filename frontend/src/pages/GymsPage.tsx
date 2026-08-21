// src/pages/GymsPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { IconSearch, IconPlus, IconSort, IconSortAsc, IconSortDesc, IconUserPlus, IconRefreshCw, IconShieldCheck } from "../components/ui/Icons";
import { gyms } from "../api/gyms";

const PER_PAGE = 10;
type SortKey = "name" | "status" | "createdAt";
type SortDir = "asc" | "desc";

function SortIcon({ col, active, dir }: { col: string; active: string; dir: SortDir }) {
  if (active !== col) return <IconSort size={12} className="text-[#c9c7c3] ml-1 inline" />;
  return dir === "asc"
    ? <IconSortAsc size={12} className="text-[#1d4ed8] ml-1 inline" />
    : <IconSortDesc size={12} className="text-[#1d4ed8] ml-1 inline" />;
}

export default function GymsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [gymsList, setGymsList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await gyms.getGyms();
        setGymsList(data);
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

  const filtered = gymsList.filter((g) => {
    const q = search.toLowerCase();
    const matchSearch = !q || (g.name ?? "").toLowerCase().includes(q);
    return matchSearch;
  }).sort((a, b) => {
    let av: any, bv: any;
    if (sortKey === "name") { 
      av = a.name ?? ""; 
      bv = b.name ?? ""; 
    }
    else if (sortKey === "status") { 
      av = a.status ?? ""; 
      bv = b.status ?? ""; 
    }
    else if (sortKey === "createdAt") { 
      av = a.created_at ?? ""; 
      bv = b.created_at ?? ""; 
    }
    return sortDir === "asc" ? 
      (av < bv ? -1 : av > bv ? 1 : 0) : 
      (bv < av ? -1 : bv > av ? 1 : 0);
  });

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeCount = gymsList.filter(g => g.status === "active").length;

  return (
    <div className="p-6 space-y-4 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Gym Management</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[#9b9895]">{gymsList.length} total gyms</span>
            <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{activeCount} active</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          <div className="text-sm text-red-800">{error}</div>
          <Button onClick={() => setError(null)} size="sm" variant="secondary">
            Dismiss
          </Button>
        </div>
      )}

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-64">
          <Input
            placeholder="Gym name..."
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
          <TableSkeleton rows={8} cols={4} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  Gym <SortIcon col="name" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5">Owner</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      title="No gyms found"
                      description={search ? "Try adjusting your search." : "Add your first gym."}
                      action={{ label: "Add Gym", onClick: () => navigate("/members") }}
                    />
                  </td>
                </tr>
              ) : paged.map((g) => {
                const initials = (g.name ?? "Gym").split(' ').map((n: string) => n[0]).join('').slice(0, 2);
                return (
                  <tr
                    key={g.id}
                    className="hover:bg-[#fafaf9] cursor-pointer transition-colors group"
                    onClick={() => navigate("/gym-profile")}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar initials={initials} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{g.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{g.owner_name}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{statusBadge(g.status)}</td>
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