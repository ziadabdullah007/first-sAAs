// src/pages/UsersPage.tsx
import { useState, useEffect } from "react";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { TableSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import apiClient from "../api/axiosClient";
import { ROLE_LABELS } from "../types";

const roleBadge: Record<string, "danger" | "info" | "neutral"> = {
  super_admin: "danger",
  gym_admin: "info",
  staff: "neutral",
  owner: "info",
};

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to load users from backend — fall back to empty state
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // The backend doesn't have a dedicated /users endpoint yet
        // This will gracefully show empty state
        const response = await apiClient.get('/users');
        setUsers(response.data);
      } catch {
        // Expected — endpoint may not exist yet
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-[900px] space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[16px] font-bold text-[#111110]">Users</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">Platform user accounts and roles</p>
        </div>
        <Button>Invite User</Button>
      </div>

      <div className="bg-white border border-[#e5e3e0] rounded-xl overflow-hidden">
        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : users.length === 0 ? (
          <EmptyState
            title="No users yet"
            description="Users will appear here once they register or are invited."
          />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e3e0] bg-[#fafaf9]">
                <th className="text-left px-4 py-2.5">User</th>
                <th className="text-left px-4 py-2.5">Email</th>
                <th className="text-left px-4 py-2.5">Role</th>
                <th className="text-left px-4 py-2.5">Gym</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any, i: number) => {
                const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email || 'User';
                const initials = u.first_name ? `${u.first_name[0]}${(u.last_name || '')[0] || ''}`.toUpperCase() : 'U';
                return (
                  <tr key={u.id} className={`border-b border-[#f5f4f2] hover:bg-[#fafaf9] ${i === users.length - 1 ? "border-0" : ""}`}>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={initials} size="sm" />
                        <span className="text-sm font-medium text-[#111110]">{name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[#6b6966]">{u.email}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant={roleBadge[u.role] || "neutral"}>{ROLE_LABELS[u.role] || u.role}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[#6b6966]">{u.gym_id ? 'Assigned' : <span className="text-[#9b9895]">Platform-wide</span>}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-2">
                        <button className="text-xs text-[#1d4ed8] hover:underline">Edit</button>
                        <button className="text-xs text-red-600 hover:underline">Revoke</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
