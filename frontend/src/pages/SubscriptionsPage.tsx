import { useState, useEffect } from "react";
import { SUBSCRIPTIONS, MEMBERS, PLANS, type SubscriptionStatus } from "../data/fixtures";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";
import Select from "../components/ui/Select";
import { useToast } from "../components/ui/Toast";
import { IconSearch, IconPlus, IconWarning } from "../components/ui/Icons";
import Avatar from "../components/ui/Avatar";

const PER_PAGE = 10;

export default function SubscriptionsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | "">("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ memberId: "", planId: "", startDate: "", autoRenew: false });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const today = "2025-08-15";
  const expiring = SUBSCRIPTIONS.filter(s => {
    if (s.status !== "active") return false;
    const d = Math.ceil((new Date(s.endDate).getTime() - new Date(today).getTime()) / 86400000);
    return d >= 0 && d <= 7;
  });

  const filtered = SUBSCRIPTIONS.filter(s => {
    const q = search.toLowerCase();
    return (!q || s.memberName.toLowerCase().includes(q) || s.planName.toLowerCase().includes(q))
      && (!statusFilter || s.status === statusFilter);
  });
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCreate = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setAddOpen(false);
    toast("Subscription created.");
    setForm({ memberId: "", planId: "", startDate: "", autoRenew: false });
  };

  return (
    <div className="p-6 max-w-[1400px] space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Subscriptions</h1>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[11px] text-[#9b9895]">{SUBSCRIPTIONS.length} total</span>
            <span className="text-[11px] text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{SUBSCRIPTIONS.filter(s => s.status === "active").length} active</span>
            {expiring.length > 0 && <span className="text-[11px] text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">{expiring.length} expiring soon</span>}
          </div>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <IconPlus size={13} /> New Subscription
        </Button>
      </div>

      {expiring.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          <IconWarning size={14} className="text-amber-600 flex-shrink-0" />
          <span className="text-xs text-amber-800 font-medium">
            {expiring.length} subscription{expiring.length > 1 ? "s" : ""} expire within 7 days: {expiring.map(s => s.memberName).join(", ")}
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-60">
          <Input
            placeholder="Member or plan name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<IconSearch size={13} />}
          />
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-[#f0efed] rounded-md">
          {([["", "All"], ["active", "Active"], ["expired", "Expired"], ["suspended", "Suspended"]] as [SubscriptionStatus | "", string][]).map(([v, l]) => (
            <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
              className={`px-3 py-1 rounded text-[12px] font-medium transition-all ${statusFilter === v ? "bg-white shadow-sm text-[#111110]" : "text-[#6b6966] hover:text-[#111110]"}`}
            >{l}</button>
          ))}
        </div>
        <div className="ml-auto text-[11px] text-[#9b9895]">{filtered.length} results</div>
      </div>

      <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
        {loading ? <TableSkeleton rows={8} cols={7} /> : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5">Member</th>
                <th className="text-left px-4 py-2.5">Plan</th>
                <th className="text-left px-4 py-2.5">Start Date</th>
                <th className="text-left px-4 py-2.5">End Date</th>
                <th className="text-left px-4 py-2.5">Amount</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="text-left px-4 py-2.5">Auto-renew</th>
                <th className="px-4 py-2.5 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {paged.length === 0 ? (
                <tr><td colSpan={8}><EmptyState title="No subscriptions found" description="Try adjusting your filters or create a new subscription." action={{ label: "New Subscription", onClick: () => setAddOpen(true) }} /></td></tr>
              ) : paged.map(s => {
                const days = Math.ceil((new Date(s.endDate).getTime() - new Date(today).getTime()) / 86400000);
                const isExpiring = s.status === "active" && days >= 0 && days <= 7;
                const m = MEMBERS.find(mb => mb.id === s.memberId);
                return (
                  <tr key={s.id} className={`hover:bg-[#fafaf9] transition-colors ${isExpiring ? "bg-amber-50/30" : ""}`}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={m?.avatarInitials ?? "??"} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{s.memberName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{s.planName}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{s.startDate}</td>
                    <td className="px-4 py-2.5 text-[12px]">
                      <span className={isExpiring ? "text-amber-700 font-semibold" : "text-[#6b6966]"}>{s.endDate}</span>
                      {isExpiring && <span className="ml-1.5 text-[10px] text-amber-500">({days}d)</span>}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] font-mono">EGP {s.amount.toLocaleString()}</td>
                    <td className="px-4 py-2.5">{statusBadge(s.status)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{s.autoRenew ? "Yes" : "No"}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-2">
                        <button className="text-[11px] text-[#1d4ed8] hover:underline">Edit</button>
                        {isExpiring && <button className="text-[11px] text-amber-600 hover:underline">Renew</button>}
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create Subscription"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={handleCreate} loading={saving}>Create</Button></>}
      >
        <div className="space-y-3">
          <Select label="Member" required value={form.memberId} onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))}
            options={MEMBERS.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` }))} placeholder="Select member" />
          <Select label="Plan" required value={form.planId} onChange={e => setForm(f => ({ ...f, planId: e.target.value }))}
            options={PLANS.filter(p => p.status === "active").map(p => ({ value: p.id, label: `${p.name} — EGP ${p.price} / ${p.durationDays}d` }))} placeholder="Select plan" />
          <Input label="Start Date" type="date" required value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="ar2" checked={form.autoRenew} onChange={e => setForm(f => ({ ...f, autoRenew: e.target.checked }))} className="w-4 h-4 accent-[#1d4ed8]" />
            <label htmlFor="ar2" className="text-xs text-[#6b6966]">Enable auto-renewal</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
