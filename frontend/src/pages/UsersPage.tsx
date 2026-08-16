import { DEMO_USERS } from "../data/fixtures";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  gym_admin: "Gym Admin",
  staff: "Staff",
};

const roleBadge: Record<string, "danger" | "info" | "neutral"> = {
  super_admin: "danger",
  gym_admin: "info",
  staff: "neutral",
};

export default function UsersPage() {
  return (
    <div className="p-6 max-w-[900px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-[#111110]">Users</h1>
          <p className="text-xs text-[#9b9895] mt-0.5">Platform user accounts and roles</p>
        </div>
        <Button>Invite User</Button>
      </div>

      <div className="bg-white border border-[#e4e2df] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e4e2df] bg-[#fafaf9]">
              <th className="text-left px-4 py-2.5">User</th>
              <th className="text-left px-4 py-2.5">Email</th>
              <th className="text-left px-4 py-2.5">Role</th>
              <th className="text-left px-4 py-2.5">Gym</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody>
            {DEMO_USERS.map((u, i) => (
              <tr key={u.id} className={`border-b border-[#f5f4f2] hover:bg-[#fafaf9] ${i === DEMO_USERS.length - 1 ? "border-0" : ""}`}>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={u.avatarInitials} size="sm" />
                    <span className="text-sm font-medium text-[#111110]">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{u.email}</td>
                <td className="px-4 py-2.5">
                  <Badge variant={roleBadge[u.role]}>{roleLabels[u.role]}</Badge>
                </td>
                <td className="px-4 py-2.5 text-xs text-[#6b6966]">{u.gym ?? <span className="text-[#9b9895]">Platform-wide</span>}</td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-2">
                    <button className="text-xs text-[#1d4ed8] hover:underline">Edit</button>
                    <button className="text-xs text-red-600 hover:underline">Revoke</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
