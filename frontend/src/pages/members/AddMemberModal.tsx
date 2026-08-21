// src/pages/members/AddMemberModal.tsx
import { useState } from "react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useToast } from "../../components/ui/Toast";
import { members } from "../../api/members";
import { getStoredUser } from "../../api/auth";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddMemberModal({ open, onClose, onSuccess }: AddMemberModalProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const resetForm = () => {
    setForm({ first_name: "", last_name: "", email: "", phone: "", date_of_birth: "", gender: "" });
  };

  const handleSave = async () => {
    if (!form.first_name || !form.last_name || !form.phone) {
      toast("First name, last name, and phone are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const user = getStoredUser();
      await members.createMember({
        gym_id: user?.gym_id || "",
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email || undefined,
        phone: form.phone,
        date_of_birth: form.date_of_birth || undefined,
        gender: form.gender || undefined,
      });
      toast("Member added successfully.");
      resetForm();
      onClose();
      onSuccess?.();
    } catch (err: any) {
      toast(err.message || "Failed to add member", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => { resetForm(); onClose(); }}
      title="Add New Member"
      footer={<>
        <Button variant="secondary" onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
        <Button onClick={handleSave} loading={saving}>Add Member</Button>
      </>}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" required value={form.first_name} onChange={e => set("first_name", e.target.value)} placeholder="Ahmed" />
          <Input label="Last Name" required value={form.last_name} onChange={e => set("last_name", e.target.value)} placeholder="Hassan" />
        </div>
        <Input label="Phone" required value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+20 100 111 2233" />
        <Input label="Email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="ahmed@example.com" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date of Birth" type="date" value={form.date_of_birth} onChange={e => set("date_of_birth", e.target.value)} />
          <Select label="Gender" value={form.gender} onChange={e => set("gender", e.target.value)} options={[
            { value: "", label: "Select..." },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]} />
        </div>
      </div>
    </Modal>
  );
}
