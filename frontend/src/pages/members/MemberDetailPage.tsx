import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { MEMBERS, SUBSCRIPTIONS, PAYMENTS, ATTENDANCE, BODY_MEASUREMENTS, PLANS } from "../../data/fixtures";
import { statusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { useToast } from "../../components/ui/Toast";
import { IconPlus, IconCheck, IconCalendar } from "../../components/ui/Icons";

type Tab = "overview" | "membership" | "attendance" | "payments" | "measurements";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "membership", label: "Membership" },
  { id: "attendance", label: "Attendance" },
  { id: "payments", label: "Payments" },
  { id: "measurements", label: "Body Measurements" },
];

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start py-2 border-b border-[#f5f4f2] last:border-0">
      <span className="text-[11px] text-[#9b9895] w-32 flex-shrink-0 pt-0.5 uppercase tracking-wide">{label}</span>
      <span className="text-[12px] text-[#111110] font-medium">{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center px-4 py-3 bg-[#fafaf9] rounded-lg border border-[#e5e3e0]">
      <div className="text-lg font-bold text-[#111110] tabular-nums">{value}</div>
      <div className="text-[11px] text-[#9b9895] mt-0.5">{label}</div>
    </div>
  );
}

export default function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [measureModalOpen, setMeasureModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subForm, setSubForm] = useState({ planId: "", startDate: "", autoRenew: false });
  const [measureForm, setMeasureForm] = useState({ weight: "", bodyFat: "", notes: "" });

  const member = MEMBERS.find((m) => m.id === id);
  if (!member) {
    return (
      <div className="p-6">
        <EmptyState
          title="Member not found"
          description="This member record does not exist or was removed."
          action={{ label: "Back to Members", onClick: () => navigate("/members") }}
        />
      </div>
    );
  }

  const activeSub = SUBSCRIPTIONS.find(s => s.memberId === id && s.status === "active");
  const plan = PLANS.find(p => p.id === (activeSub?.planId ?? member.planId));
  const memberPayments = PAYMENTS.filter(p => p.memberId === id);
  const memberAttendance = ATTENDANCE.filter(a => a.memberId === id);
  const memberMeasurements = [...BODY_MEASUREMENTS.filter(m => m.memberId === id)].sort((a, b) => a.date.localeCompare(b.date));
  const allSubs = SUBSCRIPTIONS.filter(s => s.memberId === id);

  const daysLeft = activeSub ? Math.ceil((new Date(activeSub.endDate).getTime() - new Date("2025-08-15").getTime()) / 86400000) : null;
  const totalVisits = memberAttendance.length;
  const totalSpent = memberPayments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  const handleCheckIn = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    toast(`${member.firstName} ${member.lastName} checked in.`);
  };

  const handleSaveSub = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setSaving(false);
    setSubModalOpen(false);
    toast("Subscription created.");
    setSubForm({ planId: "", startDate: "", autoRenew: false });
  };

  const handleSaveMeasure = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    setMeasureModalOpen(false);
    toast("Measurement recorded.");
    setMeasureForm({ weight: "", bodyFat: "", notes: "" });
  };

  return (
    <div className="p-6 max-w-[1200px] space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] text-[#9b9895]">
        <button onClick={() => navigate("/members")} className="hover:text-[#1d4ed8] transition-colors">Members</button>
        <span>/</span>
        <span className="text-[#111110] font-medium">{member.firstName} {member.lastName}</span>
      </nav>

      {/* Member header card */}
      <div className="bg-white border border-[#e5e3e0] rounded-lg p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <Avatar initials={member.avatarInitials} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[16px] font-semibold text-[#111110]">{member.firstName} {member.lastName}</h1>
              {statusBadge(member.status)}
              {daysLeft !== null && daysLeft <= 7 && (
                <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                  Expires in {daysLeft}d
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-[#6b6966]">
              <span>{member.email}</span>
              <span className="font-mono">{member.phone}</span>
              <span>DOB: {member.dob}</span>
              <span>Joined: {member.joinedAt}</span>
              {member.lastVisit && <span>Last visit: {member.lastVisit}</span>}
            </div>
            {activeSub && plan && (
              <div className="mt-2.5 flex items-center gap-2 text-[11px]">
                <span className="text-[#9b9895]">Active plan:</span>
                <span className="font-semibold text-[#111110]">{plan.name}</span>
                <span className="text-[#9b9895]">·</span>
                <span className="text-[#9b9895]">Expires {activeSub.endDate}</span>
                <span className="text-[#9b9895]">·</span>
                <span className="text-[#9b9895]">EGP {activeSub.amount.toLocaleString()}</span>
                {activeSub.autoRenew && <span className="text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded text-[10px] font-medium">Auto-renew</span>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
            <Button size="sm" variant="secondary" onClick={() => {}}>Edit</Button>
            <Button size="sm" variant="secondary" onClick={() => setMeasureModalOpen(true)}>
              <IconPlus size={12} /> Measurement
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setSubModalOpen(true)}>
              <IconCalendar size={12} /> Subscription
            </Button>
            <Button size="sm" loading={saving} onClick={handleCheckIn}>
              <IconCheck size={12} /> Check In
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-4 pt-4 border-t border-[#f5f4f2] grid grid-cols-3 sm:grid-cols-6 gap-3">
          <MiniStat label="Total visits" value={totalVisits} />
          <MiniStat label="Total spent" value={`EGP ${totalSpent.toLocaleString()}`} />
          <MiniStat label="Subscriptions" value={allSubs.length} />
          <MiniStat label="Height" value={`${member.height} cm`} />
          <MiniStat label="Weight" value={`${member.weight} kg`} />
          <MiniStat label="Gender" value={member.gender.charAt(0).toUpperCase() + member.gender.slice(1)} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e5e3e0] gap-0">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-[12px] font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-[#1d4ed8] text-[#1d4ed8]" : "border-transparent text-[#6b6966] hover:text-[#111110] hover:border-[#c9c7c3]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white border border-[#e5e3e0] rounded-lg p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9b9895] mb-3">Personal</div>
            <InfoRow label="Email" value={member.email} />
            <InfoRow label="Phone" value={<span className="font-mono">{member.phone}</span>} />
            <InfoRow label="Date of birth" value={member.dob} />
            <InfoRow label="Gender" value={<span className="capitalize">{member.gender}</span>} />
          </div>
          <div className="bg-white border border-[#e5e3e0] rounded-lg p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9b9895] mb-3">Membership</div>
            <InfoRow label="Status" value={statusBadge(member.status)} />
            <InfoRow label="Current plan" value={plan?.name ?? "—"} />
            <InfoRow label="Expires" value={activeSub?.endDate ?? "—"} />
            <InfoRow label="Auto-renew" value={activeSub?.autoRenew ? "Yes" : "No"} />
          </div>
          <div className="bg-white border border-[#e5e3e0] rounded-lg p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9b9895] mb-3">Activity</div>
            <InfoRow label="Joined" value={member.joinedAt} />
            <InfoRow label="Last visit" value={member.lastVisit ?? "Never"} />
            <InfoRow label="Total visits" value={totalVisits} />
            <InfoRow label="Total paid" value={<span className="font-mono">EGP {totalSpent.toLocaleString()}</span>} />
          </div>
        </div>
      )}

      {/* Membership tab */}
      {tab === "membership" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setSubModalOpen(true)}>
              <IconPlus size={12} /> New Subscription
            </Button>
          </div>
          <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
            {allSubs.length === 0 ? (
              <EmptyState title="No subscriptions" description="Create a subscription to assign a membership plan." action={{ label: "Create Subscription", onClick: () => setSubModalOpen(true) }} />
            ) : (
              <table className="w-full">
                <thead><tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                  <th className="text-left px-4 py-2.5">Plan</th>
                  <th className="text-left px-4 py-2.5">Start Date</th>
                  <th className="text-left px-4 py-2.5">End Date</th>
                  <th className="text-left px-4 py-2.5">Amount</th>
                  <th className="text-left px-4 py-2.5">Status</th>
                  <th className="text-left px-4 py-2.5">Auto-renew</th>
                </tr></thead>
                <tbody className="divide-y divide-[#f5f4f2]">
                  {allSubs.map(s => (
                    <tr key={s.id} className="hover:bg-[#fafaf9]">
                      <td className="px-4 py-2.5 text-[13px] font-medium text-[#111110]">{s.planName}</td>
                      <td className="px-4 py-2.5 text-xs text-[#6b6966]">{s.startDate}</td>
                      <td className="px-4 py-2.5 text-xs text-[#6b6966]">{s.endDate}</td>
                      <td className="px-4 py-2.5 text-xs font-mono">EGP {s.amount.toLocaleString()}</td>
                      <td className="px-4 py-2.5">{statusBadge(s.status)}</td>
                      <td className="px-4 py-2.5 text-xs text-[#6b6966]">{s.autoRenew ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Attendance tab */}
      {tab === "attendance" && (
        <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
          {memberAttendance.length === 0 ? (
            <EmptyState title="No attendance records" description="No check-in history for this member." />
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5">Date</th>
                <th className="text-left px-4 py-2.5">Check-in</th>
                <th className="text-left px-4 py-2.5">Check-out</th>
                <th className="text-left px-4 py-2.5">Duration</th>
                <th className="text-left px-4 py-2.5">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#f5f4f2]">
                {memberAttendance.map(a => {
                  const dur = a.checkOut
                    ? (() => { const m = Math.round((new Date(`2000-01-01 ${a.checkOut}`).getTime() - new Date(`2000-01-01 ${a.checkIn}`).getTime()) / 60000); return `${Math.floor(m/60)}h ${m%60}m`; })()
                    : null;
                  return (
                    <tr key={a.id} className="hover:bg-[#fafaf9]">
                      <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{a.date}</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono text-[#111110]">{a.checkIn}</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono text-[#6b6966]">{a.checkOut ?? <span className="text-green-600">Active</span>}</td>
                      <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{dur ?? "—"}</td>
                      <td className="px-4 py-2.5">{!a.checkOut ? <span className="text-[11px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-medium">Active</span> : <span className="text-[11px] text-[#9b9895]">Completed</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Payments tab */}
      {tab === "payments" && (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button size="sm">Record Payment</Button>
          </div>
          <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
            {memberPayments.length === 0 ? (
              <EmptyState title="No payment records" description="No payments have been recorded for this member." />
            ) : (
              <table className="w-full">
                <thead><tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                  <th className="text-left px-4 py-2.5">Date</th>
                  <th className="text-left px-4 py-2.5">Amount</th>
                  <th className="text-left px-4 py-2.5">Method</th>
                  <th className="text-left px-4 py-2.5">Status</th>
                  <th className="text-left px-4 py-2.5">Notes</th>
                </tr></thead>
                <tbody className="divide-y divide-[#f5f4f2]">
                  {memberPayments.map(p => (
                    <tr key={p.id} className="hover:bg-[#fafaf9]">
                      <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{p.date}</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono font-semibold text-[#111110]">EGP {p.amount.toLocaleString()}</td>
                      <td className="px-4 py-2.5 text-[12px] text-[#6b6966] capitalize">{p.method.replace("_", " ")}</td>
                      <td className="px-4 py-2.5">{statusBadge(p.status)}</td>
                      <td className="px-4 py-2.5 text-[12px] text-[#9b9895]">{p.notes ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Body Measurements tab */}
      {tab === "measurements" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setMeasureModalOpen(true)}>
              <IconPlus size={12} /> Add Measurement
            </Button>
          </div>
          {memberMeasurements.length > 1 && (
            <div className="bg-white border border-[#e5e3e0] rounded-lg p-4">
              <div className="text-[12px] font-semibold text-[#111110] mb-4">Weight Trend (kg)</div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={memberMeasurements} margin={{ top: 4, right: 16, left: -22, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f5f4f2" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e5e3e0", borderRadius: 6, background: "white" }} />
                  <Line type="monotone" dataKey="weight" stroke="#1d4ed8" strokeWidth={1.75} dot={{ r: 3, fill: "#1d4ed8" }} name="Weight (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="bg-white border border-[#e5e3e0] rounded-lg overflow-hidden">
            {memberMeasurements.length === 0 ? (
              <EmptyState title="No measurements recorded" description="Body measurements have not been recorded for this member." action={{ label: "Add Measurement", onClick: () => setMeasureModalOpen(true) }} />
            ) : (
              <table className="w-full">
                <thead><tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                  <th className="text-left px-4 py-2.5">Date</th>
                  <th className="text-left px-4 py-2.5">Weight</th>
                  <th className="text-left px-4 py-2.5">Body Fat %</th>
                  <th className="text-left px-4 py-2.5">BMI</th>
                  <th className="text-left px-4 py-2.5">Notes</th>
                  <th className="px-4 py-2.5"></th>
                </tr></thead>
                <tbody className="divide-y divide-[#f5f4f2]">
                  {[...memberMeasurements].reverse().map(m => (
                    <tr key={m.id} className="hover:bg-[#fafaf9]">
                      <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.date}</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono">{m.weight} kg</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono">{m.bodyFat != null ? `${m.bodyFat}%` : "—"}</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono">{m.bmi ?? "—"}</td>
                      <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.notes ?? "—"}</td>
                      <td className="px-4 py-2.5 flex gap-2">
                        <button className="text-[11px] text-[#1d4ed8] hover:underline">Edit</button>
                        <button className="text-[11px] text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Create subscription modal */}
      <Modal open={subModalOpen} onClose={() => setSubModalOpen(false)} title="Create Subscription"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSubModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSub} loading={saving}>Create Subscription</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="bg-[#fafaf9] border border-[#e5e3e0] rounded-md px-3 py-2.5 flex items-center gap-2.5">
            <Avatar initials={member.avatarInitials} size="sm" />
            <span className="text-[13px] font-medium text-[#111110]">{member.firstName} {member.lastName}</span>
          </div>
          <Select
            label="Membership Plan"
            required
            value={subForm.planId}
            onChange={e => setSubForm(f => ({ ...f, planId: e.target.value }))}
            options={PLANS.filter(p => p.status === "active").map(p => ({ value: p.id, label: `${p.name} — EGP ${p.price} / ${p.durationDays}d` }))}
            placeholder="Select a plan"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Date" type="date" required value={subForm.startDate} onChange={e => setSubForm(f => ({ ...f, startDate: e.target.value }))} />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#111110]">Auto-renew</label>
              <div className="flex items-center gap-2 h-8">
                <input type="checkbox" id="ar" checked={subForm.autoRenew} onChange={e => setSubForm(f => ({ ...f, autoRenew: e.target.checked }))} className="w-4 h-4 accent-[#1d4ed8]" />
                <label htmlFor="ar" className="text-xs text-[#6b6966]">Enable auto-renewal</label>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Add measurement modal */}
      <Modal open={measureModalOpen} onClose={() => setMeasureModalOpen(false)} title="Add Body Measurement"
        footer={
          <>
            <Button variant="secondary" onClick={() => setMeasureModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveMeasure} loading={saving}>Save Measurement</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Weight (kg)" required type="number" placeholder="82" value={measureForm.weight} onChange={e => setMeasureForm(f => ({ ...f, weight: e.target.value }))} />
            <Input label="Body Fat %" type="number" placeholder="18.5" value={measureForm.bodyFat} onChange={e => setMeasureForm(f => ({ ...f, bodyFat: e.target.value }))} />
          </div>
          <Input label="Notes" placeholder="Optional — e.g. starting new program" value={measureForm.notes} onChange={e => setMeasureForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
