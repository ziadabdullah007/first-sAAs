import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MEMBERS, PLANS, type MemberStatus } from "../../data/fixtures";
import { statusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Avatar from "../../components/ui/Avatar";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import { TableSkeleton } from "../../components/ui/Skeleton";
import AddMemberModal from "./AddMemberModal";
import { IconSearch, IconPlus, IconSort, IconSortAsc, IconSortDesc } from "../../components/ui/Icons";

const PER_PAGE = 10;
type SortKey = "name" | "status" | "lastVisit" | "joinedAt";
type SortDir = "asc" | "desc";

function SortIcon({ col, active, dir }: { col: string; active: string; dir: SortDir }) {
  if (active !== col) return <IconSort size={12} className="text-[#c9c7c3] ml-1 inline" />;
  return dir === "asc"
    ? <IconSortAsc size={12} className="text-[#1d4ed8] ml-1 inline" />
    : <IconSortDesc size={12} className="text-[#1d4ed8] ml-1 inline" />;
}

export default function MembersPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MemberStatus | "">("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const filtered = MEMBERS.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q);
    const matchStatus = !statusFilter || m.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    let av: string, bv: string;
    if (sortKey === "name") { av = `${a.firstName} ${a.lastName}`; bv = `${b.firstName} ${b.lastName}`; }
    else if (sortKey === "status") { av = a.status; bv = b.status; }
    else if (sortKey === "lastVisit") { av = a.lastVisit ?? "0000"; bv = b.lastVisit ?? "0000"; }
    else { av = a.joinedAt; bv = b.joinedAt; }
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeCount = MEMBERS.filter(m => m.status === "active").length;
  const expiredCount = MEMBERS.filter(m => m.status === "expired").length;

  return (
    <div className="p-6 space-y-4 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Members</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[#9b9895]">{MEMBERS.length} total</span>
            <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{activeCount} active</span>
            {expiredCount > 0 && <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">{expiredCount} expired</span>}
          </div>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <IconPlus size={13} /> Add Member
        </Button>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-64">
          <Input
            placeholder="Name, phone, or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<IconSearch size={13} />}
          />
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-[#f0efed] rounded-md">
          {([["", "All"], ["active", "Active"], ["expired", "Expired"], ["suspended", "Suspended"]] as [MemberStatus | "", string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setStatusFilter(val); setPage(1); }}
              className={`px-3 py-1 rounded text-[12px] font-medium transition-all ${statusFilter === val ? "bg-white shadow-sm text-[#111110]" : "text-[#6b6966] hover:text-[#111110]"}`}
            >
              {label}
            </button>
          ))}
        </div>
        {(search || statusFilter) && (
          <button onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }} className="text-[11px] text-[#1d4ed8] hover:underline">
            Clear
          </button>
        )}
        <div className="ml-auto text-[11px] text-[#9b9895]">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  Member <SortIcon col="name" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5">Phone</th>
                <th className="text-left px-4 py-2.5">Email</th>
                <th className="text-left px-4 py-2.5">Plan</th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("status")}>
                  Status <SortIcon col="status" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("lastVisit")}>
                  Last Visit <SortIcon col="lastVisit" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("joinedAt")}>
                  Joined <SortIcon col="joinedAt" active={sortKey} dir={sortDir} />
                </th>
                <th className="px-4 py-2.5 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No members found"
                      description={search || statusFilter ? "Try adjusting your search or filters." : "Add your first member to get started."}
                      action={{ label: "Add Member", onClick: () => setAddOpen(true) }}
                    />
                  </td>
                </tr>
              ) : paged.map((m) => {
                const plan = PLANS.find((p) => p.id === m.planId);
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-[#fafaf9] cursor-pointer transition-colors group"
                    onClick={() => navigate(`/members/${m.id}`)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={m.avatarInitials} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{m.firstName} {m.lastName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966] font-mono">{m.phone}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.email}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{plan?.name ?? <span className="text-[#c9c7c3]">—</span>}</td>
                    <td className="px-4 py-2.5">{statusBadge(m.status)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.lastVisit ?? <span className="text-[#c9c7c3]">Never</span>}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.joinedAt}</td>
                    <td className="px-4 py-2.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/members/${m.id}`); }}
                        className="text-[11px] text-[#1d4ed8] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />}
      </div>

      <AddMemberModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
