import { useState } from "react";
import { BODY_MEASUREMENTS, MEMBERS } from "../data/fixtures";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import EmptyState from "../components/ui/EmptyState";
import Avatar from "../components/ui/Avatar";
import { useToast } from "../components/ui/Toast";

export default function MeasurementsPage() {
  const { toast } = useToast();
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ memberId: "", weight: "", bodyFat: "", notes: "" });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setAddOpen(false);
    toast("Measurement recorded.");
    setForm({ memberId: "", weight: "", bodyFat: "", notes: "" });
  };

  const enriched = BODY_MEASUREMENTS.map((m) => ({
    ...m,
    member: MEMBERS.find((mb) => mb.id === m.memberId),
  })).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="p-6 max-w-[1100px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-[#111110]">Body Measurements</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">{BODY_MEASUREMENTS.length} records across {new Set(BODY_MEASUREMENTS.map(m => m.memberId)).size} members</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Add Measurement
        </Button>
      </div>

      <div className="bg-white border border-[#e4e2df] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e4e2df] bg-[#fafaf9]">
              <th className="text-left px-4 py-2.5">Member</th>
              <th className="text-left px-4 py-2.5">Date</th>
              <th className="text-left px-4 py-2.5">Weight</th>
              <th className="text-left px-4 py-2.5">Body Fat %</th>
              <th className="text-left px-4 py-2.5">BMI</th>
              <th className="text-left px-4 py-2.5">Notes</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {enriched.length === 0 ? (
              <tr><td colSpan={7}><EmptyState title="No measurements recorded" description="Add the first body measurement to get started." action={{ label: "Add Measurement", onClick: () => setAddOpen(true) }} /></td></tr>
            ) : enriched.map((m, i) => (
              <tr key={m.id} className={`border-b border-[#f5f4f2] hover:bg-[#fafaf9] ${i === enriched.length - 1 ? "border-0" : ""}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={m.member?.avatarInitials ?? "??"} size="sm" />
                    <span className="text-xs font-medium text-[#111110]">{m.member?.firstName} {m.member?.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{m.date}</td>
                <td className="px-4 py-2.5 text-xs font-mono">{m.weight} kg</td>
                <td className="px-4 py-2.5 text-xs font-mono">{m.bodyFat != null ? `${m.bodyFat}%` : "—"}</td>
                <td className="px-4 py-2.5 text-xs font-mono">{m.bmi ?? "—"}</td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{m.notes ?? "—"}</td>
                <td className="px-4 py-2.5 flex gap-2">
                  <button className="text-xs text-[#1d4ed8] hover:underline">Edit</button>
                  <button className="text-xs text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Body Measurement"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Save Measurement</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Select
            label="Member"
            required
            value={form.memberId}
            onChange={(e) => setForm(f => ({ ...f, memberId: e.target.value }))}
            options={MEMBERS.map(m => ({ value: m.id, label: `${m.firstName} ${m.lastName}` }))}
            placeholder="Select member"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Weight (kg)" required type="number" value={form.weight} onChange={(e) => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="75" />
            <Input label="Body Fat %" type="number" value={form.bodyFat} onChange={(e) => setForm(f => ({ ...f, bodyFat: e.target.value }))} placeholder="18.5" />
          </div>
          <Input label="Notes" value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" />
        </div>
      </Modal>
    </div>
  );
}
