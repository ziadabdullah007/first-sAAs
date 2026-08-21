// src/pages/members/MemberDetailPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { statusBadge } from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Avatar from "../../components/ui/Avatar";
import EmptyState from "../../components/ui/EmptyState";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import { useToast } from "../../components/ui/Toast";
import { IconPlus, IconCheck, IconCalendar } from "../../components/ui/Icons";
import { members } from "../../api/members";
import { subscriptions } from "../../api/subscriptions";
import { payments } from "../../api/payments";
import { attendance } from "../../api/attendance";
import { measurements } from "../../api/measurements";
import { plans } from "../../api/plans";

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
    <div className="text-center px-4 py-3 bg-[#fafaf9] rounded-xl border border-[#e5e3e0]">
      <div className="text-lg font-bold text-[#111110] tabular-nums">{value}</div>
      <div className="text-[11px] text-[#9b9895] mt-0.5">{label}</div>
    </div>
  );
}

const fmtDate = (d: string | null | undefined) => {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
};

const fmtTime = (d: string | null | undefined) => {
  if (!d) return null;
  try { return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch { return d; }
};

export default function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [measureModalOpen, setMeasureModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [subForm, setSubForm] = useState({ planId: "", startDate: "", autoRenew: false });
  const [measureForm, setMeasureForm] = useState({ weight: "", bodyFat: "", notes: "" });

  // Data from API
  const [member, setMember] = useState<any>(null);
  const [memberSubs, setMemberSubs] = useState<any[]>([]);
  const [memberPayments, setMemberPayments] = useState<any[]>([]);
  const [memberAttendance, setMemberAttendance] = useState<any[]>([]);
  const [memberMeasurements, setMemberMeasurements] = useState<any[]>([]);
  const [plansList, setPlansList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [memberData, subsData, paysData, attData, measData, plansData] = await Promise.allSettled([
          members.getMember(id),
          subscriptions.getSubscriptions(),
          payments.getPayments(),
          attendance.getMemberAttendance(id),
          measurements.getMemberMeasurements(id),
          plans.getPlans(),
        ]);
        if (memberData.status === 'fulfilled') setMember(memberData.value);
        else throw new Error('Member not found');
        if (subsData.status === 'fulfilled') setMemberSubs((subsData.value as any[]).filter(s => s.member_id === id));
        if (paysData.status === 'fulfilled') setMemberPayments((paysData.value as any[]).filter(p => p.member_id === id));
        if (attData.status === 'fulfilled') setMemberAttendance(attData.value as any[]);
        if (measData.status === 'fulfilled') setMemberMeasurements(measData.value as any[]);
        if (plansData.status === 'fulfilled') setPlansList(plansData.value as any[]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="p-6"><DashboardSkeleton /></div>;

  if (!member || error) {
    return (
      <div className="p-6">
        <EmptyState
          title="Member not found"
          description={error || "This member record does not exist or was removed."}
          action={{ label: "Back to Members", onClick: () => navigate("/members") }}
        />
      </div>
    );
  }

  const initials = `${(member.first_name || '')[0] || ''}${(member.last_name || '')[0] || ''}`.toUpperCase();
  const activeSub = memberSubs.find(s => s.status === "active");
  const plan = plansList.find(p => p.id === activeSub?.plan_id);
  const totalVisits = memberAttendance.length;
  const totalSpent = memberPayments.filter(p => p.status === "completed" || p.status === "paid").reduce((s, p) => s + (p.amount || 0), 0);

  const handleCheckIn = async () => {
    setSaving(true);
    try {
      await attendance.checkIn({ member_id: member.id });
      toast(`${member.first_name} ${member.last_name} checked in.`);
    } catch (err: any) {
      toast(err.message || "Check-in failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSub = async () => {
    if (!subForm.planId || !subForm.startDate) {
      toast("Select a plan and start date.", "error");
      return;
    }
    setSaving(true);
    try {
      const selectedPlan = plansList.find(p => p.id === subForm.planId);
      const startDate = new Date(subForm.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + (selectedPlan?.duration_months || 1));

      await subscriptions.createSubscription({
        member_id: member.id,
        plan_id: subForm.planId,
        start_date: subForm.startDate,
        end_date: endDate.toISOString().split('T')[0],
        amount: selectedPlan?.price || 0,
        auto_renew: subForm.autoRenew,
      });
      toast("Subscription created.");
      setSubModalOpen(false);
      setSubForm({ planId: "", startDate: "", autoRenew: false });
    } catch (err: any) {
      toast(err.message || "Failed to create subscription", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMeasure = async () => {
    if (!measureForm.weight) {
      toast("Weight is required.", "error");
      return;
    }
    setSaving(true);
    try {
      await measurements.createMeasurement({
        member_id: member.id,
        weight: parseFloat(measureForm.weight),
        body_fat_percentage: measureForm.bodyFat ? parseFloat(measureForm.bodyFat) : undefined,
        notes: measureForm.notes || undefined,
      });
      toast("Measurement recorded.");
      setMeasureModalOpen(false);
      setMeasureForm({ weight: "", bodyFat: "", notes: "" });
    } catch (err: any) {
      toast(err.message || "Failed to save measurement", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-[1200px] space-y-4 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[11px] text-[#9b9895]">
        <button onClick={() => navigate("/members")} className="hover:text-[#1d4ed8] transition-colors">Members</button>
        <span>/</span>
        <span className="text-[#111110] font-medium">{member.first_name} {member.last_name}</span>
      </nav>

      {/* Member header card */}
      <div className="bg-white border border-[#e5e3e0] rounded-xl p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <Avatar initials={initials} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-[16px] font-bold text-[#111110]">{member.first_name} {member.last_name}</h1>
              {statusBadge(member.status)}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-[#6b6966]">
              {member.email && <span>{member.email}</span>}
              <span className="font-mono">{member.phone}</span>
              {member.date_of_birth && <span>DOB: {fmtDate(member.date_of_birth)}</span>}
              <span>Joined: {fmtDate(member.joined_at)}</span>
              {member.last_visit_at && <span>Last visit: {fmtDate(member.last_visit_at)}</span>}
            </div>
            {activeSub && plan && (
              <div className="mt-2.5 flex items-center gap-2 text-[11px]">
                <span className="text-[#9b9895]">Active plan:</span>
                <span className="font-semibold text-[#111110]">{plan.name}</span>
                <span className="text-[#9b9895]">·</span>
                <span className="text-[#9b9895]">Expires {fmtDate(activeSub.end_date)}</span>
                <span className="text-[#9b9895]">·</span>
                <span className="text-[#9b9895]">EGP {activeSub.amount?.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
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
          <MiniStat label="Subscriptions" value={memberSubs.length} />
          <MiniStat label="Height" value={member.height ? `${member.height} cm` : "—"} />
          <MiniStat label="Weight" value={member.weight ? `${member.weight} kg` : "—"} />
          <MiniStat label="Gender" value={member.gender ? member.gender.charAt(0).toUpperCase() + member.gender.slice(1) : "—"} />
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
          <div className="bg-white border border-[#e5e3e0] rounded-xl p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9b9895] mb-3">Personal</div>
            <InfoRow label="Email" value={member.email || "—"} />
            <InfoRow label="Phone" value={<span className="font-mono">{member.phone}</span>} />
            <InfoRow label="Date of birth" value={fmtDate(member.date_of_birth)} />
            <InfoRow label="Gender" value={<span className="capitalize">{member.gender || "—"}</span>} />
          </div>
          <div className="bg-white border border-[#e5e3e0] rounded-xl p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9b9895] mb-3">Membership</div>
            <InfoRow label="Status" value={statusBadge(member.status)} />
            <InfoRow label="Current plan" value={plan?.name ?? "—"} />
            <InfoRow label="Expires" value={activeSub ? fmtDate(activeSub.end_date) : "—"} />
            <InfoRow label="Auto-renew" value={activeSub?.auto_renew ? "Yes" : "No"} />
          </div>
          <div className="bg-white border border-[#e5e3e0] rounded-xl p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#9b9895] mb-3">Activity</div>
            <InfoRow label="Joined" value={fmtDate(member.joined_at)} />
            <InfoRow label="Last visit" value={fmtDate(member.last_visit_at)} />
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
          <div className="bg-white border border-[#e5e3e0] rounded-xl overflow-hidden">
            {memberSubs.length === 0 ? (
              <EmptyState title="No subscriptions" description="Create a subscription to assign a membership plan." action={{ label: "Create Subscription", onClick: () => setSubModalOpen(true) }} />
            ) : (
              <table className="w-full">
                <thead><tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                  <th className="text-left px-4 py-2.5">Plan</th>
                  <th className="text-left px-4 py-2.5">Start Date</th>
                  <th className="text-left px-4 py-2.5">End Date</th>
                  <th className="text-left px-4 py-2.5">Amount</th>
                  <th className="text-left px-4 py-2.5">Status</th>
                </tr></thead>
                <tbody className="divide-y divide-[#f5f4f2]">
                  {memberSubs.map(s => (
                    <tr key={s.id} className="hover:bg-[#fafaf9]">
                      <td className="px-4 py-2.5 text-[13px] font-medium text-[#111110]">{plansList.find(p => p.id === s.plan_id)?.name || s.plan_id}</td>
                      <td className="px-4 py-2.5 text-xs text-[#6b6966]">{fmtDate(s.start_date)}</td>
                      <td className="px-4 py-2.5 text-xs text-[#6b6966]">{fmtDate(s.end_date)}</td>
                      <td className="px-4 py-2.5 text-xs font-mono">EGP {(s.amount || 0).toLocaleString()}</td>
                      <td className="px-4 py-2.5">{statusBadge(s.status)}</td>
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
        <div className="bg-white border border-[#e5e3e0] rounded-xl overflow-hidden">
          {memberAttendance.length === 0 ? (
            <EmptyState title="No attendance records" description="No check-in history for this member." />
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5">Date</th>
                <th className="text-left px-4 py-2.5">Check-in</th>
                <th className="text-left px-4 py-2.5">Check-out</th>
                <th className="text-left px-4 py-2.5">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#f5f4f2]">
                {memberAttendance.map(a => (
                  <tr key={a.id} className="hover:bg-[#fafaf9]">
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{fmtDate(a.check_in_time)}</td>
                    <td className="px-4 py-2.5 text-[12px] font-mono text-[#111110]">{fmtTime(a.check_in_time)}</td>
                    <td className="px-4 py-2.5 text-[12px] font-mono text-[#6b6966]">{a.check_out_time ? fmtTime(a.check_out_time) : <span className="text-green-600">Active</span>}</td>
                    <td className="px-4 py-2.5">{!a.check_out_time ? <span className="text-[11px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-medium">Active</span> : <span className="text-[11px] text-[#9b9895]">Completed</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Payments tab */}
      {tab === "payments" && (
        <div className="bg-white border border-[#e5e3e0] rounded-xl overflow-hidden">
          {memberPayments.length === 0 ? (
            <EmptyState title="No payment records" description="No payments have been recorded for this member." />
          ) : (
            <table className="w-full">
              <thead><tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5">Date</th>
                <th className="text-left px-4 py-2.5">Amount</th>
                <th className="text-left px-4 py-2.5">Method</th>
                <th className="text-left px-4 py-2.5">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#f5f4f2]">
                {memberPayments.map(p => (
                  <tr key={p.id} className="hover:bg-[#fafaf9]">
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{fmtDate(p.payment_date)}</td>
                    <td className="px-4 py-2.5 text-[12px] font-mono font-semibold text-[#111110]">EGP {(p.amount || 0).toLocaleString()}</td>
                    <td className="px-4 py-2.5 text-[12px] text-[#6b6966] capitalize">{(p.payment_method || '').replace("_", " ")}</td>
                    <td className="px-4 py-2.5">{statusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
            <div className="bg-white border border-[#e5e3e0] rounded-xl p-4">
              <div className="text-[12px] font-semibold text-[#111110] mb-4">Weight Trend (kg)</div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={memberMeasurements} margin={{ top: 4, right: 16, left: -22, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f5f4f2" />
                  <XAxis dataKey="measured_at" tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} tickFormatter={d => fmtDate(d)} />
                  <YAxis tick={{ fontSize: 10, fill: "#9b9895" }} axisLine={false} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
                  <Tooltip contentStyle={{ fontSize: 11, border: "1px solid #e5e3e0", borderRadius: 8, background: "white" }} />
                  <Line type="monotone" dataKey="weight" stroke="#1d4ed8" strokeWidth={1.75} dot={{ r: 3, fill: "#1d4ed8" }} name="Weight (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <div className="bg-white border border-[#e5e3e0] rounded-xl overflow-hidden">
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
                </tr></thead>
                <tbody className="divide-y divide-[#f5f4f2]">
                  {[...memberMeasurements].reverse().map(m => (
                    <tr key={m.id} className="hover:bg-[#fafaf9]">
                      <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{fmtDate(m.measured_at)}</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono">{m.weight != null ? `${m.weight} kg` : "—"}</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono">{m.body_fat_percentage != null ? `${m.body_fat_percentage}%` : "—"}</td>
                      <td className="px-4 py-2.5 text-[12px] font-mono">{m.bmi ?? "—"}</td>
                      <td className="px-4 py-2.5 text-[12px] text-[#6b6966]">{m.notes ?? "—"}</td>
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
        footer={<>
          <Button variant="secondary" onClick={() => setSubModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveSub} loading={saving}>Create Subscription</Button>
        </>}
      >
        <div className="space-y-3">
          <div className="bg-[#fafaf9] border border-[#e5e3e0] rounded-lg px-3 py-2.5 flex items-center gap-2.5">
            <Avatar initials={initials} size="sm" />
            <span className="text-[13px] font-medium text-[#111110]">{member.first_name} {member.last_name}</span>
          </div>
          <Select
            label="Membership Plan"
            required
            value={subForm.planId}
            onChange={e => setSubForm(f => ({ ...f, planId: e.target.value }))}
            options={plansList.filter(p => p.status === "active").map(p => ({ value: p.id, label: `${p.name} — EGP ${p.price} / ${p.duration_months}mo` }))}
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
        footer={<>
          <Button variant="secondary" onClick={() => setMeasureModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMeasure} loading={saving}>Save Measurement</Button>
        </>}
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
