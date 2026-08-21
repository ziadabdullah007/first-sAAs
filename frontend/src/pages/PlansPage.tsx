// src/pages/PlansPage.tsx
import { useState, useEffect } from "react";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { ConfirmModal } from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { TableSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../components/ui/Toast";
import { IconPlus } from "../components/ui/Icons";
import { plans } from "../api/plans";

export default function PlansPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [plansList, setPlansList] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration_months: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { 
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await plans.getPlans();
        setPlansList(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { 
    setForm({ name: "", description: "", price: "", duration_months: "" }); 
    setEditPlan(null); 
    setAddOpen(true); 
  };
  const openEdit = (p: any) => {
    setForm({ 
      name: p.name, 
      description: p.description || "", 
      price: String(p.price), 
      duration_months: String(p.duration_months) 
    });
    setEditPlan(p); 
    setAddOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration_months) {
      toast("Please fill in all required fields", "error");
      return;
    }
    
    setSaving(true);
    try {
      const planData = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        duration_months: parseInt(form.duration_months)
      };

      if (editPlan) {
        const updated = await plans.updatePlan(editPlan.id, planData);
        if (updated) {
          setPlansList(prev => prev.map(p => p.id === editPlan.id ? { ...p, ...updated } : p));
          toast("Plan updated.");
        }
      } else {
        const created = await plans.createPlan(planData);
        if (created) {
          setPlansList(prev => [...prev, created]);
          toast("Plan created.");
        }
      }
      setSaving(false); 
      setAddOpen(false);
    } catch (err: any) {
      setSaving(false);
      toast(err.message || "Failed to save plan", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await plans.deletePlan(deleteId);
      setPlansList(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
      toast("Plan deleted.", "warning");
    } catch (err: any) {
      toast(err.message || "Failed to delete plan", "error");
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const plan = plansList.find(p => p.id === id);
      if (!plan) return;
      
      const updated = await plans.updatePlan(id, { 
        status: plan.status === "active" ? "inactive" : "active" 
      });
      if (updated) {
        setPlansList(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
        toast(`Plan ${updated.status === "active" ? "enabled" : "disabled"}.`);
      }
    } catch (err: any) {
      toast(err.message || "Failed to update plan status", "error");
    }
  };

  const durationLabel = (d: number) => {
    if (d >= 365) return "1 year";
    if (d >= 180) return "6 months";
    if (d >= 90) return "3 months";
    if (d === 1) return "1 day";
    return `${d} days`;
  };

  return (
    <div className="p-6 max-w-[960px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-semibold text-[#111110]">Membership Plans</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">
            {plansList.filter(p => p.status === "active").length} active · 
            {plansList.filter(p => p.status === "inactive").length} inactive
          </p>
        </div>
        <Button onClick={openAdd}><IconPlus size={13} /> New Plan</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">
          <div className="text-sm text-red-800">{error}</div>
          <Button onClick={() => setError(null)} size="sm" variant="secondary">
            Dismiss
          </Button>
        </div>
      )}

      <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
        {loading ? (
          <TableSkeleton rows={6} cols={5} />
        ) : (
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
              {plansList.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState 
                      title="No plans" 
                      description="Create your first membership plan." 
                      action={{ label: "New Plan", onClick: openAdd }} 
                    />
                  </td>
                </tr>
              ) : plansList.map(p => (
                <tr key={p.id} className="hover:bg-[#fafaf9] transition-colors">
                  <td className="px-4 py-3">
                    <div className="text-[13px] font-semibold text-[#111110]">{p.name}</div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6b6966]">{p.description ?? ''}</td>
                  <td className="px-4 py-3">
                    <span className="text-[13px] font-semibold font-mono text-[#111110]">EGP {p.price?.toLocaleString() ?? '0'}</span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[#6b6966]">{durationLabel(p.duration_months ?? 0)}</td>
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

      <Modal 
        open={addOpen} 
        onClose={() => setAddOpen(false)} 
        title={editPlan ? "Edit Plan" : "Create Plan"}
        footer={<>
          <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} loading={saving}>{editPlan ? "Save Changes" : "Create Plan"}</Button>
        </>}
      >
        <div className="space-y-3">
          <Input 
            label="Plan Name" 
            required 
            value={form.name} 
            onChange={e => set("name", e.target.value)} 
            placeholder="e.g. Monthly" 
          />
          <Input 
            label="Description" 
            value={form.description} 
            onChange={e => set("description", e.target.value)} 
            placeholder="Brief description shown to staff" 
          />
          <div className="grid grid-cols-2 gap-3">
            <Input 
              label="Price (EGP)" 
              required 
              type="number" 
              value={form.price} 
              onChange={e => set("price", e.target.value)} 
              placeholder="450" 
            />
            <Input 
              label="Duration (months)" 
              required 
              type="number" 
              value={form.duration_months} 
              onChange={e => set("duration_months", e.target.value)} 
              placeholder="1" 
              hint="Use 1 for monthly, 3 for quarterly, 6 for semi-annual, 12 for annual" 
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Plan"
        message={`Delete "${plansList.find(p => p.id === deleteId)?.name}"? Existing subscriptions using this plan will not be affected, but new subscriptions cannot be created with this plan.`}
        confirmLabel="Delete Plan"
      />
    </div>
  );
}