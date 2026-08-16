import { useState, useEffect } from "react";
import { PAYMENTS, MEMBERS, SUBSCRIPTIONS, type PaymentStatus, type PaymentMethod } from "../data/fixtures";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import Modal from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";
import { IconSearch, IconPlus } from "../components/ui/Icons";
import Avatar from "../components/ui/Avatar";

const PER_PAGE = 10;
const METHOD_LABELS: Record<PaymentMethod, string> = { cash: "Cash", card: "Card", bank_transfer: "Bank Transfer" };

export default function PaymentsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "">("");
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "">("");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ memberId: "", amount: "", method: "cash" as PaymentMethod, notes: "" });

  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, []);

  const filtered = PAYMENTS.filter(p => {
    const q = search.toLowerCase();
    return (!q || p.memberName.toLowerCase().includes(q) || p.id.includes(q))
      && (!statusFilter || p.status === statusFilter)
      && (!methodFilter || p.method === methodFilter);
  });
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalPaid = PAYMENTS.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = PAYMENTS.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const failed = PAYMENTS.filter(p => p.status === "failed").length;

  const handleRecord = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setAddOpen(false);
    toast("Payment recorded.");
    setForm({ memberId: "", amount: "", method: "cash", notes: "" });
  };

  return (
    <div className="p-6 max-w-[1400px] space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Payments</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">{PAYMENTS.length} total records</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <IconPlus size={13} /> Record Payment
        </Button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-[#e5e3e0] rounded-lg px-4 py-3">
          <div className="text-[11px] text-[#9b9895] font-medium uppercase tracking-wide mb-1.5">Total Collected</div>
          <div className="text-xl font-bold text-[#111110] font-mono tabular-nums">EGP {totalPaid.toLocaleString()}</div>
          <div className="text-[11px] text-[#9b9895] mt-1">{PAYMENTS.filter(p => p.status === "paid").length} payments</div>
        </div>
        <div className="bg-white border border-[#e5e3e0] rounded-lg px-4 py-3">
          <div className="text-[11px] text-[#9b9895] font-medium uppercase tracking-wide mb-1.5">Pending</div>
          <div className="text-xl font-bold text-amber-700 font-mono tabular-nums">EGP {totalPending.toLocaleString()}</div>
          <div className="text-[11px] text-[#9b9895] mt-1">{PAYMENTS.filter(p => p.status === "pending").length} awaiting</div>
        </div>
        <div className="bg-white border border-[#e5e3e0] rounded-lg px-4 py-3">
          <div className="text-[11px] text-[#9b9895] font-medium uppercase tracking-wide mb-1.5">Failed</div>
          <div className="text-xl font-bold text-red-700 tabular-nums">{failed}</div>
          <div className="text-[11px] text-[#9b9895] mt-1">transactions failed</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-56">
          <Input
            placeholder="Search by member..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            leftIcon={<IconSearch size={13} />}
          />
        </div>
        <div className="flex items-center gap-1 p-0.5 bg-[#f0efed] rounded-md">
          {([["", "All"], ["paid", "Paid"], ["pending", "Pending"], ["failed", "Failed"]] as [PaymentStatus | "", string][]).map(([v, l]) => (
            <button key={v} onClick={() => { setStatusFilter(v); setPage(1); }}
              className={`px-3 py-1 rounded text-[12px] font-medium transition-all ${statusFilter === v ? "bg-white shadow-sm text-[#111110]" : "text-[#6b6966] hover:text-[#111110]"}`}
            >{l}</button>
          ))}
        </div>
        <select value={methodFilter} onChange={e => { setMethodFilter(e.target.value as PaymentMethod | ""); setPage(1); }}
          className="h-8 text-[12px] border border-[#e5e3e0] rounded-md bg-white px-3 text-[#111110] outline-none focus:border-[#1d4ed8] cursor-pointer">
          <option value="">All Methods</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="bank_transfer">Bank Transfer</option>
        </select>
        {(search || statusFilter || methodFilter) && (
          <button onClick={() => { setSearch(""); setStatusFilter(""); setMethodFilter(""); setPage(1); }} className="text-[11px] text-[#1d4ed8] hover:underline">Clear</button>
        )}
        <div className="ml-auto text-[11px] text-[#9b9895]">{filtered.length} results</div>
      </div>

      <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
        {loading ? <TableSkeleton rows={8} cols={6} /> : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5">Transaction ID</th>
                <th className="text-left px-4 py-2.5">Member</th>
                <th className="text-left px-4 py-2.5">Amount</th>
                <th className="text-left px-4 py-2.5">Method</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="text-left px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {paged.length === 0 ? (
                <tr><td colSpan={7}><EmptyState title="No payments found" description="No payment records match the current filters." /></td></tr>
              ) : paged.map(p => {
                const m = MEMBERS.find(mb => mb.id === p.memberId);
                return (
                  <tr key={p.id} className="hover:bg-[#fafaf9] transition-colors">
                    <td className="px-4 py-2.5 text-[11px] font-mono text-[#9b9895]">#{p.id.toUpperCase()}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={m?.avatarInitials ?? "??"} size="sm" />
                        <span className="text-[13px] font-medium text-[#111110]">{p.memberName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[13px] font-mono font-semibold text-[#111110]">EGP {p.amount.toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{METHOD_LABELS[p.method]}</td>
                    <td className="px-4 py-2.5">{statusBadge(p.status)}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{p.date}</td>
                    <td className="px-4 py-2.5"><button className="text-[11px] text-[#1d4ed8] hover:underline">Details</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Record Payment"
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={handleRecord} loading={saving}>Record</Button></>}
      >
        <div className="space-y-3">
          <Select label="Member" required value={form.memberId} onChange={e => setForm(f => ({ ...f, memberId: e.target.value }))}
            options={MEMBERS.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` }))} placeholder="Select member" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount (EGP)" required type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} placeholder="450" />
            <Select label="Payment Method" required value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value as PaymentMethod }))}
              options={[{ value: "cash", label: "Cash" }, { value: "card", label: "Card" }, { value: "bank_transfer", label: "Bank Transfer" }]} />
          </div>
          <Input label="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Reference or additional info" />
        </div>
      </Modal>
    </div>
  );
}
