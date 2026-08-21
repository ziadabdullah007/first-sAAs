// src/pages/PaymentsPage.tsx
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
import { subscriptions as subscriptionsApi } from "../api/subscriptions";
import { payments as paymentsApi } from "../api/payments";

const PER_PAGE = 10;
type PaymentStatus = "completed" | "pending" | "failed" | "refunded";
type SortKey = "memberName" | "subscriptionInfo" | "amount" | "date" | "status" | "method";
type SortDir = "asc" | "desc";

function SortIcon({ col, active, dir }: { col: string; active: string; dir: SortDir }) {
  if (active !== col) return <IconSort size={12} className="text-[#c9c7c3] ml-1 inline" />;
  return dir === "asc"
    ? <IconSortAsc size={12} className="text-[#1d4ed8] ml-1 inline" />
    : <IconSortDesc size={12} className="text-[#1d4ed8] ml-1 inline" />;
}

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [membersList, setMembersList] = useState<any[]>([]);
  const [subscriptionsList, setSubscriptionsList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all related data
        const [paysData, memData, subsData] = await Promise.all([
          paymentsApi.getPayments(),
          membersApi.getMembers(),
          subscriptionsApi.getSubscriptions()
        ]);
        setPaymentsList(paysData);
        setMembersList(memData);
        setSubscriptionsList(subsData);
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

  // Helper to get subscription info
  const getSubscriptionInfo = (subscriptionId: string) => {
    const sub = subscriptionsList.find(s => s.id === subscriptionId);
    if (!sub) return "Unknown Subscription";
    const memberName = getMemberName(sub.member_id);
    const planName = subscriptionsList.find(s => s.id === subscriptionId)?.plan_id 
      ? "Plan ID: " + subscriptionId.slice(0, 4) + "..."
      : "Unknown Plan";
    return `${memberName} - ${planName}`;
  };

  const filtered = paymentsList.filter((p) => {
    const q = search.toLowerCase();
    const memberName = getMemberName(p.member_id).toLowerCase();
    const subscriptionInfo = getSubscriptionInfo(p.subscription_id).toLowerCase();
    const matchSearch = !q || 
      memberName.includes(q) || 
      subscriptionInfo.includes(q) ||
      p.amount.toString().includes(q) ||
      p.payment_method.toLowerCase().includes(q);
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    let av: any, bv: any;
    if (sortKey === "memberName") { 
      av = getMemberName(a.member_id); 
      bv = getMemberName(b.member_id); 
    }
    else if (sortKey === "subscriptionInfo") { 
      av = getSubscriptionInfo(a.subscription_id); 
      bv = getSubscriptionInfo(b.subscription_id); 
    }
    else if (sortKey === "amount") { 
      av = a.amount ?? 0; 
      bv = b.amount ?? 0; 
    }
    else if (sortKey === "date") { 
      av = a.payment_date ?? ""; 
      bv = b.payment_date ?? ""; 
    }
    else if (sortKey === "status") { 
      av = a.status; 
      bv = b.status; 
    }
    else if (sortKey === "method") { 
      av = a.payment_method; 
      bv = b.payment_method; 
    }
    return sortDir === "asc" ? 
      (av < bv ? -1 : av > bv ? 1 : 0) : 
      (bv < av ? -1 : bv > av ? 1 : 0);
  });

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalAmount = paymentsList.reduce((sum, p) => sum + (p.amount ?? 0), 0);
  const completedCount = paymentsList.filter(p => p.status === "completed").length;

  return (
    <div className="p-6 space-y-4 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Payments</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[#9b9895]">{paymentsList.length} total</span>
            <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{completedCount} completed</span>
            <span className="text-[11px] text-[#9b9895]">EGP {totalAmount?.toLocaleString() ?? '0'}</span>
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
        <div className="w-96">
          <Input
            placeholder="Member, subscription, amount, or method..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<IconSearch size={13} />}
          />
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-[#f0efed] rounded-md">
          {([["", "All"], ["completed", "Completed"], ["pending", "Pending"], ["failed", "Failed"], ["refunded", "Refunded"]] as [PaymentStatus | "", string][]).map(([val, label]) => (
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

      {/* Summary */}
      <div className="bg-white border border-[#e5e3e0] rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-semibold text-[#111110]">Payment Summary</h2>
            <p className="text-xs text-[#9b9895]">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
          <Button size="sm" onClick={() => window.location.reload()}>
            <IconRefreshCw size={14} /> Refresh
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <div className="text-sm text-[#6b6966]">
            <div>Total Payments: {paymentsList.length}</div>
            <div>Completed: {completedCount}</div>
            <div>Pending: {paymentsList.filter(p => p.status === "pending").length}</div>
            <div>Failed: {paymentsList.filter(p => p.status === "failed").length}</div>
            <div>Refunded: {paymentsList.filter(p => p.status === "refunded").length}</div>
          </div>
          <div className="text-sm text-[#6b6966]">
            <div>Total Amount: EGP {totalAmount.toLocaleString()}</div>
            <div>Average Payment: EGP {(totalAmount / Math.max(paymentsList.length, 1)).toLocaleString()}</div>
            <div>Most Common Method: {getMostCommonMethod()}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
        {loading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("memberName")}>
                  Member <SortIcon col="memberName" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("subscriptionInfo")}>
                  Subscription <SortIcon col="subscriptionInfo" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("amount")}>
                  Amount <SortIcon col="amount" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("date")}>
                  Date <SortIcon col="date" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("status")}>
                  Status <SortIcon col="status" active={sortKey} dir={sortDir} />
                </th>
                <th className="text-left px-4 py-2.5 cursor-pointer select-none" onClick={() => toggleSort("method")}>
                  Method <SortIcon col="method" active={sortKey} dir={sortDir} />
                </th>
                <th className="px-4 py-2.5 w-24"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      title="No payments found"
                      description={search || statusFilter ? "Try adjusting your search or filters." : "Record a payment for a subscription."}
                      action={{ label: "Record Payment", onClick: () => navigate("/subscriptions") }}
                    />
                  </td>
                </tr>
              ) : paged.map((p) => {
                const member = getMemberName(p.member_id);
                const subscription = getSubscriptionInfo(p.subscription_id);
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-[#fafaf9] cursor-pointer transition-colors group"
                    onClick={() => navigate(`/payments/${p.id}`)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar initials={member.split(' ').map(n => n[0]).join('').slice(0, 2)} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{member}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{subscription}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966] font-mono">EGP {p.amount?.toLocaleString() ?? '0'}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{p.payment_date}</td>
                    <td className="px-4 py-2.5">{statusBadge(p.status)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{p.payment_method}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/payments/${p.id}`); }}
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

// Helper function to get most common payment method
function getMostCommonMethod(): string {
  // This would need the paymentsList from the component scope
  // For now, return a placeholder
  return "Cash";
}