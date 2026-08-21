// src/pages/GymProfilePage.tsx
import { useState, useEffect } from "react";
import { statusBadge } from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { DashboardSkeleton } from "../components/ui/Skeleton";
import { useAuth } from "../App";
import { gyms } from "../api/gyms";
import { members } from "../api/members";
import { staff as staffApi } from "../api/staff";

export default function GymProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gym, setGym] = useState<any>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (user.gym_id) {
          const [gymData, membersData, staffData] = await Promise.allSettled([
            gyms.getGym(user.gym_id),
            members.getMembers(),
            staffApi.getStaff(),
          ]);
          if (gymData.status === 'fulfilled') setGym(gymData.value);
          if (membersData.status === 'fulfilled') setMemberCount((membersData.value as any[]).filter((m: any) => m.status === 'active').length);
          if (staffData.status === 'fulfilled') setStaffCount((staffData.value as any[]).length);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.gym_id]);

  if (loading) return <div className="p-6"><DashboardSkeleton /></div>;

  if (!gym) {
    return (
      <div className="p-6 max-w-[900px] animate-fade-in">
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          {error || "Gym profile not available. Contact your admin."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[900px] space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-bold text-[#111110]">{gym.name}</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">Gym profile and operational information</p>
        </div>
        <Button size="sm" variant="secondary">Edit Profile</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Members", value: memberCount },
          { label: "Staff", value: staffCount },
          { label: "Status", value: gym.status?.charAt(0).toUpperCase() + gym.status?.slice(1) },
          { label: "Owner", value: gym.owner_name },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-[#e5e3e0] rounded-xl px-4 py-3 hover:shadow-md hover:shadow-black/[0.03] transition-all">
            <div className="text-xs text-[#9b9895]">{stat.label}</div>
            <div className="text-xl font-semibold text-[#111110] mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#e5e3e0] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#111110] mb-3 pb-2 border-b border-[#e5e3e0]">Contact Information</div>
          <div className="space-y-2.5">
            {[
              ["Owner", gym.owner_name],
              ["Email", gym.email],
              ["Phone", gym.phone ?? '—'],
              ["Address", gym.address ?? '—'],
            ].map(([label, value]) => (
              <div key={label as string} className="flex">
                <span className="text-xs text-[#9b9895] w-20 flex-shrink-0">{label}</span>
                <span className="text-xs text-[#111110] font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#e5e3e0] rounded-xl p-5">
          <div className="text-xs font-semibold text-[#111110] mb-3 pb-2 border-b border-[#e5e3e0]">Gym Status</div>
          <div className="space-y-2.5">
            {[
              ["Status", ""],
              ["Created", gym.created_at ? new Date(gym.created_at).toLocaleDateString() : '—'],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center">
                <span className="text-xs text-[#9b9895] w-28 flex-shrink-0">{label}</span>
                {label === "Status" ? statusBadge(gym.status) : <span className="text-xs text-[#111110] font-medium">{value}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
