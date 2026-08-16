import { GYMS } from "../data/fixtures";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";

const SAAS_PLANS = [
  { name: "Trial", price: 0, maxMembers: 50, features: ["Basic features", "30-day trial"] },
  { name: "Starter", price: 299, maxMembers: 200, features: ["All basic features", "Email support"] },
  { name: "Professional", price: 699, maxMembers: 1000, features: ["All features", "Priority support", "Analytics"] },
];

export default function SaasSubscriptionsPage() {
  return (
    <div className="p-6 max-w-[1200px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-[#111110]">SaaS Subscriptions</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">Platform subscription management for gym accounts</p>
        </div>
      </div>

      {/* SaaS Plans overview */}
      <div>
        <div className="text-xs font-semibold text-[#111110] mb-3">Platform Plans</div>
        <div className="grid grid-cols-3 gap-3">
          {SAAS_PLANS.map((plan) => (
            <div key={plan.name} className="bg-white border border-[#e4e2df] rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="text-sm font-semibold text-[#111110]">{plan.name}</div>
                <div className="text-xs font-mono font-medium text-[#1d4ed8]">{plan.price === 0 ? "Free" : `EGP ${plan.price}/mo`}</div>
              </div>
              <div className="text-xs text-[#9b9895] mb-2">Up to {plan.maxMembers} members</div>
              <div className="space-y-1">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-[#6b6966]">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-green-500"><path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
        <div className="bg-white border border-[#e4e2df] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e4e2df] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5">Gym</th>
                <th className="text-left px-4 py-2.5">Plan</th>
                <th className="text-left px-4 py-2.5">Members</th>
                <th className="text-left px-4 py-2.5">Status</th>
                <th className="text-left px-4 py-2.5">Since</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {GYMS.map((g, i) => (
                <tr key={g.id} className={`border-b border-[#f5f4f2] hover:bg-[#fafaf9] ${i === GYMS.length - 1 ? "border-0" : ""}`}>
                  <td className="px-4 py-2.5">
                    <div className="text-sm font-medium text-[#111110]">{g.name}</div>
                    <div className="text-[11px] text-[#9b9895]">{g.city}</div>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-[#6b6966]">{g.subscription}</td>
                  <td className="px-4 py-2.5 text-xs font-medium text-[#111110]">{g.memberCount}</td>
                  <td className="px-4 py-2.5">{statusBadge(g.status)}</td>
                  <td className="px-4 py-2.5 text-xs text-[#6b6966]">{g.createdAt}</td>
                  <td className="px-4 py-2.5">
                    <Button size="sm" variant="secondary">Manage</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
