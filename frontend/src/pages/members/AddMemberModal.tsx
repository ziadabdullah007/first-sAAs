import { useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { PLANS } from "../../data/fixtures";
import { useToast } from "../../components/ui/Toast";

interface Props { open: boolean; onClose: () => void }

export default function AddMemberModal({ open, onClose }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", dob: "", gender: "", height: "", weight: "", planId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const err = (k: string, v: string) => setErrors((e) => ({ ...e, [k]: v }));
  const clearErr = (k: string) => setErrors((e) => { const n = { ...e }; delete n[k]; return n; });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName) errs.firstName = "First name is required";
    if (!form.lastName) errs.lastName = "Last name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.phone) errs.phone = "Phone is required";
    if (!form.gender) errs.gender = "Gender is required";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast("Member created successfully.");
    onClose();
    setForm({ firstName: "", lastName: "", email: "", phone: "", dob: "", gender: "", height: "", weight: "", planId: "" });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New Member"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>Create Member</Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Personal info */}
        <div>
          <div className="text-xs font-semibold text-[#111110] mb-3 pb-1.5 border-b border-[#e4e2df]">Personal Information</div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" required value={form.firstName} onChange={(e) => { set("firstName", e.target.value); clearErr("firstName"); }} error={errors.firstName} />
            <Input label="Last Name" required value={form.lastName} onChange={(e) => { set("lastName", e.target.value); clearErr("lastName"); }} error={errors.lastName} />
            <Input label="Email Address" type="email" required value={form.email} onChange={(e) => { set("email", e.target.value); clearErr("email"); }} error={errors.email} />
            <Input label="Phone Number" required value={form.phone} onChange={(e) => { set("phone", e.target.value); clearErr("phone"); }} error={errors.phone} placeholder="+20 100 000 0000" />
            <Input label="Date of Birth" type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            <Select
              label="Gender"
              required
              value={form.gender}
              onChange={(e) => { set("gender", e.target.value); clearErr("gender"); }}
              error={errors.gender}
              options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]}
              placeholder="Select gender"
            />
          </div>
        </div>

        {/* Physical info */}
        <div>
          <div className="text-xs font-semibold text-[#111110] mb-3 pb-1.5 border-b border-[#e4e2df]">Physical Information</div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Height (cm)" type="number" value={form.height} onChange={(e) => set("height", e.target.value)} placeholder="175" />
            <Input label="Weight (kg)" type="number" value={form.weight} onChange={(e) => set("weight", e.target.value)} placeholder="75" />
          </div>
        </div>

        {/* Membership */}
        <div>
          <div className="text-xs font-semibold text-[#111110] mb-3 pb-1.5 border-b border-[#e4e2df]">Membership Plan (optional)</div>
          <Select
            label="Plan"
            value={form.planId}
            onChange={(e) => set("planId", e.target.value)}
            options={PLANS.filter((p) => p.status === "active").map((p) => ({ value: p.id, label: `${p.name} — EGP ${p.price}` }))}
            placeholder="Select a plan (optional)"
          />
          <p className="text-[11px] text-[#9b9895] mt-1.5">A subscription record can be created after the member is added.</p>
        </div>
      </div>
    </Modal>
  );
}
