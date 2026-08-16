import { useState } from "react";
import { STAFF } from "../data/fixtures";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Avatar from "../components/ui/Avatar";
import Modal from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";

export default function StaffPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "" });

  const filtered = STAFF.filter((s) => {
    const q = search.toLowerCase();
    return !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.position.toLowerCase().includes(q);
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setAddOpen(false);
    toast("Staff member added.");
    setForm({ name: "", email: "", phone: "", position: "" });
  };

  return (
    <div className="p-6 max-w-[1100px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-[#111110]">Staff</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">{STAFF.filter(s => s.status === "active").length} active staff members</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Add Staff
        </Button>
      </div>

      <div className="w-60">
        <Input
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M11 11l-2.5-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>}
        />
      </div>

      <div className="bg-white border border-[#e4e2df] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e4e2df] bg-[#fafaf9]">
              <th className="text-left px-4 py-2.5">Name</th>
              <th className="text-left px-4 py-2.5">Position</th>
              <th className="text-left px-4 py-2.5">Email</th>
              <th className="text-left px-4 py-2.5">Phone</th>
              <th className="text-left px-4 py-2.5">Status</th>
              <th className="text-left px-4 py-2.5">Joined</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} className={`border-b border-[#f5f4f2] hover:bg-[#fafaf9] ${i === filtered.length - 1 ? "border-0" : ""}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={s.avatarInitials} size="sm" />
                    <span className="text-sm font-medium text-[#111110]">{s.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{s.position}</td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{s.email}</td>
                <td className="px-4 py-2.5 text-xs font-mono text-[#6b6966]">{s.phone}</td>
                <td className="px-4 py-2.5">{statusBadge(s.status)}</td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{s.joinedAt}</td>
                <td className="px-4 py-2.5 flex gap-3">
                  <button className="text-xs text-[#1d4ed8] hover:underline">Edit</button>
                  <button className="text-xs text-red-600 hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Staff Member"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving}>Add Staff</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Full Name" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Email Address" type="email" required value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+20 100 000 0000" />
          <Input label="Position / Role" required value={form.position} onChange={(e) => setForm(f => ({ ...f, position: e.target.value }))} placeholder="e.g. Receptionist, Trainer" />
        </div>
      </Modal>
    </div>
  );
}
