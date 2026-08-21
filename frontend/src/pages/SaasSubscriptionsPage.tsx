// src/pages/SaasSubscriptionsPage.tsx
import { useState, useEffect } from "react";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { TableSkeleton } from "../components/ui/Skeleton";
import { gyms } from "../api/gyms";

const SAAS_PLANS = [
  { name: "Trial", price: 0, maxMembers: 50, features: ["Basic features", "30-day trial"] },
  { name: "Starter", price: 299, maxMembers: 200, features: ["All basic features", "Email support"] },
  { name: "Professional", price: 699, maxMembers: 1000, features: ["All features", "Priority support", "Analytics"] },
];

export default function SaasSubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [gymsList, setGymsList] = useState<any[]>([]);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoading(true);
        const data = await gyms.getGyms();
        setGymsList(data);
      } catch {
        setGymsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGyms();
  }, []);

  return (
    <div className="p-6 max-w-[1200px] space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-bold text-[#111110]">SaaS Subscriptions</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">Platform subscription management for gym accounts</p>
        </div>
      </div>

      {/* SaaS Plans overview */}
      <div>
        <div className="text-xs font-semibold text-[#111110] mb-3">Platform Plans</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAAS_PLANS.map((plan) => (
            <div key={plan.name} className="bg-white border border-[#e5e3e0] rounded-xl p-5 hover:shadow-md hover:shadow-black/[0.03] hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm font-semibold text-[#111110]">{plan.name}</div>
                <div className="text-xs font-mono font-medium text-[#1d4ed8]">{plan.price === 0 ? "Free" : `EGP ${plan.price}/mo`}</div>
              </div>
              <div className="text-xs text-[#9b9895] mb-3">Up to {plan.maxMembers} members</div>
              <div className="space-y-1.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-[#6b6966]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-green-500 flex-shrink-0"><path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gym subscriptions table */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold text-[#111110]">Gym Subscriptions</div>
        </div>
        <div className="bg-white border border-[#e5e3e0] rounded-xl overflow-hidden">
          {loading ? (
            <TableSkeleton rows={4} cols={5} />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                  <th className="text-left px-4 py-2.5">Gym</th>
                  <th className="text-left px-4 py-2.5">Email</th>
                  <th className="text-left px-4 py-2.5">Status</th>
                  <th className="text-left px-4 py-2.5">Created</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {gymsList.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-sm text-[#9b9895]">No gyms found</td></tr>
                ) : gymsList.map((g, i) => (
                  <tr key={g.id} className={`border-b border-[#f5f4f2] hover:bg-[#fafaf9] ${i === gymsList.length - 1 ? "border-0" : ""}`}>
                    <td className="px-4 py-2.5">
                      <div className="text-sm font-medium text-[#111110]">{g.name}</div>
                      <div className="text-[11px] text-[#9b9895]">{g.owner_name}</div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[#6b6966]">{g.email}</td>
                    <td className="px-4 py-2.5">{statusBadge(g.status)}</td>
                    <td className="px-4 py-2.5 text-xs text-[#6b6966]">{g.created_at ? new Date(g.created_at).toLocaleDateString() : '—'}</td>
                    <td className="px-4 py-2.5">
                      <Button size="sm" variant="secondary">Manage</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
