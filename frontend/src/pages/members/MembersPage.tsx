// src/pages/members/MembersPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { statusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Avatar from "../../components/ui/Avatar";
import Pagination from "../../components/ui/Pagination";
import EmptyState from "../../components/ui/EmptyState";
import AddMemberModal from "./AddMemberModal";
import { IconSearch, IconPlus, IconSort, IconSortAsc, IconSortDesc } from "../../components/ui/Icons";
import { members } from "../../api/members";

const PER_PAGE = 10;
type MemberStatus = "active" | "expired" | "suspended";
type SortKey = "name" | "status" | "joined_at";
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
  const [membersList, setMembersList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await members.getMembers();
      setMembersList(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  // Backend returns snake_case fields
  const filtered = membersList.filter((m) => {
    const q = search.toLowerCase();
    const fullName = `${m.first_name || ''} ${m.last_name || ''}`.toLowerCase();
    const matchSearch = !q ||
      fullName.includes(q) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q));
    const matchStatus = !statusFilter || m.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    let av: any, bv: any;
    if (sortKey === "name") {
      av = `${a.first_name || ''} ${a.last_name || ''}`;
      bv = `${b.first_name || ''} ${b.last_name || ''}`;
    }
    else if (sortKey === "status") {
      av = a.status;
      bv = b.status;
    }
    else if (sortKey === "joined_at") {
      av = a.joined_at ?? "";
      bv = b.joined_at ?? "";
    }
    return sortDir === "asc" ?
      (av < bv ? -1 : av > bv ? 1 : 0) :
      (bv < av ? -1 : bv > av ? 1 : 0);
  });

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeCount = membersList.filter(m => m.status === "active").length;
  const expiredCount = membersList.filter(m => m.status === "expired").length;

  const formatDate = (d: string | null) => {
    if (!d) return null;
    try { return new Date(d).toLocaleDateString(); } catch { return d; }
  };

  return (
    <div className="p-6 space-y-4 max-w-[1400px] animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[16px] font-bold text-[#111110]">Members</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[#9b9895]">{membersList.length} total</span>
            <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{activeCount} active</span>
            {expiredCount > 0 && <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">{expiredCount} expired</span>}
          </div>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <IconPlus size={13} /> Add Member
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 animate-fade-in">
          <div className="text-sm text-red-800">{error}</div>
          <Button onClick={() => { setError(null); fetchMembers(); }} size="sm" variant="secondary" className="mt-2">
            Retry
          </Button>
        </div>
      )}

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
        <div className="flex items-center gap-1 p-0.5 bg-[#f0efed] rounded-lg">
          {([["", "All"], ["active", "Active"], ["expired", "Expired"], ["suspended", "Suspended"]] as [MemberStatus | "", string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setStatusFilter(val); setPage(1); }}
              className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all ${statusFilter === val ? "bg-white shadow-sm text-[#111110]" : "text-[#6b6966] hover:text-[#111110]"}`}
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
      <div className="bg-white border border-[#e5e3e0] rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full border-4 border-[#e5e3e0] border-t-[#1d4ed8] h-10 w-10 mx-auto mb-4"></div>
            <p className="text-sm text-[#6b6966]">Loading members...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  Member <SortIcon col="name" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5">Phone</th>
                <th className="text-left px-4 py-2.5">Email</th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("status")}>
                  Status <SortIcon col="status" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("joined_at")}>
                  Joined <SortIcon col="joined_at" active={sortKey} dir={sortDir} />
                </th>
                <th className="px-4 py-2.5 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      title="No members found"
                      description={search || statusFilter ? "Try adjusting your search or filters." : "Add your first member to get started."}
                      action={{ label: "Add Member", onClick: () => setAddOpen(true) }}
                    />
                  </td>
                </tr>
              ) : paged.map((m) => {
                const initials = `${(m.first_name || '')[0] || ''}${(m.last_name || '')[0] || ''}`.toUpperCase();
                return (
                  <tr
                    key={m.id}
                    className="hover:bg-[#fafaf9] cursor-pointer transition-colors group"
                    onClick={() => navigate(`/members/${m.id}`)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={initials} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{m.first_name} {m.last_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966] font-mono">{m.phone}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.email ?? ''}</td>
                    <td className="px-4 py-2.5">{statusBadge(m.status)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{formatDate(m.joined_at) ?? <span className="text-[#c9c7c3]">—</span>}</td>
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

      <AddMemberModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={fetchMembers} />
    </div>
  );
}