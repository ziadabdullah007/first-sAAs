import { GYMS, MEMBERS, STAFF } from "../data/fixtures";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";

export default function GymProfilePage() {
  const gym = GYMS[0];
  const activeMembers = MEMBERS.filter(m => m.status === "active").length;
  const activeStaff = STAFF.filter(s => s.gymId === gym.id && s.status === "active").length;

  return (
    <div className="p-6 max-w-[900px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-[#111110]">{gym.name}</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">Gym profile and operational information</p>
        </div>
        <Button size="sm" variant="secondary">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Members", value: gym.memberCount },
          { label: "Active Members", value: activeMembers },
          { label: "Staff", value: activeStaff },
          { label: "Status", value: gym.status.charAt(0).toUpperCase() + gym.status.slice(1) },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e4e2df] rounded-lg px-4 py-3">
            <div className="text-xs text-[#9b9895]">{stat.label}</div>
            <div className="text-xl font-semibold text-[#111110] mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-[#e4e2df] rounded-lg p-5">
          <div className="text-xs font-semibold text-[#111110] mb-3 pb-2 border-b border-[#e4e2df]">Contact Information</div>
          <div className="space-y-2.5">
            {[
              ["Owner", gym.owner],
              ["Admin", gym.adminName],
              ["Email", gym.email],
              ["Phone", gym.phone],
              ["Address", gym.address],
              ["City", gym.city],
            ].map(([label, value]) => (
              <div key={label} className="flex">
                <span className="text-xs text-[#9b9895] w-20 flex-shrink-0">{label}</span>
                <span className="text-xs text-[#111110] font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e4e2df] rounded-lg p-5">
          <div className="text-xs font-semibold text-[#111110] mb-3 pb-2 border-b border-[#e4e2df]">SaaS Subscription</div>
          <div className="space-y-2.5">
            {[
              ["Plan", gym.subscription],
              ["Status", ""],
              ["Created", gym.createdAt],
              ["Max Members", "Unlimited"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center">
                <span className="text-xs text-[#9b9895] w-28 flex-shrink-0">{label}</span>
                {label === "Status" ? statusBadge("active") : <span className="text-xs text-[#111110] font-medium">{value}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
