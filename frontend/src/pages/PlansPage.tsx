import { useState, useEffect } from "react";
import { PLANS, type Plan } from "../data/fixtures";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { ConfirmModal } from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { IconPlus } from "../components/ui/Icons";

export default function PlansPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>(PLANS);
  const [addOpen, setAddOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<Plan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", durationDays: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm({ name: "", description: "", price: "", durationDays: "" }); setEditPlan(null); setAddOpen(true); };
  const openEdit = (p: Plan) => {
    setForm({ name: p.name, description: p.description, price: String(p.price), durationDays: String(p.durationDays) });
    setEditPlan(p); setAddOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.durationDays) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    if (editPlan) {
      setPlans(prev => prev.map(p => p.id === editPlan.id ? { ...p, name: form.name, description: form.description, price: parseInt(form.price), durationDays: parseInt(form.durationDays) } : p));
      toast("Plan updated.");
    } else {
      setPlans(prev => [...prev, { id: `p${Date.now()}`, name: form.name, description: form.description, price: parseInt(form.price), durationDays: parseInt(form.durationDays), status: "active" }]);
      toast("Plan created.");
    }
    setSaving(false); setAddOpen(false);
  };

  const handleDelete = async () => {
    await new Promise(r => setTimeout(r, 400));
    setPlans(prev => prev.filter(p => p.id !== deleteId));
    setDeleteId(null);
    toast("Plan deleted.", "warning");
  };

  const toggleStatus = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p));
  };

  const durationLabel = (d: number) => d >= 365 ? "1 year" : d >= 180 ? "6 months" : d >= 90 ? "3 months" : d === 1 ? "1 day" : `${d} days`;

  return (
    <div className="p-6 max-w-[960px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Membership Plans</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">{plans.filter(p => p.status === "active").length} active · {plans.filter(p => p.status === "inactive").length} inactive</p>
        </div>
        <Button onClick={openAdd}><IconPlus size={13} /> New Plan</Button>
      </div>

      <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
        {loading ? <TableSkeleton rows={6} cols={5} /> : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5">Plan Name</th>
                <th className="text-left px-4 py-2.5">Description</th>
                <th className="text-left px-4 py-2.5">Price</th>
                <th className="text-left px-4 py-2.5">Duration</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5 w-32"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f5f4f2]">
              {plans.length === 0 ? (
                <tr><td colSpan={6}><EmptyState title="No plans" description="Create your first membership plan." action={{ label: "New Plan", onClick: openAdd }} /></td></tr>
              ) : plans.map(p => (
                <tr key={p.id} className="hover:bg-[#fafaf9] transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-semibold text-[#111110]">{p.name}</div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6b6966]">{p.description}</td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold font-mono text-[#111110]">EGP {p.price.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6b6966]">{durationLabel(p.durationDays)}</td>
                  <td className="px-4 py-3">{statusBadge(p.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(p)} className="text-[11px] text-[#1d4ed8] hover:underline">Edit</button>
                      <button onClick={() => toggleStatus(p.id)} className="text-[11px] text-[#6b6966] hover:underline">
                        {p.status === "active" ? "Disable" : "Enable"}
                      </button>
                      <button onClick={() => setDeleteId(p.id)} className="text-[11px] text-red-500 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={editPlan ? "Edit Plan" : "Create Plan"}
        footer={<><Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button><Button onClick={handleSave} loading={saving}>{editPlan ? "Save Changes" : "Create Plan"}</Button></>}
      >
        <div className="space-y-3">
          <Input label="Plan Name" required value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Monthly" />
          <Input label="Description" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description shown to staff" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (EGP)" required type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="450" />
            <Input label="Duration (days)" required type="number" value={form.durationDays} onChange={e => set("durationDays", e.target.value)} placeholder="30" hint="Use 30 for monthly, 365 for annual" />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Plan"
        message={`Delete "${plans.find(p => p.id === deleteId)?.name}"? Existing subscriptions using this plan will not be affected, but new subscriptions cannot be created with this plan.`}
        confirmLabel="Delete Plan"
      />
    </div>
  );
}
