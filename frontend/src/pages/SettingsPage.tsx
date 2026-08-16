import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useToast } from "../components/ui/Toast";

export default function SettingsPage() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [gymName, setGymName] = useState("Elite Fitness Center");
  const [email, setEmail] = useState("info@elitefit.eg");
  const [phone, setPhone] = useState("+20 100 234 5678");
  const [address, setAddress] = useState("24 Corniche El-Nil, Cairo");

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast("Settings saved.");
  };

  return (
    <div className="p-6 max-w-[700px] space-y-6">
      <div>
        <h1 className="text-base font-semibold text-[#111110]">Settings</h1>
        <p className="text-xs text-[#9b9895] mt-0.5">Manage gym profile and preferences</p>
      </div>

      {/* Gym Profile */}
      <div className="bg-white border border-[#e4e2df] rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e4e2df] bg-[#fafaf9]">
          <div className="text-xs font-semibold text-[#111110]">Gym Profile</div>
        </div>
        <div className="p-5 space-y-3">
          <Input label="Gym Name" value={gymName} onChange={(e) => setGymName(e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Contact Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="px-5 py-3 border-t border-[#e4e2df] bg-[#fafaf9] flex justify-end">
          <Button size="sm" onClick={handleSave} loading={saving}>Save Changes</Button>
        </div>
      </div>

      {/* Notification preferences */}
      <div className="bg-white border border-[#e4e2df] rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e4e2df] bg-[#fafaf9]">
          <div className="text-xs font-semibold text-[#111110]">Notifications</div>
        </div>
        <div className="p-5 space-y-3">
          {[
            ["Membership expiry alerts", "7 days before expiration"],
            ["Payment due reminders", "When a payment is overdue"],
            ["New member registrations", "When a new member is added"],
          ].map(([label, desc]) => (
            <div key={label} className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-medium text-[#111110]">{label}</div>
                <div className="text-[11px] text-[#9b9895]">{desc}</div>
              </div>
              <div className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#1d4ed8]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
        <div className="px-5 py-3.5 border-b border-red-200 bg-red-50">
          <div className="text-xs font-semibold text-red-700">Danger Zone</div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-medium text-[#111110]">Deactivate Gym</div>
              <div className="text-[11px] text-[#9b9895]">Suspends access for all staff and members. This action is reversible.</div>
            </div>
            <Button variant="danger" size="sm">Deactivate</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
