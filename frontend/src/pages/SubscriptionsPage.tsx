// src/pages/SubscriptionsPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { IconSearch, IconPlus, IconSort, IconSortAsc, IconSortDesc, IconCalendar, IconRefreshCw } from "../components/ui/Icons";
import { members as membersApi } from "../api/members";
import { plans as plansApi } from "../api/plans";
import { subscriptions as subscriptionsApi } from "../api/subscriptions";

const PER_PAGE = 10;
type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";
type SortKey = "memberName" | "planName" | "startDate" | "endDate" | "status" | "amount";
type SortDir = "asc" | "desc";

function SortIcon({ col, active, dir }: { col: string; active: string; dir: SortDir }) {
  if (active !== col) return <IconSort size={12} className="text-[#c9c7c3] ml-1 inline" />;
  return dir === "asc"
    ? <IconSortAsc size={12} className="text-[#1d4ed8] ml-1 inline" />
    : <IconSortDesc size={12} className="text-[#1d4ed8] ml-1 inline" />;
}

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "">("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("memberName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [subscriptionsList, setSubscriptionsList] = useState<any[]>([]);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [plansList, setPlansList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all related data
        const [subs, memData, plansData] = await Promise.all([
          subscriptionsApi.getSubscriptions(),
          membersApi.getMembers(),
          plansApi.getPlans()
        ]);
        setSubscriptionsList(subs);
        setMembersList(memData);
        setPlansList(plansData);
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

  // Helper to get plan name
  const getPlanName = (planId: string) => {
    const plan = plansList.find(p => p.id === planId);
    return plan ? plan.name : "Unknown Plan";
  };

  const filtered = subscriptionsList.filter((s) => {
    const q = search.toLowerCase();
    const memberName = getMemberName(s.member_id).toLowerCase();
    const planName = getPlanName(s.plan_id).toLowerCase();
    const matchSearch = !q || 
      memberName.includes(q) || 
      planName.includes(q) ||
      s.amount.toString().includes(q);
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    let av: any, bv: any;
    if (sortKey === "memberName") { 
      av = getMemberName(a.member_id); 
      bv = getMemberName(b.member_id); 
    }
    else if (sortKey === "planName") { 
      av = getPlanName(a.plan_id); 
      bv = getPlanName(b.plan_id); 
    }
    else if (sortKey === "startDate") { 
      av = a.start_date ?? ""; 
      bv = b.start_date ?? ""; 
    }
    else if (sortKey === "endDate") { 
      av = a.end_date ?? ""; 
      bv = b.end_date ?? ""; 
    }
    else if (sortKey === "status") { 
      av = a.status; 
      bv = b.status; 
    }
    else if (sortKey === "amount") { 
      av = a.amount ?? 0; 
      bv = b.amount ?? 0; 
    }
    return sortDir === "asc" ? 
      (av < bv ? -1 : av > bv ? 1 : 0) : 
      (bv < av ? -1 : bv > av ? 1 : 0);
  });

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const activeCount = subscriptionsList.filter(s => s.status === "active").length;
  const expiredCount = subscriptionsList.filter(s => s.status === "expired").length;

  return (
    <div className="p-6 space-y-4 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Subscriptions</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[#9b9895]">{subscriptionsList.length} total</span>
            <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{activeCount} active</span>
            {expiredCount > 0 && <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">{expiredCount} expired</span>}
          </div>
        </div>
        <Button onClick={() => navigate("/members")}>
          <IconPlus size={13} /> Manage Members
        </Button>
        <Button onClick={() => navigate("/plans")}>
          <IconPlus size={13} /> Manage Plans
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

      {/* Filter row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-80">
          <Input
            placeholder="Member name, plan, or amount..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<IconSearch size={13} />}
          />
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-[#f0efed] rounded-md">
          {([["", "All"], ["active", "Active"], ["expired", "Expired"], ["cancelled", "Cancelled"], ["pending", "Pending"]] as [SubscriptionStatus | "", string][]).map(([val, label]) => (
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
          <TableSkeleton rows={8} cols={6} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("memberName")}>
                  Member <SortIcon col="memberName" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("planName")}>
                  Plan <SortIcon col="planName" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("startDate")}>
                  Start Date <SortIcon col="startDate" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("endDate")}>
                  End Date <SortIcon col="endDate" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("status")}>
                  Status <SortIcon col="status" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("amount")}>
                  Amount <SortIcon col="amount" active={sortKey} dir={sortDir} />
                </th>
                <th className="px-4 py-2.5 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState
                      title="No subscriptions found"
                      description={search || statusFilter ? "Try adjusting your search or filters." : "Create a subscription by selecting a member and a plan."}
                      action={{ label: "Create Subscription", onClick: () => navigate("/members") }}
                    />
                  </td>
                </tr>
              ) : paged.map((s) => {
                const member = getMemberName(s.member_id);
                const plan = getPlanName(s.plan_id);
                return (
                  <tr
                    key={s.id}
                    className="hover:bg-[#fafaf9] cursor-pointer transition-colors group"
                    onClick={() => navigate(`/subscriptions/${s.id}`)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar initials={member.split(' ').map(n => n[0]).join('').slice(0, 2)} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{member}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{plan}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{s.start_date}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{s.end_date}</td>
                    <td className="px-4 py-2.5">{statusBadge(s.status)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966] font-mono">EGP {s.amount?.toLocaleString() ?? '0'}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/subscriptions/${s.id}`); }}
                          className="text-[11px] text-[#1d4ed8] hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View →
                        </button>
                      </div>
                    </td>
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